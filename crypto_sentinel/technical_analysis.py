"""Technical analysis module - RSI, Moving Averages, MACD.

Built from scratch with pandas/numpy (no TA-Lib dependency).
"""

import numpy as np
import pandas as pd
from crypto_sentinel.config import (
    RSI_PERIOD, MA_SHORT, MA_LONG,
    MACD_FAST, MACD_SLOW, MACD_SIGNAL,
)


def compute_rsi(prices: pd.Series, period: int = RSI_PERIOD) -> pd.Series:
    """Compute Relative Strength Index (RSI)."""
    delta = prices.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = (-delta).where(delta < 0, 0.0)

    avg_gain = gain.ewm(alpha=1 / period, min_periods=period).mean()
    avg_loss = loss.ewm(alpha=1 / period, min_periods=period).mean()

    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


def compute_moving_averages(prices: pd.Series) -> dict:
    """Compute short and long moving averages."""
    ma_short = prices.rolling(window=MA_SHORT).mean()
    ma_long = prices.rolling(window=MA_LONG).mean()
    return {
        "ma_short": ma_short,
        "ma_long": ma_long,
        "ma_cross": "bullish" if ma_short.iloc[-1] > ma_long.iloc[-1] else "bearish",
    }


def compute_macd(prices: pd.Series) -> dict:
    """Compute MACD (Moving Average Convergence Divergence)."""
    ema_fast = prices.ewm(span=MACD_FAST, adjust=False).mean()
    ema_slow = prices.ewm(span=MACD_SLOW, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=MACD_SIGNAL, adjust=False).mean()
    histogram = macd_line - signal_line

    return {
        "macd_line": macd_line,
        "signal_line": signal_line,
        "histogram": histogram,
        "macd_cross": "bullish" if macd_line.iloc[-1] > signal_line.iloc[-1] else "bearish",
    }


def compute_bollinger_bands(prices: pd.Series, period: int = 20, std_dev: int = 2) -> dict:
    """Compute Bollinger Bands."""
    sma = prices.rolling(window=period).mean()
    std = prices.rolling(window=period).std()
    upper = sma + (std * std_dev)
    lower = sma - (std * std_dev)

    current_price = prices.iloc[-1]
    if current_price > upper.iloc[-1]:
        position = "above_upper"
    elif current_price < lower.iloc[-1]:
        position = "below_lower"
    else:
        position = "within_bands"

    return {
        "upper": upper,
        "middle": sma,
        "lower": lower,
        "position": position,
    }


def full_technical_analysis(price_history: pd.DataFrame) -> dict:
    """Run full technical analysis on price history DataFrame.

    Expects a DataFrame with a 'price' column.
    Returns a dict with all indicators and their latest values.
    """
    if price_history.empty or len(price_history) < MA_LONG:
        return {
            "rsi": 50.0,
            "rsi_signal": "neutral",
            "ma_cross": "neutral",
            "macd_cross": "neutral",
            "bollinger": "neutral",
            "ta_score": 50,
        }

    prices = price_history["price"]

    rsi = compute_rsi(prices)
    current_rsi = round(rsi.iloc[-1], 2)

    if current_rsi > 70:
        rsi_signal = "overbought"
    elif current_rsi < 30:
        rsi_signal = "oversold"
    else:
        rsi_signal = "neutral"

    ma = compute_moving_averages(prices)
    macd = compute_macd(prices)
    bb = compute_bollinger_bands(prices)

    # Compute a composite TA score (0-100, higher = more bullish)
    score = 50
    if rsi_signal == "oversold":
        score += 15
    elif rsi_signal == "overbought":
        score -= 15

    if ma["ma_cross"] == "bullish":
        score += 10
    else:
        score -= 10

    if macd["macd_cross"] == "bullish":
        score += 15
    else:
        score -= 15

    if bb["position"] == "below_lower":
        score += 10
    elif bb["position"] == "above_upper":
        score -= 10

    score = max(0, min(100, score))

    return {
        "rsi": current_rsi,
        "rsi_signal": rsi_signal,
        "ma_cross": ma["ma_cross"],
        "macd_cross": macd["macd_cross"],
        "bollinger": bb["position"],
        "ta_score": score,
        "ma_short_val": round(ma["ma_short"].iloc[-1], 4),
        "ma_long_val": round(ma["ma_long"].iloc[-1], 4),
        "macd_val": round(macd["macd_line"].iloc[-1], 6),
        "macd_signal_val": round(macd["signal_line"].iloc[-1], 6),
    }
