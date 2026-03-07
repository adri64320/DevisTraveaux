"""Initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('email', sa.String(), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_users_email', 'users', ['email'])

    op.create_table(
        'salaries',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('nom', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('taux_horaire', sa.Float(), nullable=False),
    )
    op.create_index('ix_salaries_user_id', 'salaries', ['user_id'])

    op.create_table(
        'chantiers',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('nom', sa.String(), nullable=False),
        sa.Column('metier', sa.String(), nullable=False),
        sa.Column('date', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('ca', sa.Float(), default=0.0),
        sa.Column('cout_mo', sa.Float(), default=0.0),
        sa.Column('cout_materiaux', sa.Float(), default=0.0),
        sa.Column('gain', sa.Float(), default=0.0),
        sa.Column('donnees_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_chantiers_user_id', 'chantiers', ['user_id'])

    op.create_table(
        'prix_cache',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('produit_normalise', sa.String(), nullable=False, unique=True),
        sa.Column('prix_median', sa.Float(), nullable=False),
        sa.Column('p25', sa.Float(), nullable=False),
        sa.Column('p75', sa.Float(), nullable=False),
        sa.Column('confiance', sa.String(), nullable=False),
        sa.Column('sources_json', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_prix_cache_produit', 'prix_cache', ['produit_normalise'])

    # Facturation table (V2 - pas d'UI en V1)
    op.create_table(
        'factures',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('chantier_id', sa.String(), sa.ForeignKey('chantiers.id'), nullable=True),
        sa.Column('montant', sa.Float(), default=0.0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('factures')
    op.drop_table('prix_cache')
    op.drop_table('chantiers')
    op.drop_table('salaries')
    op.drop_table('users')
