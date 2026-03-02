"""Sentiment analysis module.

Combines:
- Keyword-based sentiment scoring from web search results
- Fear & Greed Index
"""

import re
from crypto_sentinel.config import BULLISH_WORDS, BEARISH_WORDS, COINS


def compute_keyword_sentiment(texts: list[str]) -> dict:
    """Compute sentiment score from a list of text snippets.

    Returns:
        dict with 'score' (0-100), 'bullish_count', 'bearish_count', 'total_signals'.
    """
    bullish_count = 0
    bearish_count = 0

    for text in texts:
        text_lower = text.lower()
        for word in BULLISH_WORDS:
            bullish_count += len(re.findall(r'\b' + re.escape(word) + r'\b', text_lower))
        for word in BEARISH_WORDS:
            bearish_count += len(re.findall(r'\b' + re.escape(word) + r'\b', text_lower))

    total = bullish_count + bearish_count
    if total == 0:
        score = 50  # neutral
    else:
        score = round((bullish_count / total) * 100, 1)

    return {
        "score": score,
        "bullish_count": bullish_count,
        "bearish_count": bearish_count,
        "total_signals": total,
    }


def combine_sentiment(keyword_score: float, fear_greed_value: int) -> float:
    """Combine keyword sentiment with Fear & Greed Index.

    Weights: 60% keyword sentiment, 40% Fear & Greed.
    """
    combined = (keyword_score * 0.6) + (fear_greed_value * 0.4)
    return round(combined, 1)


def generate_sentiment_summary(symbol: str, score: float) -> str:
    """Generate human-readable sentiment summary."""
    if score >= 75:
        return f"Very Bullish sentiment for {symbol} — strong positive signals"
    elif score >= 60:
        return f"Bullish sentiment for {symbol} — positive outlook"
    elif score >= 40:
        return f"Neutral sentiment for {symbol} — mixed signals"
    elif score >= 25:
        return f"Bearish sentiment for {symbol} — negative outlook"
    else:
        return f"Very Bearish sentiment for {symbol} — strong negative signals"
