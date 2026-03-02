"""Main CryptoSentinel analyzer - orchestrates all modules."""

import time
from datetime import datetime
import pandas as pd

from crypto_sentinel.config import COINS, COIN_IDS
from crypto_sentinel.data_collector import (
    fetch_market_data, fetch_price_history, fetch_fear_greed_index,
)
from crypto_sentinel.demo_data import get_demo_market_df, generate_demo_price_history
from crypto_sentinel.technical_analysis import full_technical_analysis
from crypto_sentinel.sentiment import (
    compute_keyword_sentiment, combine_sentiment, generate_sentiment_summary,
)
from crypto_sentinel.recommendation import generate_recommendation, compute_tp_sl
from crypto_sentinel.database import save_analysis, save_alert


# Simulated sentiment data from web search results.
# In production, this would come from real X/Twitter API or web scraping.
_SAMPLE_HEADLINES = {
    "bitcoin": [
        "Bitcoin rally continues as institutional buyers accumulate",
        "BTC breaks through resistance, bulls target new ATH",
        "Bitcoin ETF inflows surge to record levels",
        "Whale alert: large BTC transfers detected on-chain",
    ],
    "ethereum": [
        "Ethereum upgrade boosts network throughput",
        "ETH staking rewards attract more validators",
        "DeFi growth drives Ethereum demand higher",
        "Ethereum faces selling pressure near key resistance",
    ],
    "solana": [
        "Solana DeFi TVL surges past $10B milestone",
        "SOL ecosystem expansion with new dApps launching",
        "Solana network stability improves after recent fixes",
    ],
    "binancecoin": [
        "BNB burn event reduces circulating supply",
        "Binance faces regulatory scrutiny in EU markets",
        "BNB Chain DeFi ecosystem grows steadily",
    ],
    "ripple": [
        "XRP legal clarity boosts institutional confidence",
        "Ripple expands cross-border payment partnerships",
        "XRP volume surges on positive regulatory news",
    ],
    "cardano": [
        "Cardano smart contract activity increases sharply",
        "ADA governance model attracts developer interest",
        "Cardano faces bear pressure amid market correction",
    ],
    "dogecoin": [
        "DOGE community rallies around new utility features",
        "Dogecoin pump fades as momentum slows",
        "DOGE whale accumulation detected on-chain",
    ],
    "shiba-inu": [
        "SHIB burn rate accelerates dramatically",
        "Shiba Inu ecosystem expands with Shibarium growth",
        "SHIB faces selling pressure as meme coin hype fades",
    ],
    "avalanche-2": [
        "Avalanche subnet adoption grows with enterprise partners",
        "AVAX rallies on new institutional partnerships",
        "Avalanche DeFi ecosystem shows steady growth",
    ],
    "chainlink": [
        "Chainlink CCIP adoption surges across blockchains",
        "LINK staking program attracts strong participation",
        "Chainlink partnerships expand oracle services",
    ],
}


def run_full_analysis(progress_callback=None) -> list[dict]:
    """Run complete analysis for all tracked coins.

    Args:
        progress_callback: Optional callable(current, total, message) for progress updates.

    Returns:
        List of analysis result dicts.
    """
    timestamp = datetime.utcnow().isoformat()
    results = []

    # Step 1: Fetch market data
    if progress_callback:
        progress_callback(0, 4, "שולף נתוני שוק מ-CoinGecko...")
    market_data = fetch_market_data()
    using_demo = False

    if market_data.empty:
        if progress_callback:
            progress_callback(0, 4, "API לא זמין — משתמש בנתוני דמו...")
        market_data = get_demo_market_df()
        using_demo = True

    # Step 2: Fetch Fear & Greed Index
    if progress_callback:
        progress_callback(1, 4, "שולף Fear & Greed Index...")
    fg = fetch_fear_greed_index()

    # Step 3: Analyze each coin
    total_coins = len(COIN_IDS)
    for i, coin_id in enumerate(COIN_IDS):
        symbol = COINS[coin_id]
        if progress_callback:
            progress_callback(2, 4, f"מנתח {symbol} ({i+1}/{total_coins})...")

        # Get market row
        coin_row = market_data[market_data["coin_id"] == coin_id]
        if coin_row.empty:
            continue
        coin_row = coin_row.iloc[0]

        # Fetch price history for TA
        if using_demo:
            history = generate_demo_price_history(coin_row["price"], days=30)
        else:
            history = fetch_price_history(coin_id, days=30)

        # Technical analysis
        ta = full_technical_analysis(history)

        # Sentiment analysis
        headlines = _SAMPLE_HEADLINES.get(coin_id, [])
        keyword_sent = compute_keyword_sentiment(headlines)
        sentiment_score = combine_sentiment(keyword_sent["score"], fg["value"])

        # Generate recommendation
        rec = generate_recommendation(
            change_24h=coin_row["change_24h_pct"] or 0,
            change_7d=coin_row["change_7d_pct"] or 0,
            sentiment_score=sentiment_score,
            rsi=ta["rsi"],
            ta_score=ta["ta_score"],
            volume_24h=coin_row["volume_24h"] or 0,
        )

        # Compute TP/SL
        tp_sl = compute_tp_sl(coin_row["price"], rec["signal"])

        # Build result
        result = {
            "timestamp": timestamp,
            "coin_id": coin_id,
            "symbol": symbol,
            "name": coin_row["name"],
            "price": coin_row["price"],
            "change_24h": coin_row["change_24h_pct"],
            "change_7d": coin_row["change_7d_pct"],
            "volume_24h": coin_row["volume_24h"],
            "market_cap": coin_row["market_cap"],
            "rsi": ta["rsi"],
            "rsi_signal": ta["rsi_signal"],
            "ma_cross": ta["ma_cross"],
            "macd_cross": ta["macd_cross"],
            "ta_score": ta["ta_score"],
            "sentiment_score": sentiment_score,
            "sentiment_summary": generate_sentiment_summary(symbol, sentiment_score),
            "signal": rec["signal"],
            "confidence": rec["confidence"],
            "reasons": rec["reasons"],
            "take_profit": tp_sl["take_profit"],
            "stop_loss": tp_sl["stop_loss"],
            "fear_greed_value": fg["value"],
            "fear_greed_label": fg["classification"],
        }

        results.append(result)

        # Save to DB (non-critical — don't crash if it fails)
        try:
            save_analysis(result)
        except Exception:
            pass

        # Check for alerts (>10% change)
        try:
            if abs(coin_row["change_24h_pct"] or 0) > 10:
                alert_msg = (
                    f"⚠️ {symbol} moved {coin_row['change_24h_pct']:.1f}% in 24h! "
                    f"Price: ${coin_row['price']:,.2f}"
                )
                save_alert(coin_id, symbol, "price_spike", alert_msg)
        except Exception:
            pass

        # Rate limiting for CoinGecko free API (skip for demo data)
        if not using_demo:
            time.sleep(1.5)

    if progress_callback:
        progress_callback(4, 4, "ניתוח הושלם!")

    return results


def _generate_fallback_results(timestamp: str) -> list[dict]:
    """Generate empty results when API is unreachable."""
    results = []
    for coin_id, symbol in COINS.items():
        results.append({
            "timestamp": timestamp,
            "coin_id": coin_id,
            "symbol": symbol,
            "name": coin_id.replace("-", " ").title(),
            "price": 0,
            "change_24h": 0,
            "change_7d": 0,
            "volume_24h": 0,
            "market_cap": 0,
            "rsi": 50,
            "rsi_signal": "neutral",
            "ma_cross": "neutral",
            "macd_cross": "neutral",
            "ta_score": 50,
            "sentiment_score": 50,
            "sentiment_summary": f"No data available for {symbol}",
            "signal": "NEUTRAL",
            "confidence": 0,
            "reasons": ["API unreachable — no live data"],
            "take_profit": 0,
            "stop_loss": 0,
            "fear_greed_value": 50,
            "fear_greed_label": "Neutral",
        })
    return results


def format_results_table(results: list[dict]) -> str:
    """Format results as a Markdown table for CLI output."""
    if not results:
        return "No data available."

    lines = []
    lines.append("# 🔍 CryptoSentinel Analysis Report")
    lines.append(f"**Timestamp:** {results[0]['timestamp']}")
    lines.append(f"**Fear & Greed Index:** {results[0]['fear_greed_value']} ({results[0]['fear_greed_label']})")
    lines.append("")
    lines.append("| מטבע | מחיר ($) | 24h% | 7d% | RSI | סנטימנט | המלצה | TP ($) | SL ($) | ביטחון |")
    lines.append("|------|----------|------|-----|-----|---------|-------|--------|--------|--------|")

    for r in results:
        signal_icon = {"LONG": "🟢", "SHORT": "🔴", "NEUTRAL": "🟡"}.get(r["signal"], "⚪")
        price_str = f"{r['price']:,.2f}" if r['price'] >= 1 else f"{r['price']:.6f}"
        tp_str = f"{r['take_profit']:,.2f}" if r['take_profit'] >= 1 else f"{r['take_profit']:.6f}"
        sl_str = f"{r['stop_loss']:,.2f}" if r['stop_loss'] >= 1 else f"{r['stop_loss']:.6f}"

        lines.append(
            f"| **{r['symbol']}** | {price_str} | "
            f"{r['change_24h']:+.1f}% | {r['change_7d']:+.1f}% | "
            f"{r['rsi']:.0f} | {r['sentiment_score']:.0f}% | "
            f"{signal_icon} {r['signal']} | {tp_str} | {sl_str} | "
            f"{r['confidence']}% |"
        )

    lines.append("")
    lines.append("---")
    lines.append("### פירוט סיבות:")
    lines.append("")
    for r in results:
        if r["reasons"]:
            lines.append(f"**{r['symbol']}:** {'; '.join(r['reasons'])}")

    lines.append("")
    lines.append("---")
    lines.append("⚠️ **זה לא ייעוץ השקעות – DYOR (Do Your Own Research)**")

    return "\n".join(lines)
