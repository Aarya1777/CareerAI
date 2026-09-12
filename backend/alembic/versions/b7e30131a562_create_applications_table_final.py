"""create applications table final

Revision ID: b7e30131a562
Revises: d1bf23c358a5
Create Date: 2026-09-05 18:23:48.467128

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'b7e30131a562'
down_revision: Union[str, Sequence[str], None] = 'd1bf23c358a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('resume_id', sa.Integer(), sa.ForeignKey('resumes.id', ondelete='SET NULL'), nullable=True),
        sa.Column('job_title', sa.String(), nullable=False),
        sa.Column('company_name', sa.String(), nullable=False),
        sa.Column('job_url', sa.String(), nullable=False),
        sa.Column('external_job_id', sa.String(), nullable=True),
        sa.Column('match_score', sa.Float(), nullable=True),
        sa.Column('current_status', sa.String(), server_default='applied'),
        sa.Column('applied_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('last_updated_at', sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('applications')
