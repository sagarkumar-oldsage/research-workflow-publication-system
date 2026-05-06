Project Title:
Research Workflow and Publication Management System

Project Overview:
Develop a collaborative web-based research workflow management platform for a team of five researchers. The platform will be used to manage, monitor, and track the complete lifecycle of research-related work including conference papers, journal papers, book chapters, patents, copyrights, research proposals, and other academic or intellectual property activities.

The platform should provide a clean, modern, responsive, and user-friendly interface where team members can collaboratively create assignments, assign responsibilities, track progress stage-by-stage, monitor deadlines, and maintain the status of ongoing and completed work.

The system should function as a lightweight academic project management dashboard specifically designed for research workflows rather than a generic task management application.

Core Objectives:
1. Centralized management of all research-related activities.
2. Stage-wise workflow tracking for each assignment.
3. Responsibility assignment for every stage/task.
4. Real-time collaboration among team members.
5. Progress visualization using timelines and progress bars.
6. Dynamic workflows based on assignment type.
7. Controlled movement from one stage to another.
8. Easy monitoring of current status, pending tasks, and deadlines.

Target Users:
A research team consisting of five members including faculty, researchers, authors, inventors, and collaborators.

Assignment Types:
The system must support multiple assignment categories including:
- Conference Paper
- Journal Paper
- Book Chapter
- Patent
- Copyright
- Research Proposal
- Project
- Review Article
- Survey Paper
- Thesis Work
- Other Custom Types

Core Functional Requirements:

1. Authentication and User Management
- Login and logout system.
- User roles:
  - Admin
  - Contributor
  - Reviewer
- Profile management for each user.
- Team member identification throughout workflows.

2. Dashboard
Create a central dashboard displaying:
- Total active assignments
- Completed assignments
- Pending tasks
- Deadlines approaching
- Recently updated projects
- Current assignments by user
- Overall research statistics

Dashboard should contain:
- Cards
- Progress indicators
- Charts/graphs (optional)
- Activity timeline
- Filter and search functionality

3. Add New Assignment
Provide a form for creating new assignments.

Fields should include:
- Assignment title
- Assignment type
- Description
- Priority level
- Start date
- Deadline
- Target conference/journal/publisher
- Team members involved
- Lead member
- Current status
- Tags/keywords
- Reference links
- Document links (Google Drive, Overleaf, etc.)

4. Dynamic Workflow Templates
The workflow stages should automatically change based on assignment type.

Example workflows:

Conference Paper Workflow:
- Topic Finalization
- Literature Review
- Dataset Collection
- Methodology
- Writing
- Internal Review
- Plagiarism Check
- Formatting
- Submission
- Reviewer Comments
- Camera Ready Submission
- Presentation
- Published

Journal Paper Workflow:
- Idea Generation
- Literature Review
- Experimentation
- Draft Writing
- Internal Review
- Journal Selection
- Submission
- Reviewer Review
- Revision
- Accepted
- Published

Patent Workflow:
- Idea Generation
- Prior Art Search
- Drafting Claims
- Patent Drafting
- Internal Review
- Finalization
- Submission
- Examination
- Objection Handling
- Granted/Rejected

Copyright Workflow:
- Content Preparation
- Verification
- Documentation
- Application Submission
- Review
- Approved/Rejected

The admin should be able to:
- Create custom workflow templates
- Add/edit/remove stages
- Reorder stages
- Save reusable templates

5. Stage Management
Each workflow stage must support:
- Stage name
- Assigned responsible person
- Due date
- Status:
  - Pending
  - In Progress
  - Completed
  - Review Required
  - Rejected
  - Accepted
- Remarks/comments
- Attachment links
- Completion timestamp

Rules:
- Only one active stage at a time.
- Next stage unlocks only after previous stage completion.
- Stage completion should update project progress automatically.

6. Progress Tracking
The system should visually display:
- Progress bars
- Percentage completion
- Timeline view
- Workflow progression
- Current active stage
- Delayed tasks
- Completed milestones

Use color coding:
- Green = Completed
- Blue = Active
- Yellow = Review
- Red = Delayed/Rework
- Gray = Pending

7. Task Assignment and Collaboration
- Assign individual stages to specific users.
- Allow reassignment.
- Mention responsible members clearly.
- Activity logs showing:
  - who updated what
  - completion time
  - status changes

8. Notifications and Reminders
Provide notifications for:
- Upcoming deadlines
- Pending reviews
- Stage completion
- Assignment updates
- Overdue tasks

Optional:
- Email notifications
- In-app notifications

9. Search and Filters
Allow filtering by:
- Assignment type
- Status
- Assigned member
- Deadline
- Priority
- Completion percentage

Provide keyword search.

10. Assignment Detail Page
Each assignment should have a dedicated page showing:
- Full assignment information
- Workflow stages
- Assigned members
- Timeline
- Activity history
- Attachments
- Notes/comments
- Current progress

11. File and Link Management
Allow storing:
- Google Drive links
- Overleaf links
- GitHub repositories
- PDFs
- Research resources

12. Analytics and Reports
Generate analytics such as:
- Number of papers submitted
- Acceptance rate
- Patents filed
- Completed works
- Pending reviews
- User contribution statistics
- Monthly productivity

Technical Requirements:

Frontend:
- Next.js (React)
- Mantine (Typescript)
- Responsive UI
- Modern clean dashboard design

Backend:
- Firebase or Supabase

Database:
- Firestore or PostgreSQL

Authentication:
- Firebase Authentication

Hosting:
- Vercel

Design Requirements:
- Modern academic/professional interface
- Responsive for desktop and mobile
- Minimal but modern design
- Fast loading
- Intuitive navigation

Suggested Pages:
1. Login Page
2. Dashboard
3. Create Assignment
4. Assignment Details
5. Workflow Management
6. User Management
7. Reports & Analytics
8. Settings

UI Components:
- Sidebar navigation
- Top navigation bar
- Progress bars
- Timeline/workflow tracker
- Status badges
- Kanban board (optional)
- Tables with filters
- Modal forms
- Notification panel

Database Collections/Tables:
Users
Assignments
Workflow Templates
Stages
Comments
Activity Logs
Notifications
Files

Important Workflow Logic:
- Workflow stages depend on assignment type.
- Each stage must have an assigned responsible member.
- Completion of one stage unlocks the next stage.
- Progress percentage updates automatically.
- All changes should be logged in activity history.

Additional Optional Features:
- Dark mode
- Calendar integration
- AI-assisted reminders
- PDF report generation
- Export to Excel
- Research repository
- Publication archive

Expected Output:
Develop a fully functional Production Ready project of the collaborative research workflow management system with authentication, assignment creation, workflow tracking, progress monitoring, and task assignment features.

