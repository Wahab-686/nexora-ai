from supabase import Client, create_client
from supabase.lib.client_options import SyncClientOptions

from app.core.config import settings


supabase_options = SyncClientOptions(
    headers={
        "Authorization": f"Bearer {settings.supabase_service_role_key}",
    }
)

supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_key,
    supabase_options,
)

DATABASE_STATUS = "configured"