import sys, os
from logging.config import fileConfig

from sqlalchemy import create_engine
from sqlalchemy import pool

from alembic import context

# ---- FIX BLOCK ----
sys.path.append(os.getcwd())
from core.config import settings
from core.database import Base
from modules.auth.models import User   # import every model file here as you add more modules
# --------------------
from modules.resumes.models import Resume
from modules.reports.models import Report

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # build the engine directly from settings — never goes through configparser,
    # so the % in the password can never trigger an interpolation error
    connectable = create_engine(settings.database_url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()


from modules.auth.models import User
from modules.resumes.models import Resume, ResumeHistory
from modules.reports.models import Report
from modules.applications.models import Application
