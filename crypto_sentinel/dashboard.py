"""Streamlit dashboard for CryptoSentinel."""

import sys
import os

# Ensure the project root is on sys.path so imports work when Streamlit runs this file
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

import json
import streamlit as st
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from crypto_sentinel.analyzer import run_full_analysis
from crypto_sentinel.database import get_latest_analysis, get_coin_history, get_recent_alerts
from crypto_sentinel.config import COINS


# Page config
st.set_page_config(
    page_title="CryptoSentinel Dashboard",
    page_icon="🛡️",
    layout="wide",
)

st.title("🛡️ CryptoSentinel — ניתוח קריפטו בזמן אמת")
st.caption("ניתוח טכני, סנטימנט, והמלצות LONG/SHORT מבוססות נתונים")

# Sidebar
st.sidebar.header("⚙️ הגדרות")

if st.sidebar.button("🔄 הרץ ניתוח חדש", type="primary"):
    with st.spinner("מריץ ניתוח מלא... (עלול לקחת כדקה)"):
        progress_bar = st.progress(0)
        status_text = st.empty()

        def update_progress(current, total, message):
            try:
                progress_bar.progress(min(current / total, 1.0) if total > 0 else 0)
                status_text.text(message)
            except Exception:
                pass

        try:
            results = run_full_analysis(progress_callback=update_progress)
            progress_bar.progress(1.0)
            status_text.text("✅ הניתוח הושלם!")
            st.session_state["results"] = results
        except Exception as e:
            progress_bar.empty()
            status_text.empty()
            st.error(f"שגיאה בניתוח: {e}")

st.sidebar.markdown("---")
st.sidebar.markdown("⚠️ **זה לא ייעוץ השקעות**")
st.sidebar.markdown("DYOR — Do Your Own Research")

# Main content
results = st.session_state.get("results", None)

# Try loading from DB if no fresh results
if results is None:
    try:
        db_results = get_latest_analysis(limit=20)
        if db_results:
            results = db_results
            st.info("📊 מציג נתונים מהניתוח האחרון שנשמר. לחץ 'הרץ ניתוח חדש' לעדכון.")
    except Exception:
        pass  # DB might not exist yet — that's fine

if results:
    # Fear & Greed
    fg_val = results[0].get("fear_greed_value", 50) if isinstance(results[0], dict) else 50
    fg_label = results[0].get("fear_greed_label", "Neutral") if isinstance(results[0], dict) else "Neutral"

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Fear & Greed Index", f"{fg_val}/100", fg_label)
    with col2:
        longs = sum(1 for r in results if (r.get("signal") or "") == "LONG")
        st.metric("LONG Signals", f"{longs}/{len(results)}")
    with col3:
        shorts = sum(1 for r in results if (r.get("signal") or "") == "SHORT")
        st.metric("SHORT Signals", f"{shorts}/{len(results)}")

    st.markdown("---")

    # Main analysis table
    st.subheader("📊 טבלת ניתוח")

    table_data = []
    for r in results:
        signal = r.get("signal", "NEUTRAL")
        signal_icon = {"LONG": "🟢", "SHORT": "🔴", "NEUTRAL": "🟡"}.get(signal, "⚪")

        price = r.get("price", 0)
        tp = r.get("take_profit", 0)
        sl = r.get("stop_loss", 0)

        table_data.append({
            "מטבע": r.get("symbol", ""),
            "מחיר ($)": f"${price:,.2f}" if price >= 1 else f"${price:.6f}",
            "24h%": f"{(r.get('change_24h') or 0):+.1f}%",
            "7d%": f"{(r.get('change_7d') or 0):+.1f}%",
            "RSI": f"{(r.get('rsi') or 50):.0f}",
            "סנטימנט": f"{(r.get('sentiment_score') or 50):.0f}%",
            "TA Score": f"{(r.get('ta_score') or 50):.0f}/100",
            "המלצה": f"{signal_icon} {signal}",
            "Take Profit": f"${tp:,.2f}" if tp >= 1 else f"${tp:.6f}",
            "Stop Loss": f"${sl:,.2f}" if sl >= 1 else f"${sl:.6f}",
            "ביטחון": f"{r.get('confidence', 0)}%",
        })

    df = pd.DataFrame(table_data)
    st.dataframe(df, use_container_width=True, hide_index=True)

    st.markdown("---")

    # Detailed view per coin
    st.subheader("🔎 פירוט לפי מטבע")

    symbols = [r.get("symbol", "") for r in results]
    selected = st.selectbox("בחר מטבע:", symbols)

    selected_result = next((r for r in results if r.get("symbol") == selected), None)
    if selected_result:
        col1, col2 = st.columns(2)

        with col1:
            st.markdown(f"### {selected_result.get('symbol', '')} — {selected_result.get('name', '')}")
            price = selected_result.get("price", 0)
            st.metric(
                "מחיר נוכחי",
                f"${price:,.2f}" if price >= 1 else f"${price:.6f}",
                f"{(selected_result.get('change_24h') or 0):+.1f}% (24h)",
            )

            signal = selected_result.get("signal", "NEUTRAL")
            signal_color = {"LONG": "green", "SHORT": "red", "NEUTRAL": "orange"}.get(signal, "gray")
            st.markdown(
                f"**המלצה:** <span style='color:{signal_color}; font-size:1.5em'>"
                f"**{signal}**</span> (ביטחון: {selected_result.get('confidence', 0)}%)",
                unsafe_allow_html=True,
            )

            tp = selected_result.get("take_profit", 0)
            sl = selected_result.get("stop_loss", 0)
            st.markdown(f"**Take Profit:** ${tp:,.2f}" if tp >= 1 else f"**Take Profit:** ${tp:.6f}")
            st.markdown(f"**Stop Loss:** ${sl:,.2f}" if sl >= 1 else f"**Stop Loss:** ${sl:.6f}")

        with col2:
            st.markdown("### אינדיקטורים טכניים")
            st.markdown(f"- **RSI:** {selected_result.get('rsi', 50):.1f} ({selected_result.get('rsi_signal', 'neutral')})")
            st.markdown(f"- **MA Cross:** {selected_result.get('ma_cross', 'neutral')}")
            st.markdown(f"- **MACD Cross:** {selected_result.get('macd_cross', 'neutral')}")
            st.markdown(f"- **TA Score:** {selected_result.get('ta_score', 50)}/100")
            st.markdown(f"- **Sentiment:** {(selected_result.get('sentiment_score') or 50):.0f}%")

            st.markdown("### סיבות:")
            reasons = selected_result.get("reasons", [])
            if isinstance(reasons, str):
                try:
                    reasons = json.loads(reasons)
                except (json.JSONDecodeError, TypeError):
                    reasons = [reasons]
            for reason in reasons:
                st.markdown(f"- {reason}")

    st.markdown("---")

    # Charts section
    st.subheader("📈 גרפים")

    # Sentiment comparison chart
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    coin_symbols = [r.get("symbol", "") for r in results]
    sentiments = [(r.get("sentiment_score") or 50) for r in results]
    colors = ["#2ecc71" if s >= 60 else "#e74c3c" if s < 40 else "#f39c12" for s in sentiments]

    axes[0].barh(coin_symbols, sentiments, color=colors)
    axes[0].set_xlabel("Sentiment Score (%)")
    axes[0].set_title("סנטימנט לפי מטבע")
    axes[0].axvline(x=50, color="gray", linestyle="--", alpha=0.5)
    axes[0].set_xlim(0, 100)

    # TA Score comparison
    ta_scores = [(r.get("ta_score") or 50) for r in results]
    ta_colors = ["#2ecc71" if s >= 65 else "#e74c3c" if s <= 35 else "#f39c12" for s in ta_scores]

    axes[1].barh(coin_symbols, ta_scores, color=ta_colors)
    axes[1].set_xlabel("TA Score")
    axes[1].set_title("ציון ניתוח טכני")
    axes[1].axvline(x=50, color="gray", linestyle="--", alpha=0.5)
    axes[1].set_xlim(0, 100)

    plt.tight_layout()
    st.pyplot(fig)
    plt.close(fig)

    # Price changes chart
    fig2, ax2 = plt.subplots(figsize=(14, 5))
    x_pos = range(len(coin_symbols))
    changes_24h = [(r.get("change_24h") or 0) for r in results]
    changes_7d = [(r.get("change_7d") or 0) for r in results]

    bar_width = 0.35
    bars1 = ax2.bar([p - bar_width/2 for p in x_pos], changes_24h, bar_width,
                     label="24h Change %", color="#3498db")
    bars2 = ax2.bar([p + bar_width/2 for p in x_pos], changes_7d, bar_width,
                     label="7d Change %", color="#9b59b6")

    ax2.set_ylabel("% Change")
    ax2.set_title("שינוי מחיר 24h / 7d")
    ax2.set_xticks(list(x_pos))
    ax2.set_xticklabels(coin_symbols)
    ax2.legend()
    ax2.axhline(y=0, color="gray", linestyle="-", alpha=0.3)

    plt.tight_layout()
    st.pyplot(fig2)
    plt.close(fig2)

    # Alerts
    st.markdown("---")
    st.subheader("🚨 התראות")
    try:
        alerts = get_recent_alerts(limit=20)
        if alerts:
            for alert in alerts:
                st.warning(f"**{alert['symbol']}** [{alert['timestamp'][:16]}] — {alert['message']}")
        else:
            st.success("אין התראות פעילות.")
    except Exception:
        st.success("אין התראות פעילות.")

else:
    st.info("👈 לחץ על 'הרץ ניתוח חדש' בסרגל הצד כדי להתחיל.")
    st.markdown("""
    ### מה המערכת עושה?
    1. **שולפת נתוני שוק חיים** מ-CoinGecko (מחירים, ווליום, שינויים)
    2. **מחשבת אינדיקטורים טכניים** — RSI, Moving Averages, MACD, Bollinger Bands
    3. **מנתחת סנטימנט** — ניתוח מילות מפתח + Fear & Greed Index
    4. **מייצרת המלצות** — LONG / SHORT / NEUTRAL עם Take Profit ו-Stop Loss
    5. **שומרת היסטוריה** — כל הניתוחים נשמרים ב-SQLite

    ### מטבעות נתמכים:
    BTC, ETH, SOL, BNB, XRP, ADA, DOGE, SHIB, AVAX, LINK
    """)
