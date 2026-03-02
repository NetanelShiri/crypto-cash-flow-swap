"""SQLite database layer for storing analysis history."""

import os
import sqlite3
import json
from datetime import datetime
from crypto_sentinel.config import DB_PATH


def _get_connection() -> sqlite3.Connection:
    """Get database connection, creating tables if needed."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    _create_tables(conn)
    return conn


def _create_tables(conn: sqlite3.Connection):
    """Create tables if they don't exist."""
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS analysis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            coin_id TEXT NOT NULL,
            symbol TEXT NOT NULL,
            price REAL,
            change_24h REAL,
            change_7d REAL,
            volume_24h REAL,
            rsi REAL,
            ta_score REAL,
            sentiment_score REAL,
            signal TEXT,
            confidence REAL,
            take_profit REAL,
            stop_loss REAL,
            reasons TEXT,
            fear_greed_value INTEGER,
            fear_greed_label TEXT
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            coin_id TEXT NOT NULL,
            symbol TEXT NOT NULL,
            alert_type TEXT NOT NULL,
            message TEXT NOT NULL,
            acknowledged INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_history_coin ON analysis_history(coin_id, timestamp);
        CREATE INDEX IF NOT EXISTS idx_alerts_coin ON alerts(coin_id, timestamp);
    """)
    conn.commit()


def save_analysis(record: dict):
    """Save a single analysis record to the database."""
    conn = _get_connection()
    try:
        conn.execute("""
            INSERT INTO analysis_history
            (timestamp, coin_id, symbol, price, change_24h, change_7d,
             volume_24h, rsi, ta_score, sentiment_score, signal, confidence,
             take_profit, stop_loss, reasons, fear_greed_value, fear_greed_label)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record.get("timestamp", datetime.utcnow().isoformat()),
            record["coin_id"],
            record["symbol"],
            record.get("price"),
            record.get("change_24h"),
            record.get("change_7d"),
            record.get("volume_24h"),
            record.get("rsi"),
            record.get("ta_score"),
            record.get("sentiment_score"),
            record.get("signal"),
            record.get("confidence"),
            record.get("take_profit"),
            record.get("stop_loss"),
            json.dumps(record.get("reasons", []), ensure_ascii=False),
            record.get("fear_greed_value"),
            record.get("fear_greed_label"),
        ))
        conn.commit()
    finally:
        conn.close()


def save_alert(coin_id: str, symbol: str, alert_type: str, message: str):
    """Save an alert to the database."""
    conn = _get_connection()
    try:
        conn.execute("""
            INSERT INTO alerts (timestamp, coin_id, symbol, alert_type, message)
            VALUES (?, ?, ?, ?, ?)
        """, (datetime.utcnow().isoformat(), coin_id, symbol, alert_type, message))
        conn.commit()
    finally:
        conn.close()


def get_latest_analysis(limit: int = 10) -> list[dict]:
    """Get latest analysis records grouped by coin."""
    conn = _get_connection()
    try:
        rows = conn.execute("""
            SELECT * FROM analysis_history
            WHERE id IN (
                SELECT MAX(id) FROM analysis_history GROUP BY coin_id
            )
            ORDER BY symbol
            LIMIT ?
        """, (limit,)).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_coin_history(coin_id: str, limit: int = 100) -> list[dict]:
    """Get analysis history for a specific coin."""
    conn = _get_connection()
    try:
        rows = conn.execute("""
            SELECT * FROM analysis_history
            WHERE coin_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        """, (coin_id, limit)).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_recent_alerts(limit: int = 50) -> list[dict]:
    """Get recent alerts."""
    conn = _get_connection()
    try:
        rows = conn.execute("""
            SELECT * FROM alerts
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,)).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()
