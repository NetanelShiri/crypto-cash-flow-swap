"""Demo data for CryptoSentinel when live APIs are unavailable.

These are realistic sample values for demonstration purposes.
In production, all data comes from live CoinGecko API.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

DEMO_MARKET_DATA = [
    {
        "coin_id": "bitcoin", "symbol": "BTC", "name": "Bitcoin",
        "price": 84250.00, "market_cap": 1670000000000,
        "volume_24h": 32500000000, "change_24h_pct": 2.8,
        "change_7d_pct": 6.5, "high_24h": 85100, "low_24h": 81900,
        "circulating_supply": 19800000,
    },
    {
        "coin_id": "ethereum", "symbol": "ETH", "name": "Ethereum",
        "price": 2280.00, "market_cap": 274000000000,
        "volume_24h": 15200000000, "change_24h_pct": -1.2,
        "change_7d_pct": -3.8, "high_24h": 2340, "low_24h": 2250,
        "circulating_supply": 120000000,
    },
    {
        "coin_id": "solana", "symbol": "SOL", "name": "Solana",
        "price": 140.50, "market_cap": 68000000000,
        "volume_24h": 3800000000, "change_24h_pct": 4.5,
        "change_7d_pct": 12.3, "high_24h": 142, "low_24h": 133,
        "circulating_supply": 484000000,
    },
    {
        "coin_id": "binancecoin", "symbol": "BNB", "name": "BNB",
        "price": 635.00, "market_cap": 92000000000,
        "volume_24h": 1800000000, "change_24h_pct": 0.8,
        "change_7d_pct": 2.1, "high_24h": 640, "low_24h": 625,
        "circulating_supply": 145000000,
    },
    {
        "coin_id": "ripple", "symbol": "XRP", "name": "XRP",
        "price": 2.35, "market_cap": 135000000000,
        "volume_24h": 5600000000, "change_24h_pct": 3.2,
        "change_7d_pct": 8.7, "high_24h": 2.40, "low_24h": 2.25,
        "circulating_supply": 57400000000,
    },
    {
        "coin_id": "cardano", "symbol": "ADA", "name": "Cardano",
        "price": 0.72, "market_cap": 25500000000,
        "volume_24h": 680000000, "change_24h_pct": -3.1,
        "change_7d_pct": -7.2, "high_24h": 0.76, "low_24h": 0.70,
        "circulating_supply": 35400000000,
    },
    {
        "coin_id": "dogecoin", "symbol": "DOGE", "name": "Dogecoin",
        "price": 0.205, "market_cap": 30000000000,
        "volume_24h": 1200000000, "change_24h_pct": 5.8,
        "change_7d_pct": 3.2, "high_24h": 0.21, "low_24h": 0.19,
        "circulating_supply": 147000000000,
    },
    {
        "coin_id": "shiba-inu", "symbol": "SHIB", "name": "Shiba Inu",
        "price": 0.0000142, "market_cap": 8400000000,
        "volume_24h": 450000000, "change_24h_pct": -4.5,
        "change_7d_pct": -9.8, "high_24h": 0.0000155, "low_24h": 0.0000138,
        "circulating_supply": 589000000000000,
    },
    {
        "coin_id": "avalanche-2", "symbol": "AVAX", "name": "Avalanche",
        "price": 22.80, "market_cap": 9200000000,
        "volume_24h": 380000000, "change_24h_pct": 1.5,
        "change_7d_pct": 4.2, "high_24h": 23.10, "low_24h": 22.10,
        "circulating_supply": 404000000,
    },
    {
        "coin_id": "chainlink", "symbol": "LINK", "name": "Chainlink",
        "price": 15.60, "market_cap": 9800000000,
        "volume_24h": 520000000, "change_24h_pct": 2.4,
        "change_7d_pct": 5.8, "high_24h": 15.90, "low_24h": 15.10,
        "circulating_supply": 626000000,
    },
]


def get_demo_market_df() -> pd.DataFrame:
    """Return demo market data as a DataFrame."""
    return pd.DataFrame(DEMO_MARKET_DATA)


def generate_demo_price_history(base_price: float, days: int = 30, volatility: float = 0.03) -> pd.DataFrame:
    """Generate realistic synthetic price history for technical analysis."""
    np.random.seed(hash(str(base_price)) % (2**31))
    dates = pd.date_range(end=datetime.utcnow(), periods=days, freq="D")

    # Random walk with drift
    returns = np.random.normal(0.001, volatility, days)
    prices = base_price * np.exp(np.cumsum(returns))
    volumes = np.random.uniform(0.5, 1.5, days) * base_price * 1000000

    df = pd.DataFrame({
        "price": prices,
        "volume": volumes,
    }, index=dates)
    df.index.name = "timestamp"

    return df
