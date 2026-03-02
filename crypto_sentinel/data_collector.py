"""Data collection module - fetches live data from CoinGecko API."""

import time
import requests
import pandas as pd
from typing import Optional
from crypto_sentinel.config import (
    COINGECKO_BASE, COIN_IDS, COINS, VS_CURRENCY, FEAR_GREED_URL,
)


def fetch_market_data() -> pd.DataFrame:
    """Fetch current market data for all tracked coins from CoinGecko."""
    ids_str = ",".join(COIN_IDS)
    url = f"{COINGECKO_BASE}/coins/markets"
    params = {
        "vs_currency": VS_CURRENCY,
        "ids": ids_str,
        "order": "market_cap_desc",
        "per_page": len(COIN_IDS),
        "page": 1,
        "sparkline": "false",
        "price_change_percentage": "24h,7d",
    }

    resp = _request_with_retry(url, params)
    if resp is None:
        return pd.DataFrame()

    data = resp.json()
    rows = []
    for coin in data:
        rows.append({
            "coin_id": coin["id"],
            "symbol": coin["symbol"].upper(),
            "name": coin["name"],
            "price": coin["current_price"],
            "market_cap": coin["market_cap"],
            "volume_24h": coin["total_volume"],
            "change_24h_pct": coin.get("price_change_percentage_24h_in_currency", coin.get("price_change_percentage_24h", 0)),
            "change_7d_pct": coin.get("price_change_percentage_7d_in_currency", 0),
            "high_24h": coin.get("ath", coin.get("high_24h", 0)),
            "low_24h": coin.get("atl", coin.get("low_24h", 0)),
            "circulating_supply": coin.get("circulating_supply", 0),
        })

    return pd.DataFrame(rows)


def fetch_price_history(coin_id: str, days: int = 30) -> pd.DataFrame:
    """Fetch historical price data for technical analysis."""
    url = f"{COINGECKO_BASE}/coins/{coin_id}/market_chart"
    params = {
        "vs_currency": VS_CURRENCY,
        "days": days,
        "interval": "daily",
    }

    resp = _request_with_retry(url, params)
    if resp is None:
        return pd.DataFrame()

    data = resp.json()
    prices = data.get("prices", [])
    volumes = data.get("total_volumes", [])

    df = pd.DataFrame(prices, columns=["timestamp", "price"])
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    df.set_index("timestamp", inplace=True)

    if volumes:
        vol_df = pd.DataFrame(volumes, columns=["timestamp", "volume"])
        vol_df["timestamp"] = pd.to_datetime(vol_df["timestamp"], unit="ms")
        vol_df.set_index("timestamp", inplace=True)
        df = df.join(vol_df, how="left")

    return df


def fetch_fear_greed_index() -> dict:
    """Fetch the current Fear & Greed Index from Alternative.me."""
    resp = _request_with_retry(FEAR_GREED_URL)
    if resp is None:
        return {"value": 50, "classification": "Neutral"}

    data = resp.json()
    if "data" in data and len(data["data"]) > 0:
        entry = data["data"][0]
        return {
            "value": int(entry["value"]),
            "classification": entry["value_classification"],
        }
    return {"value": 50, "classification": "Neutral"}


def fetch_oil_price() -> Optional[float]:
    """Attempt to fetch oil (Brent crude) price for correlation analysis.
    Uses a free proxy; returns None if unavailable."""
    try:
        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {"ids": "crude-oil", "vs_currencies": "usd"}
        resp = _request_with_retry(url, params, max_retries=1)
        if resp and resp.status_code == 200:
            data = resp.json()
            if "crude-oil" in data:
                return data["crude-oil"]["usd"]
    except Exception:
        pass
    return None


def _request_with_retry(url: str, params: dict = None, max_retries: int = 2) -> Optional[requests.Response]:
    """Make HTTP request with exponential backoff retry."""
    for attempt in range(max_retries):
        try:
            resp = requests.get(url, params=params, timeout=5)
            if resp.status_code == 200:
                return resp
            if resp.status_code == 429:
                wait = 2 ** attempt
                time.sleep(wait)
                continue
            resp.raise_for_status()
        except requests.RequestException:
            if attempt < max_retries - 1:
                time.sleep(1)
    return None
