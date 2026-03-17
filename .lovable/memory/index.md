Henriette Duckert Keramik project - Danish ceramics website

- Root index.html must use Vite entry point (`/src/main.tsx`), NOT pre-built static assets
- Old static build files in `/assets/` root dir have been DELETED - never recreate them
- Old files deleted: 404.html, app.py, backend/, CNAME, robots.txt (root), assets/, NavLink.tsx
- Language: Danish (da)
- Font: Bricolage Grotesque
- Active pages: Index, OmMig, Kontakt, Admin, NotFound (all in src/pages/)
- Layout: src/components/Layout.tsx
- NotificationBanner: fixed position, z-[60], uses expires_at column
- Admin password: hardcoded (henriette2024) - not secure
- DB tables: contact_submissions, site_notifications (with expires_at column)
