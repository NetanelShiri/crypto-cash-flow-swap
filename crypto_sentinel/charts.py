"""Chart generation module for CryptoSentinel."""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import pandas as pd
import numpy as np

from crypto_sentinel.technical_analysis import compute_rsi, compute_moving_averages, compute_bollinger_bands


def generate_coin_chart(
    price_history: pd.DataFrame,
    symbol: str,
    output_dir: str = "crypto_sentinel/data/charts",
) -> str:
    """Generate a comprehensive technical analysis chart for a coin.

    Returns the path to the saved chart image.
    """
    os.makedirs(output_dir, exist_ok=True)

    if price_history.empty or len(price_history) < 5:
        return ""

    prices = price_history["price"]

    fig, axes = plt.subplots(3, 1, figsize=(14, 10), gridspec_kw={"height_ratios": [3, 1, 1]})
    fig.suptitle(f"{symbol} — Technical Analysis Chart", fontsize=14, fontweight="bold")

    # Price + Bollinger Bands + Moving Averages
    ax1 = axes[0]
    ax1.plot(prices.index, prices, label="Price", color="#2c3e50", linewidth=1.5)

    if len(prices) >= 20:
        bb = compute_bollinger_bands(prices)
        ax1.plot(prices.index, bb["upper"], "--", color="#e74c3c", alpha=0.5, label="BB Upper")
        ax1.plot(prices.index, bb["middle"], "--", color="#95a5a6", alpha=0.5, label="BB Middle")
        ax1.plot(prices.index, bb["lower"], "--", color="#2ecc71", alpha=0.5, label="BB Lower")
        ax1.fill_between(prices.index, bb["lower"], bb["upper"], alpha=0.05, color="#3498db")

    if len(prices) >= 7:
        ma = compute_moving_averages(prices)
        ax1.plot(prices.index, ma["ma_short"], label=f"MA{7}", color="#e67e22", linewidth=1)
        if len(prices) >= 25:
            ax1.plot(prices.index, ma["ma_long"], label=f"MA{25}", color="#8e44ad", linewidth=1)

    ax1.set_ylabel("Price ($)")
    ax1.legend(loc="upper left", fontsize=8)
    ax1.grid(True, alpha=0.3)

    # RSI
    ax2 = axes[1]
    rsi = compute_rsi(prices)
    ax2.plot(prices.index, rsi, color="#3498db", linewidth=1)
    ax2.axhline(y=70, color="#e74c3c", linestyle="--", alpha=0.7)
    ax2.axhline(y=30, color="#2ecc71", linestyle="--", alpha=0.7)
    ax2.fill_between(prices.index, 70, 100, alpha=0.1, color="#e74c3c")
    ax2.fill_between(prices.index, 0, 30, alpha=0.1, color="#2ecc71")
    ax2.set_ylabel("RSI")
    ax2.set_ylim(0, 100)
    ax2.grid(True, alpha=0.3)

    # Volume
    ax3 = axes[2]
    if "volume" in price_history.columns:
        volumes = price_history["volume"]
        colors = ["#2ecc71" if prices.iloc[i] >= prices.iloc[max(0, i-1)]
                  else "#e74c3c" for i in range(len(prices))]
        ax3.bar(volumes.index, volumes, color=colors, alpha=0.7, width=0.8)
        ax3.set_ylabel("Volume")
    ax3.grid(True, alpha=0.3)

    for ax in axes:
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%m/%d"))

    plt.tight_layout()

    filepath = os.path.join(output_dir, f"{symbol}_analysis.png")
    fig.savefig(filepath, dpi=100, bbox_inches="tight")
    plt.close(fig)

    return filepath


def generate_summary_chart(results: list[dict], output_dir: str = "crypto_sentinel/data/charts") -> str:
    """Generate a summary comparison chart for all coins."""
    os.makedirs(output_dir, exist_ok=True)

    if not results:
        return ""

    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    fig.suptitle("CryptoSentinel — Market Summary", fontsize=14, fontweight="bold")

    symbols = [r["symbol"] for r in results]

    # 1. Price change comparison
    ax = axes[0][0]
    changes_24h = [r.get("change_24h", 0) or 0 for r in results]
    colors = ["#2ecc71" if c >= 0 else "#e74c3c" for c in changes_24h]
    ax.barh(symbols, changes_24h, color=colors)
    ax.set_title("24h Price Change (%)")
    ax.axvline(x=0, color="gray", linestyle="-", alpha=0.3)

    # 2. Sentiment scores
    ax = axes[0][1]
    sentiments = [r.get("sentiment_score", 50) or 50 for r in results]
    s_colors = ["#2ecc71" if s >= 60 else "#e74c3c" if s < 40 else "#f39c12" for s in sentiments]
    ax.barh(symbols, sentiments, color=s_colors)
    ax.set_title("Sentiment Score")
    ax.axvline(x=50, color="gray", linestyle="--", alpha=0.5)
    ax.set_xlim(0, 100)

    # 3. RSI values
    ax = axes[1][0]
    rsi_vals = [r.get("rsi", 50) or 50 for r in results]
    r_colors = ["#e74c3c" if r > 70 else "#2ecc71" if r < 30 else "#3498db" for r in rsi_vals]
    ax.barh(symbols, rsi_vals, color=r_colors)
    ax.set_title("RSI")
    ax.axvline(x=70, color="#e74c3c", linestyle="--", alpha=0.5)
    ax.axvline(x=30, color="#2ecc71", linestyle="--", alpha=0.5)
    ax.set_xlim(0, 100)

    # 4. Signals pie chart
    ax = axes[1][1]
    signal_counts = {"LONG": 0, "SHORT": 0, "NEUTRAL": 0}
    for r in results:
        sig = r.get("signal", "NEUTRAL")
        signal_counts[sig] = signal_counts.get(sig, 0) + 1
    labels = [k for k, v in signal_counts.items() if v > 0]
    sizes = [v for v in signal_counts.values() if v > 0]
    pie_colors = {"LONG": "#2ecc71", "SHORT": "#e74c3c", "NEUTRAL": "#f39c12"}
    ax.pie(sizes, labels=labels, colors=[pie_colors[l] for l in labels],
           autopct="%1.0f%%", startangle=90)
    ax.set_title("Signal Distribution")

    plt.tight_layout()

    filepath = os.path.join(output_dir, "summary.png")
    fig.savefig(filepath, dpi=100, bbox_inches="tight")
    plt.close(fig)

    return filepath
