-- Run this in your Supabase SQL Editor to fix the "Members not showing" issue and ensure data can be saved.

-- 1. Ensure columns exist (Safeguard)
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS reg_no TEXT;

-- 2. Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 3. Policy for Reading Members (Fixes "Members not showing")
DROP POLICY IF EXISTS "Leaders can view their team members" ON public.team_members;
CREATE POLICY "Leaders can view their team members" ON public.team_members
FOR SELECT USING (
  team_id IN (
    SELECT id FROM public.teams WHERE leader_id = auth.uid()
  )
);

-- 4. Policy for Adding Members (Fixes "Failed to add members")
DROP POLICY IF EXISTS "Leaders can add members to their team" ON public.team_members;
CREATE POLICY "Leaders can add members to their team" ON public.team_members
FOR INSERT WITH CHECK (
  team_id IN (
    SELECT id FROM public.teams WHERE leader_id = auth.uid()
  )
);

-- 5. Policy for Removing Members
DROP POLICY IF EXISTS "Leaders can remove members from their team" ON public.team_members;
CREATE POLICY "Leaders can remove members from their team" ON public.team_members
FOR DELETE USING (
  team_id IN (
    SELECT id FROM public.teams WHERE leader_id = auth.uid()
  )
);

-- 6. Admin Access (Optional but recommended)
DROP POLICY IF EXISTS "Admins can view all team members" ON public.team_members;
CREATE POLICY "Admins can view all team members" ON public.team_members
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
