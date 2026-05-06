# Research Workflow & Publication Management System

A full-stack platform for managing research projects, literature reviews, experiments, manuscript submissions, peer reviews, and publication tracking.

## Features

- **Research Project Management** — create and track research projects, tasks, and milestones
- **Literature Review** — organize references, annotations, and citation networks
- **Experiment Tracking** — log hypotheses, protocols, results, and datasets
- **Manuscript Workflow** — draft, version-control, and collaborate on manuscripts
- **Submission Tracking** — track journal/conference submissions and their statuses
- **Peer Review Management** — assign reviewers, collect feedback, and manage revisions
- **Publication Registry** — maintain a searchable catalog of published outputs

## Tech Stack

| Layer         | Technology                     |
|---------------|-------------------------------|
| Backend API   | Python · FastAPI               |
| Database      | PostgreSQL · SQLAlchemy        |
| Migrations    | Alembic                        |
| Frontend      | React · TypeScript · Vite      |
| State         | Redux Toolkit                  |
| Auth          | JWT · OAuth2                   |
| Storage       | S3-compatible (MinIO / AWS S3) |
| Containerization | Docker · Docker Compose     |
| CI/CD         | GitHub Actions                 |

## Quick Start

```bash
# Clone & enter project
git clone <repo-url>
cd research-workflow-publication-system

# Copy environment config
cp .env.example .env

# Start all services
make dev
```

## Project Structure

```
.
├── backend/        FastAPI application (API, models, services)
├── frontend/       React/TypeScript SPA
├── database/       Schema definitions, migrations, seeds
├── infrastructure/ Docker, Kubernetes, Terraform configs
├── docs/           Architecture, API specs, user guides
└── scripts/        Setup, migration, and deployment scripts
```

## Development

```bash
make install        # Install all dependencies
make migrate        # Run database migrations
make seed           # Seed development data
make test           # Run all tests
make lint           # Lint backend + frontend
```

## Documentation

- [Architecture Overview](docs/architecture/system-design.md)
- [API Reference](docs/api/openapi.yaml)
- [User Guide](docs/user-guide/README.md)
