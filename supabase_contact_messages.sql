-- Create table for contact messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    "contactReason" TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    admin_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance and rate limiting rules
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert messages
DROP POLICY IF EXISTS "Allow public to insert contact messages" ON public.contact_messages;
CREATE POLICY "Allow public to insert contact messages" 
ON public.contact_messages
FOR INSERT 
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to select all messages
DROP POLICY IF EXISTS "Allow authenticated to view contact messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated to view contact messages" 
ON public.contact_messages
FOR SELECT 
TO authenticated
USING (true);

-- Policy: Allow authenticated users (admins) to update messages
DROP POLICY IF EXISTS "Allow authenticated to update contact messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated to update contact messages" 
ON public.contact_messages
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to delete messages
DROP POLICY IF EXISTS "Allow authenticated to delete contact messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated to delete contact messages" 
ON public.contact_messages
FOR DELETE
TO authenticated
USING (true);
