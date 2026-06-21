-- =====================================================================
-- UniQuorn Hospital / Therapy Management System
-- MySQL schema for phpMyAdmin import
-- 4 roles: super_admin, clinic_admin, therapist, patient
-- =====================================================================

CREATE DATABASE IF NOT EXISTS uniquorn_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE uniquorn_db;

-- ---------------------------------------------------------------------
-- 1. CLINICS
-- A clinic is the top-level org unit. clinic_admins, therapists and
-- patients all belong to exactly one clinic. super_admins do not.
-- ---------------------------------------------------------------------
CREATE TABLE clinics (
    clinic_id   INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    address     VARCHAR(255) NOT NULL,
    phone       VARCHAR(20)  NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    status      ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. USERS
-- Single auth/identity table for ALL roles. This is where RBAC lives:
-- the `role` column is checked on every login/route to decide which
-- dashboard and which queries a user is allowed to run.
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,          -- store bcrypt hash, never plaintext
    role           ENUM('super_admin', 'clinic_admin', 'therapist', 'patient') NOT NULL,
    clinic_id      INT NULL,                        -- NULL only for super_admin
    status         ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (clinic_id) REFERENCES clinics(clinic_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. THERAPISTS
-- One-to-one extension of users where role = 'therapist'.
-- Keeps clinical/professional fields out of the generic users table.
-- ---------------------------------------------------------------------
CREATE TABLE therapists (
    therapist_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL UNIQUE,           -- enforces 1 login = 1 therapist profile
    clinic_id        INT NOT NULL,
    specialization   VARCHAR(100),
    license_number   VARCHAR(50) NOT NULL UNIQUE,    -- no two therapists can share a license
    phone            VARCHAR(20),

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,                          -- deleting the login deletes the profile
    FOREIGN KEY (clinic_id) REFERENCES clinics(clinic_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. PATIENTS
-- One-to-one extension of users where role = 'patient'.
-- therapist_id is nullable: a patient can be enrolled before assignment.
-- ---------------------------------------------------------------------
CREATE TABLE patients (
    patient_id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id             INT NOT NULL UNIQUE,
    clinic_id           INT NOT NULL,
    therapist_id        INT NULL,
    date_of_birth       DATE NOT NULL,
    phone               VARCHAR(20),
    insurance_provider  VARCHAR(100),
    emergency_contact   VARCHAR(100),

    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES clinics(clinic_id)
        ON DELETE CASCADE,
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id)
        ON DELETE SET NULL                          -- losing a therapist doesn't delete the patient
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. APPOINTMENTS
-- The composite UNIQUE key is the important constraint here: it makes
-- double-booking the same therapist at the same date/time impossible
-- at the database level, not just in app logic.
-- ---------------------------------------------------------------------
CREATE TABLE appointments (
    appointment_id    INT AUTO_INCREMENT PRIMARY KEY,
    patient_id        INT NOT NULL,
    therapist_id      INT NOT NULL,
    appointment_date  DATE NOT NULL,
    appointment_time  TIME NOT NULL,
    session_type      ENUM('individual', 'group', 'consultation', 'followup')
                       NOT NULL DEFAULT 'individual',
    status             ENUM('pending', 'confirmed', 'completed', 'cancelled')
                       NOT NULL DEFAULT 'pending',
    notes             TEXT,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE,
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_therapist_slot (therapist_id, appointment_date, appointment_time)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. SOAP_NOTES
-- Clinical documentation, one note per appointment (UNIQUE FK).
-- Subjective / Objective / Assessment / Plan = standard clinical format.
-- ---------------------------------------------------------------------
CREATE TABLE soap_notes (
    note_id        INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE,             -- 1 SOAP note per appointment
    patient_id     INT NOT NULL,
    therapist_id   INT NOT NULL,
    subjective     TEXT,
    objective      TEXT,
    assessment     TEXT,
    plan           TEXT,
    session_date   DATE NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
        ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE,
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- SEED DATA — mirrors the demo accounts already in the project README
-- Passwords below are placeholder bcrypt-style hashes; replace with
-- real password_hash() / bcrypt output when you wire up the backend.
-- =====================================================================

INSERT INTO clinics (name, address, phone, email, status) VALUES
('MindWell Therapy Center', '123 Wellness Ave, Healthcare City, HC 12345', '+1 (555) 123-4567', 'info@mindwelltherapy.com', 'active');

INSERT INTO users (name, email, password_hash, role, clinic_id, status) VALUES
('System Admin',  'admin@uniquorn.com',      '$2y$10$replaceWithRealBcryptHash1', 'super_admin', NULL, 'active'),
('Clinic Manager', 'clinic@uniquorn.com',     '$2y$10$replaceWithRealBcryptHash2', 'clinic_admin', 1,    'active'),
('Dr. Sarah Wilson', 'therapist@uniquorn.com', '$2y$10$replaceWithRealBcryptHash3', 'therapist',    1,    'active'),
('John Smith',     'patient@uniquorn.com',    '$2y$10$replaceWithRealBcryptHash4', 'patient',      1,    'active');

INSERT INTO therapists (user_id, clinic_id, specialization, license_number, phone) VALUES
(3, 1, 'Anxiety & Depression', 'LIC-2025-001', '+1 (555) 234-5678');

INSERT INTO patients (user_id, clinic_id, therapist_id, date_of_birth, phone, insurance_provider, emergency_contact) VALUES
(4, 1, 1, '1990-04-12', '+1 (555) 345-6789', 'BlueCross', 'Jane Smith - +1 (555) 999-0000');

INSERT INTO appointments (patient_id, therapist_id, appointment_date, appointment_time, session_type, status, notes) VALUES
(1, 1, '2026-07-01', '10:00:00', 'individual', 'confirmed', 'First follow-up session');

INSERT INTO soap_notes (appointment_id, patient_id, therapist_id, subjective, objective, assessment, plan, session_date) VALUES
(1, 1, 1, 'Patient reports improved sleep.', 'Calm affect, engaged throughout session.',
 'Symptoms trending positive.', 'Continue weekly sessions, reassess in 4 weeks.', '2026-07-01');
