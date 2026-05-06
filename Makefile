.PHONY: install dev test lint migrate seed clean

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

dev:
	docker compose -f infrastructure/docker/docker-compose.yml up -d db redis minio
	cd backend && uvicorn src.main:app --reload --port 8000 &
	cd frontend && npm run dev

test:
	cd backend && pytest tests/ -v --cov=src --cov-report=term-missing
	cd frontend && npm run test

lint:
	cd backend && ruff check src/ && mypy src/
	cd frontend && npm run lint

migrate:
	cd backend && alembic upgrade head

seed:
	cd backend && python scripts/seed.py

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	cd frontend && rm -rf node_modules dist

docker-up:
	docker compose -f infrastructure/docker/docker-compose.yml up --build

docker-down:
	docker compose -f infrastructure/docker/docker-compose.yml down -v
