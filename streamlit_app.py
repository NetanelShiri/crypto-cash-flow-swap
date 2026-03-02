"""Entry point for Streamlit Cloud deployment.

Streamlit Cloud looks for this file at the repo root by default.
It simply loads the CryptoSentinel dashboard.
"""

import sys
import os

# Add project root to path so crypto_sentinel package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the dashboard (all Streamlit code executes on import)
import crypto_sentinel.dashboard  # noqa: F401
