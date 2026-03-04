-- Enable RLS on associations
ALTER TABLE associations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own association profile
DROP POLICY IF EXISTS "association_view_own" ON associations;
CREATE POLICY "association_view_own" ON associations 
FOR SELECT USING (user_id = auth.uid());

-- Policy: Users can update their own association profile
DROP POLICY IF EXISTS "association_update_own" ON associations;
CREATE POLICY "association_update_own" ON associations 
FOR UPDATE USING (user_id = auth.uid());

-- Enable RLS on activity_registrations
ALTER TABLE activity_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Associations can view their own registrations
DROP POLICY IF EXISTS "registration_view_own" ON activity_registrations;
CREATE POLICY "registration_view_own" ON activity_registrations 
FOR SELECT USING (
    association_id IN (
        SELECT id FROM associations WHERE user_id = auth.uid()
    )
);

-- Policy: Associations can insert their own registrations
DROP POLICY IF EXISTS "registration_insert_own" ON activity_registrations;
CREATE POLICY "registration_insert_own" ON activity_registrations 
FOR INSERT WITH CHECK (
    association_id IN (
        SELECT id FROM associations WHERE user_id = auth.uid()
    )
);

-- Policy: Associations can update their own registrations
DROP POLICY IF EXISTS "registration_update_own" ON activity_registrations;
CREATE POLICY "registration_update_own" ON activity_registrations 
FOR UPDATE USING (
    association_id IN (
        SELECT id FROM associations WHERE user_id = auth.uid()
    )
);

-- Enable RLS on activity_participants
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;

-- Policy: Associations can view participants of their registrations
DROP POLICY IF EXISTS "participants_view_own" ON activity_participants;
CREATE POLICY "participants_view_own" ON activity_participants 
FOR SELECT USING (
    registration_id IN (
        SELECT id FROM activity_registrations WHERE association_id IN (
            SELECT id FROM associations WHERE user_id = auth.uid()
        )
    )
);

-- Policy: Associations can insert participants to their registrations
DROP POLICY IF EXISTS "participants_insert_own" ON activity_participants;
CREATE POLICY "participants_insert_own" ON activity_participants 
FOR INSERT WITH CHECK (
    registration_id IN (
        SELECT id FROM activity_registrations WHERE association_id IN (
            SELECT id FROM associations WHERE user_id = auth.uid()
        )
    )
);
