
# Add Admin Dashboard Link to Profile Page

## What Changes
A new menu item will appear on the Profile page linking to the Admin Dashboard, visible only to users with the admin role.

## Technical Details

### 1. Update Profile.tsx
- Import `useAdminAuth` hook (already exists) and `Shield` icon
- Add a conditional menu item "Admin Dashboard" with a Shield icon that links to `/admin`
- Only render when `isAdmin` is true and auth check is complete
- Use `useNavigate` from react-router-dom to navigate on click
- Place it at the top of the existing menu items section, separated visually

### 2. No Database Changes Needed
The `user_roles` table and `has_role` function already exist, and the `useAdminAuth` hook already handles the role check securely on the server side.

### Implementation
In `src/pages/Profile.tsx`:
- Import `useAdminAuth` from `@/hooks/useAdminAuth`
- Import `useNavigate` from `react-router-dom`
- Import `Shield` icon from `lucide-react`
- Before the existing menu items card, conditionally render an admin card with a button that navigates to `/admin`
