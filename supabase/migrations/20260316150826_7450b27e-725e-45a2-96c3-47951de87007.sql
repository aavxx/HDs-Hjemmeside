
-- Allow reading all contact submissions (admin panel, no auth)
CREATE POLICY "Anyone can read contact submissions"
ON public.contact_submissions FOR SELECT
USING (true);

-- Allow reading all notifications (including inactive for admin)
DROP POLICY "Anyone can read active notifications" ON public.site_notifications;
CREATE POLICY "Anyone can read notifications"
ON public.site_notifications FOR SELECT
USING (true);

-- Allow inserting notifications
CREATE POLICY "Anyone can insert notifications"
ON public.site_notifications FOR INSERT
WITH CHECK (true);

-- Allow updating notifications
CREATE POLICY "Anyone can update notifications"
ON public.site_notifications FOR UPDATE
USING (true) WITH CHECK (true);

-- Allow deleting notifications
CREATE POLICY "Anyone can delete notifications"
ON public.site_notifications FOR DELETE
USING (true);
