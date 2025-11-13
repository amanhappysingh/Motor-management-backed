INSERT INTO roles (role, description)
VALUES
    ('HOD', 'Head of Department'),
    ('Workshop_Engineer', 'Responsible for workshop operations'),
    ('Technician', 'Handles technical issues and repairs')
ON CONFLICT (role) DO NOTHING;
