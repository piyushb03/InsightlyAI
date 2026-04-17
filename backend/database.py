"""
Supabase client — used by all routes.
Uses the SERVICE ROLE key so it bypasses RLS entirely.
Auth is still enforced via JWT verification in auth_utils.py (require_auth).
"""
import os
from supabase import create_client, Client

_supabase_client: Client | None = None


def get_db() -> Client:
    global _supabase_client
    if _supabase_client is None:
        url = os.getenv("SUPABASE_URL", "")
        key = os.getenv("SUPABASE_SERVICE_KEY", "")
        if not url or not key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in backend/.env"
            )
        _supabase_client = create_client(url, key)
    return _supabase_client
