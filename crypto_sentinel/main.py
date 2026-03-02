#!/usr/bin/env python3
"""CryptoSentinel CLI — run analysis from the command line."""

import sys
import os
import argparse

# Ensure the project root is on sys.path
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from crypto_sentinel.analyzer import run_full_analysis, format_results_table
from crypto_sentinel.database import get_latest_analysis


def main():
    parser = argparse.ArgumentParser(
        description="CryptoSentinel — Real-time crypto analysis and sentiment engine"
    )
    parser.add_argument(
        "--mode",
        choices=["analyze", "report", "dashboard"],
        default="analyze",
        help="Mode: analyze (run new analysis), report (show last saved), dashboard (launch Streamlit)",
    )
    parser.add_argument(
        "--coins",
        nargs="+",
        help="Specific coin symbols to analyze (e.g., BTC ETH SOL)",
    )
    args = parser.parse_args()

    if args.mode == "dashboard":
        print("🛡️ Launching CryptoSentinel Dashboard...")
        dashboard_path = os.path.join(os.path.dirname(__file__), "dashboard.py")
        os.execlp("streamlit", "streamlit", "run", dashboard_path, "--server.headless", "true")

    elif args.mode == "report":
        print("📊 Loading last analysis from database...\n")
        results = get_latest_analysis(limit=20)
        if results:
            # Convert DB records to format expected by format_results_table
            for r in results:
                if "reasons" in r and isinstance(r["reasons"], str):
                    import json
                    try:
                        r["reasons"] = json.loads(r["reasons"])
                    except (json.JSONDecodeError, TypeError):
                        r["reasons"] = [r["reasons"]]
            print(format_results_table(results))
        else:
            print("❌ No saved analysis found. Run with --mode analyze first.")

    else:  # analyze
        print("🛡️ CryptoSentinel — Starting full analysis...\n")

        def progress(current, total, message):
            print(f"  [{current}/{total}] {message}")

        results = run_full_analysis(progress_callback=progress)
        print()
        print(format_results_table(results))
        print(f"\n✅ Analysis complete. {len(results)} coins analyzed and saved to database.")


if __name__ == "__main__":
    main()
