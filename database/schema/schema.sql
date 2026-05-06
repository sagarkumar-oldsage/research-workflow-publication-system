-- Research Workflow & Publication Management System
-- Core Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TYPE user_role AS ENUM ('admin', 'researcher', 'reviewer', 'editor');

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role        user_role NOT NULL DEFAULT 'researcher',
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    affiliation VARCHAR(500),
    orcid_id    VARCHAR(50),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Research Projects
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'archived');

CREATE TABLE research_projects (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title          VARCHAR(500) NOT NULL,
    description    TEXT,
    status         project_status NOT NULL DEFAULT 'planning',
    keywords       JSONB NOT NULL DEFAULT '[]',
    funding_source VARCHAR(500),
    start_date     TIMESTAMPTZ,
    end_date       TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Research Tasks
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

CREATE TABLE research_tasks (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title       VARCHAR(500) NOT NULL,
    description TEXT,
    status      task_status NOT NULL DEFAULT 'todo',
    due_date    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Literature Items
CREATE TABLE literature_items (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
    title      VARCHAR(1000) NOT NULL,
    authors    JSONB NOT NULL DEFAULT '[]',
    doi        VARCHAR(255),
    abstract   TEXT,
    notes      TEXT,
    tags       JSONB NOT NULL DEFAULT '[]',
    year       SMALLINT,
    file_path  VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Publications
CREATE TYPE publication_type AS ENUM ('journal_article', 'conference_paper', 'book_chapter', 'thesis', 'preprint', 'report', 'dataset');
CREATE TYPE publication_status AS ENUM ('draft', 'under_review', 'revision_requested', 'accepted', 'published', 'rejected', 'withdrawn');

CREATE TABLE publications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES research_projects(id) ON DELETE SET NULL,
    submitter_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title           VARCHAR(1000) NOT NULL,
    abstract        TEXT,
    authors         JSONB NOT NULL DEFAULT '[]',
    keywords        JSONB NOT NULL DEFAULT '[]',
    pub_type        publication_type NOT NULL,
    status          publication_status NOT NULL DEFAULT 'draft',
    doi             VARCHAR(255) UNIQUE,
    manuscript_file VARCHAR(1000),
    version         SMALLINT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Submissions
CREATE TYPE submission_status AS ENUM ('submitted', 'under_review', 'revision_required', 'revision_submitted', 'accepted', 'rejected', 'withdrawn');

CREATE TABLE submissions (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publication_id UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    venue_name     VARCHAR(500) NOT NULL,
    venue_type     VARCHAR(100) NOT NULL,
    status         submission_status NOT NULL DEFAULT 'submitted',
    submitted_at   TIMESTAMPTZ NOT NULL,
    decision_at    TIMESTAMPTZ,
    decision_notes TEXT,
    submission_url VARCHAR(1000),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews
CREATE TYPE review_status AS ENUM ('invited', 'accepted', 'declined', 'in_progress', 'completed');
CREATE TYPE review_decision AS ENUM ('accept', 'minor_revision', 'major_revision', 'reject');

CREATE TABLE reviews (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id        UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    reviewer_id          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status               review_status NOT NULL DEFAULT 'invited',
    decision             review_decision,
    summary              TEXT,
    comments_to_authors  TEXT,
    comments_to_editors  TEXT,
    confidence_score     SMALLINT CHECK (confidence_score BETWEEN 1 AND 5),
    due_date             TIMESTAMPTZ,
    submitted_at         TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_research_projects_owner  ON research_projects(owner_id);
CREATE INDEX idx_research_tasks_project   ON research_tasks(project_id);
CREATE INDEX idx_literature_project       ON literature_items(project_id);
CREATE INDEX idx_publications_submitter   ON publications(submitter_id);
CREATE INDEX idx_submissions_publication  ON submissions(publication_id);
CREATE INDEX idx_reviews_submission       ON reviews(submission_id);
CREATE INDEX idx_reviews_reviewer         ON reviews(reviewer_id);
