-- FIX COMPLETE RLS POLICIES
-- Run this script to fix the "Members not showing" issue once and for all.
-- This ensures you can access your own Team AND its Members.

-- 1. TEAMS TABLE POLICIES (Critical for checking ownership)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create their own team" ON public.teams;
CREATE POLICY "Users can create their own team" ON public.teams
FOR INSERT WITH CHECK (auth.uid() = leader_id);

DROP POLICY IF EXISTS "Leaders can view their own team" ON public.teams;
CREATE POLICY "Leaders can view their own team" ON public.teams
FOR SELECT USING (auth.uid() = leader_id);

DROP POLICY IF EXISTS "Leaders can update their own team" ON public.teams;
CREATE POLICY "Leaders can update their own team" ON public.teams
FOR UPDATE USING (auth.uid() = leader_id);

DROP POLICY IF EXISTS "Leaders can delete their own team" ON public.teams;
CREATE POLICY "Leaders can delete their own team" ON public.teams
FOR DELETE USING (auth.uid() = leader_id);


-- 2. TEAM MEMBERS TABLE POLICIES (Dependent on Teams)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leaders can view their team members" ON public.team_members;
CREATE POLICY "Leaders can view their team members" ON public.team_members
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_members.team_id AND leader_id = auth.uid())
);

DROP POLICY IF EXISTS "Leaders can add members" ON public.team_members;
CREATE POLICY "Leaders can add members" ON public.team_members
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_members.team_id AND leader_id = auth.uid())
);

DROP POLICY IF EXISTS "Leaders can delete members" ON public.team_members;
CREATE POLICY "Leaders can delete members" ON public.team_members
FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_members.team_id AND leader_id = auth.uid())
);

-- 3. ADMIN ACCESS (Backdoor for admins)
DROP POLICY IF EXISTS "Admins view all teams" ON public.teams;
CREATE POLICY "Admins view all teams" ON public.teams
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

DROP POLICY IF EXISTS "Admins view all members" ON public.team_members;
CREATE POLICY "Admins view all members" ON public.team_members
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
