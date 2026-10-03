"""drop applications tables - feature paused

Revision ID: 6c3f96163a3f
Revises: 2dc672b6e3d0
Create Date: 2026-10-03 21:40:36.211406

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6c3f96163a3f'
down_revision: Union[str, Sequence[str], None] = '2dc672b6e3d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table('application_status_logs')
    op.drop_table('applications')

def downgrade() -> None:
    pass  # recreate tables here later if the feature comes back