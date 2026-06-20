import os 
from supabase import create_client


SUPABASE_URL = os.environ["SUPABASE_URL"]
SERVICE_KEY = os.environ["SERVICE_KEY"]

supabase = create_client(SUPABASE_URL,SERVICE_KEY)
