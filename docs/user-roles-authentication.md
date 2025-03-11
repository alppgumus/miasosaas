User Roles

Admin: Full access to platform settings, user management, and financial reports.
Advertiser: Can create, manage, and analyze ad campaigns.
Viewer: Read-only access to analytics and reports.

Authentication Flow
User registers via email/password or OAuth.
Supabase Auth handles authentication.
JWT tokens are used for session management.
Role-based access control (RBAC) is implemented via Supabase policies.