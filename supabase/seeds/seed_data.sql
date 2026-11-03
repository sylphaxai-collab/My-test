-- Seed data for testing

-- Insert test users into auth schema (simulated; use Supabase auth admin for real users)
-- This assumes you have already created users via Supabase Auth and know their IDs.
-- For demo, we'll insert directly into profiles with known user IDs.

-- Clear existing seed data if re-running
delete from public.team_members;
delete from public.tasks;
delete from public.projects;
delete from public.profiles where id in (
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'
);

-- Insert test profiles
insert into public.profiles (id, email, full_name, avatar_url)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'alice@example.com', 'Alice Johnson', 'https://ui-avatars.com/api/?name=Alice+Johnson&background=ffd1dc&color=1a1a1a'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'bob@example.com', 'Bob Smith', 'https://ui-avatars.com/api/?name=Bob+Smith&background=ffd1dc&color=1a1a1a');

-- Insert test projects
insert into public.projects (name, description, created_by)
values
  ('Website Redesign', 'Redesign company website for better UX', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'),
  ('Mobile App Launch', 'Prepare and launch the new mobile app', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1');

-- Insert team members
insert into public.team_members (project_id, user_id, role)
values
  (1, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'owner'),
  (1, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'member'),
  (2, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'owner'),
  (2, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'admin');

-- Insert test tasks
insert into public.tasks (title, description, status, project_id, assigned_to)
values
  ('Design homepage mockup', 'Create high-fidelity mockups for the new homepage', 'todo', 1, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2'),
  ('Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 'in_progress', 1, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1'),
  ('Write privacy policy', 'Draft privacy policy for new app compliance', 'completed', 2, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2');
