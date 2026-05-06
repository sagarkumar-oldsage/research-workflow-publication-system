-- Seed: Development data for Research Workflow System

INSERT INTO users (id, email, full_name, hashed_password, role, is_active, is_verified, affiliation) VALUES
  ('11111111-0000-0000-0000-000000000001', 'admin@example.com',    'System Admin',   '$2b$12$placeholder_hash', 'admin',      TRUE, TRUE, 'Research Institute'),
  ('11111111-0000-0000-0000-000000000002', 'alice@example.com',    'Alice Researcher','$2b$12$placeholder_hash', 'researcher', TRUE, TRUE, 'University of Science'),
  ('11111111-0000-0000-0000-000000000003', 'bob@example.com',      'Bob Reviewer',   '$2b$12$placeholder_hash', 'reviewer',   TRUE, TRUE, 'Review Board'),
  ('11111111-0000-0000-0000-000000000004', 'carol@example.com',    'Carol Editor',   '$2b$12$placeholder_hash', 'editor',     TRUE, TRUE, 'Journal of Research');

INSERT INTO research_projects (id, owner_id, title, description, status, keywords) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002',
   'Climate Impact on Coastal Ecosystems', 'Study of rising sea levels on biodiversity.', 'in_progress',
   '["climate", "ecosystems", "coastal", "biodiversity"]');

INSERT INTO publications (id, project_id, submitter_id, title, authors, pub_type, status) VALUES
  ('33333333-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002',
   'Preliminary Findings on Coastal Biodiversity Loss', '["Alice Researcher", "Bob Reviewer"]', 'journal_article', 'draft');
