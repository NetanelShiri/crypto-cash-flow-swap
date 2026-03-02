"""Configuration for CryptoSentinel."""

# Coin list: CoinGecko IDs mapped to symbols
COINS = {
    "bitcoin": "BTC",
    "ethereum": "ETH",
    "solana": "SOL",
    "binancecoin": "BNB",
    "ripple": "XRP",
    "cardano": "ADA",
    "dogecoin": "DOGE",
    "shiba-inu": "SHIB",
    "avalanche-2": "AVAX",
    "chainlink": "LINK",
}

COIN_IDS = list(COINS.keys())
SYMBOLS = list(COINS.values())

# CoinGecko free API base URL
COINGECKO_BASE = "https://api.coingecko.com/api/v3"

# Fear & Greed Index
FEAR_GREED_URL = "https://api.alternative.me/fng/?limit=1"

# Sentiment keywords
BULLISH_WORDS = [
    "bull", "bullish", "moon", "pump", "buy", "long", "breakout", "rally",
    "surge", "green", "ath", "all time high", "up", "growth", "gain",
    "accumulate", "hodl", "fomo", "rocket", "parabolic",
]

BEARISH_WORDS = [
    "bear", "bearish", "dump", "sell", "short", "crash", "drop", "red",
    "decline", "fall", "dip", "correction", "fear", "panic", "rug",
    "scam", "collapse", "liquidation", "recession", "capitulation",
]

# Technical analysis thresholds
RSI_OVERBOUGHT = 70
RSI_OVERSOLD = 30
RSI_PERIOD = 14
MA_SHORT = 7
MA_LONG = 25
MACD_FAST = 12
MACD_SLOW = 26
MACD_SIGNAL = 9

# Recommendation thresholds
LONG_CHANGE_24H = 2.0    # > +2%
LONG_CHANGE_7D = 5.0     # > +5%
LONG_SENTIMENT = 60       # > 60% positive
SHORT_CHANGE_24H = -2.0  # < -2%
SHORT_CHANGE_7D = -5.0   # < -5%
SHORT_SENTIMENT = 40      # < 40% positive

# Take Profit / Stop Loss percentages
TAKE_PROFIT_PCT = 10.0   # +10% from current price
STOP_LOSS_PCT = 5.0      # -5% from current price

# SQLite database path — use /tmp on Streamlit Cloud (ephemeral but writable)
import os as _os
if _os.environ.get("STREAMLIT_SERVER_HEADLESS") or _os.path.exists("/mount/src"):
    DB_PATH = "/tmp/crypto_sentinel/sentinel.db"
else:
    DB_PATH = "crypto_sentinel/data/sentinel.db"

# Update interval in minutes
UPDATE_INTERVAL = 60

# Currency
VS_CURRENCY = "usd"
