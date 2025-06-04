import os

ALLOWED_ORIGINS = ["*"]
SECRET_KEY = "secret-key-not-expose-backend-outside-app"

# Database Configuration
DATABASE_URL = "sqlite:///./app_database.db"

# For async SQLite operations
ASYNC_DATABASE_URL = "sqlite+aiosqlite:///./app_database.db"