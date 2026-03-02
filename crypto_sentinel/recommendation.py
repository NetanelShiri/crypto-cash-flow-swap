"""Recommendation engine - generates LONG/SHORT/NEUTRAL signals with TP/SL."""

from crypto_sentinel.config import (
    LONG_CHANGE_24H, LONG_CHANGE_7D, LONG_SENTIMENT,
    SHORT_CHANGE_24H, SHORT_CHANGE_7D, SHORT_SENTIMENT,
    RSI_OVERBOUGHT, TAKE_PROFIT_PCT, STOP_LOSS_PCT,
)


def generate_recommendation(
    change_24h: float,
    change_7d: float,
    sentiment_score: float,
    rsi: float,
    ta_score: float,
    volume_24h: float = 0,
) -> dict:
    """Generate trading recommendation based on multi-factor analysis.

    Returns dict with:
        - signal: 'LONG' | 'SHORT' | 'NEUTRAL'
        - confidence: 0-100
        - reasons: list of reason strings
    """
    long_points = 0
    short_points = 0
    reasons = []

    # Price change 24h
    if change_24h > LONG_CHANGE_24H:
        long_points += 20
        reasons.append(f"24h change +{change_24h:.1f}% (bullish)")
    elif change_24h < SHORT_CHANGE_24H:
        short_points += 20
        reasons.append(f"24h change {change_24h:.1f}% (bearish)")

    # Price change 7d
    if change_7d > LONG_CHANGE_7D:
        long_points += 20
        reasons.append(f"7d change +{change_7d:.1f}% (bullish trend)")
    elif change_7d < SHORT_CHANGE_7D:
        short_points += 20
        reasons.append(f"7d change {change_7d:.1f}% (bearish trend)")

    # Sentiment
    if sentiment_score > LONG_SENTIMENT:
        long_points += 20
        reasons.append(f"Sentiment {sentiment_score:.0f}% positive (bullish)")
    elif sentiment_score < SHORT_SENTIMENT:
        short_points += 20
        reasons.append(f"Sentiment {sentiment_score:.0f}% positive (bearish)")

    # RSI
    if rsi > RSI_OVERBOUGHT:
        short_points += 20
        reasons.append(f"RSI {rsi:.1f} — overbought")
    elif rsi < 30:
        long_points += 20
        reasons.append(f"RSI {rsi:.1f} — oversold (potential bounce)")

    # TA composite score
    if ta_score >= 65:
        long_points += 20
        reasons.append(f"TA score {ta_score}/100 (bullish technicals)")
    elif ta_score <= 35:
        short_points += 20
        reasons.append(f"TA score {ta_score}/100 (bearish technicals)")

    # Decision
    if long_points > short_points and long_points >= 40:
        signal = "LONG"
        confidence = min(100, long_points)
    elif short_points > long_points and short_points >= 40:
        signal = "SHORT"
        confidence = min(100, short_points)
    else:
        signal = "NEUTRAL"
        confidence = 50
        if not reasons:
            reasons.append("Mixed or insufficient signals — consolidation phase")

    return {
        "signal": signal,
        "confidence": confidence,
        "reasons": reasons,
    }


def compute_tp_sl(price: float, signal: str) -> dict:
    """Compute Take Profit and Stop Loss based on current price and signal.

    For LONG: TP above, SL below.
    For SHORT: TP below, SL above.
    For NEUTRAL: symmetric bands.
    """
    if signal == "LONG":
        tp = round(price * (1 + TAKE_PROFIT_PCT / 100), 6)
        sl = round(price * (1 - STOP_LOSS_PCT / 100), 6)
    elif signal == "SHORT":
        tp = round(price * (1 - TAKE_PROFIT_PCT / 100), 6)
        sl = round(price * (1 + STOP_LOSS_PCT / 100), 6)
    else:
        tp = round(price * (1 + TAKE_PROFIT_PCT / 100), 6)
        sl = round(price * (1 - STOP_LOSS_PCT / 100), 6)

    return {
        "take_profit": tp,
        "stop_loss": sl,
        "tp_pct": TAKE_PROFIT_PCT if signal != "SHORT" else -TAKE_PROFIT_PCT,
        "sl_pct": -STOP_LOSS_PCT if signal != "SHORT" else STOP_LOSS_PCT,
    }
