BEGIN;

DO $$ 
DECLARE
    user_id UUID;
    user_profile_id UUID;
    role_id UUID;
BEGIN
    INSERT INTO users (email, phone, password)
    VALUES ('thenegi281@gmail.com', '7452011681', 'Lalit@12')
    RETURNING id INTO user_id;

    INSERT INTO user_profile (user_id, display_name)
    VALUES (user_id, 'Lalit Negi')
    RETURNING id INTO user_profile_id;

    SELECT id INTO role_id FROM roles WHERE role = 'HOD';
    
    INSERT INTO user_role (user_id, user_profile_id, role_id)
    VALUES (user_id, user_profile_id, role_id);
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END $$;

COMMIT;
