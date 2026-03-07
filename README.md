# Chantier Rentable V1

Application web d'analyse de rentabilité de chantiers BTP.

## Stack technique

- **Backend** : FastAPI (Python) — Architecture en oignon (Exposition / Application / Domain / Infrastructure)
- **Frontend** : React + Redux Toolkit + TypeScript
- **Base de données** : PostgreSQL (Docker) + Alembic (migrations)
- **IA** : Groq (llama-3.3-70b) pour l'extraction et la normalisation
- **Recherche prix** : DuckDuckGo + Jina

## Démarrage rapide

### 1. Prérequis
- Docker & Docker Compose
- Node.js 20+ (pour le dev frontend local)

### 2. Variables d'environnement
```bash
cp .env.example .env
# Remplir GROQ_API_KEY et JWT_SECRET dans .env
```

### 3. Lancer avec Docker
```bash
docker-compose --env-file .env up --build
```

- Frontend : http://localhost:3000
- Backend API : http://localhost:8000
- Docs API : http://localhost:8000/docs

### 4. Développement local (sans Docker)

**Backend :**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # configurer les variables
alembic upgrade head
uvicorn main:app --reload
```

**Frontend :**
```bash
cd frontend
npm install
npm run dev
```

## Architecture backend

```
backend/src/
├── exposition/          # Couche d'exposition
│   ├── routers/         # Routes FastAPI
│   ├── controllers/     # Logique de présentation
│   ├── dtos/            # Data Transfer Objects (Pydantic)
│   └── mappers/         # Domain → DTO
├── application/         # Couche applicative
│   ├── services/        # Services métier
│   └── commands/        # Commandes (CQRS)
├── domain/              # Couche domaine
│   ├── entities/        # Entités métier
│   ├── repositories/    # Interfaces repositories
│   └── value_objects/   # Value objects
└── infrastructure/      # Couche infrastructure
    ├── persistence/     # SQLAlchemy (modèles + repos impl)
    ├── llm/             # Groq, PDFPlumber
    └── search/          # DuckDuckGo, Jina
```

## Modules fonctionnels

| Module | Description |
|--------|-------------|
| M1 | Import & analyse PDF (pdfplumber + Groq) |
| M2 | Calcul main d'œuvre (dirigeant + salariés + charges) |
| M3 | Estimation prix marché (DDG + Jina + Groq + cache PostgreSQL) |
| M4 | Résultats & simulation (4 KPI + badge + slider) |
| M5 | Auth (JWT httpOnly cookie + bcrypt) |
| M6 | Export Excel (openpyxl, 3 feuilles) |
| M7 | Historique & synthèses (graphiques Recharts) |
