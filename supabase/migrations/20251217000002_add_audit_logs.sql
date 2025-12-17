-- Audit Logs Migration
-- Creates table for tracking important user and system actions

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit logs
DROP POLICY IF EXISTS "Users can view their own audit logs" ON audit_logs;
CREATE POLICY "Users can view their own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all audit logs
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Allow system to insert audit logs (via service role or triggers)
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON audit_logs;
CREATE POLICY "Allow insert for authenticated users"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Function to log actions
CREATE OR REPLACE FUNCTION log_action(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    metadata
  ) VALUES (
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_old_values,
    p_new_values,
    p_metadata
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to automatically log profile changes
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    PERFORM log_action(
      'profile_updated',
      'profile',
      NEW.id::TEXT,
      to_jsonb(OLD),
      to_jsonb(NEW),
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profile changes
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

-- Trigger function for injection logs
CREATE OR REPLACE FUNCTION log_injection_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_action(
      'injection_created',
      'injection',
      NEW.id::TEXT,
      NULL,
      to_jsonb(NEW),
      NULL
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_action(
      'injection_updated',
      'injection',
      NEW.id::TEXT,
      to_jsonb(OLD),
      to_jsonb(NEW),
      NULL
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_action(
      'injection_deleted',
      'injection',
      OLD.id::TEXT,
      to_jsonb(OLD),
      NULL,
      NULL
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for injection changes
DROP TRIGGER IF EXISTS on_injection_change ON injections;
CREATE TRIGGER on_injection_change
  AFTER INSERT OR UPDATE OR DELETE ON injections
  FOR EACH ROW EXECUTE FUNCTION log_injection_changes();

SELECT 'Audit logs table and triggers created successfully!' as status;
