-- motor_ews_schema_V001

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(25) UNIQUE CHECK (role IN ('HOD', 'Workshop_Engineer', 'Technician')),
    description VARCHAR(120)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

CREATE TABLE IF NOT EXISTS user_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    display_name VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_user_profile_user_id ON user_profile(user_id);

CREATE TABLE IF NOT EXISTS user_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    role_id UUID NOT NULL REFERENCES roles(id),
    user_profile_id UUID NOT NULL REFERENCES user_profile(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_user_role_user_id ON user_role(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_role_id ON user_role(role_id);

CREATE TABLE IF NOT EXISTS motors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_no VARCHAR(50) NOT NULL UNIQUE,
    motor_id VARCHAR(50) NOT NULL UNIQUE,
    rpm INT NOT NULL,
    frame VARCHAR(20) NOT NULL,
    qr VARCHAR(120) NOT NULL,
    amp VARCHAR(20) NOT NULL,
    kw VARCHAR(20) NOT NULL,
    voltage VARCHAR(20) NOT NULL,
    mounting VARCHAR(20) NOT NULL,
    make VARCHAR(50) NOT NULL,
    current_status VARCHAR(20) DEFAULT 'In' CHECK (current_status IN ('In', 'Overhauling', 'Trial', 'Fault', 'Available', 'Out')),
    bearing_DE VARCHAR(20) NOT NULL,
    bearing_NDE VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motors_motor_id ON motors(motor_id);
CREATE INDEX IF NOT EXISTS idx_motors_serial_no ON motors(serial_no);
CREATE INDEX IF NOT EXISTS idx_motors_make ON motors(make);
CREATE INDEX IF NOT EXISTS idx_motors_current_status ON motors(current_status);
CREATE INDEX IF NOT EXISTS idx_motors_created_at_desc ON motors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_motors_created_at_asc ON motors(created_at ASC);

CREATE TABLE IF NOT EXISTS motor_in (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motor_id UUID NOT NULL REFERENCES motors(id),
    location VARCHAR(50) NOT NULL,
    in_at TIMESTAMPTZ NOT NULL,
    in_by UUID NOT NULL REFERENCES users(id),
    remark VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motor_in_motor_id ON motor_in(motor_id);
CREATE INDEX IF NOT EXISTS idx_motor_in_in_at_desc ON motor_in(motor_id, in_at DESC);
CREATE INDEX IF NOT EXISTS idx_motor_in_in_at_asc ON motor_in(motor_id, in_at ASC);

CREATE TABLE IF NOT EXISTS motor_overhauling (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motor_id UUID NOT NULL REFERENCES motors(id),
    status VARCHAR(30) NOT NULL CHECK (status IN ('Active', 'Completed', 'Fault')),
    overhauled_started_by UUID NOT NULL REFERENCES users(id),
    overhauled_started_at TIMESTAMPTZ DEFAULT now(),
    overhauled_completed_at TIMESTAMPTZ DEFAULT NULL,
    overhauled_completed_by UUID DEFAULT NULL REFERENCES users(id),
    parts TEXT[] DEFAULT '{}',
    remark VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motor_overhauling_motor_id ON motor_overhauling(motor_id);
CREATE INDEX IF NOT EXISTS idx_motor_overhauling_status ON motor_overhauling(status);

CREATE TABLE IF NOT EXISTS motor_trial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motor_id UUID NOT NULL REFERENCES motors(id),
    status VARCHAR(30) NOT NULL CHECK (status IN ('Active', 'Completed', 'Fault')),
    trial_started_by UUID NOT NULL REFERENCES users(id),
    trial_started_at TIMESTAMPTZ DEFAULT now(),
    trial_completed_at TIMESTAMPTZ DEFAULT NULL,
    trial_completed_by UUID DEFAULT NULL REFERENCES users(id),
    resistance_ry NUMERIC DEFAULT NULL,
    resistance_yb NUMERIC DEFAULT NULL,
    resistance_rb NUMERIC DEFAULT NULL,
    ir_ph_to_ph NUMERIC DEFAULT NULL,
    ir_ph_to_e NUMERIC DEFAULT NULL,
    remark TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motor_trial_motor_id ON motor_trial(motor_id);
CREATE INDEX IF NOT EXISTS idx_motor_trial_status ON motor_trial(status);

CREATE TABLE IF NOT EXISTS motor_fault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motor_id UUID NOT NULL REFERENCES motors(id),
    old_status VARCHAR(20) NOT NULL,
    fault_find_at TIMESTAMPTZ DEFAULT now(),
    fault_find_by UUID NOT NULL REFERENCES users(id),
    remark TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motor_fault_motor_id ON motor_fault(motor_id);

CREATE TABLE IF NOT EXISTS motor_available (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motor_id UUID NOT NULL REFERENCES motors(id),
    available_at TIMESTAMPTZ DEFAULT now(),
    available_by UUID NOT NULL REFERENCES users(id),
    remark TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motor_available_motor_id ON motor_available(motor_id);

CREATE TABLE IF NOT EXISTS motor_out (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motor_id UUID NOT NULL REFERENCES motors(id),
    location VARCHAR(100) NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    out_at TIMESTAMPTZ DEFAULT now(),
    out_by UUID NOT NULL REFERENCES users(id),
    remark TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motor_out_motor_id ON motor_out(motor_id);

CREATE TABLE IF NOT EXISTS motor_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    motor_id UUID NOT NULL REFERENCES motors(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT now(),
    changed_by UUID NOT NULL REFERENCES users(id),
    details JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    version INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_motor_history_motor_id ON motor_history(motor_id);
