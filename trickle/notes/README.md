# UniQuorn - Therapy Management System

## Overview
UniQuorn is a comprehensive therapy management system designed to streamline operations for mental health clinics, therapists, and patients. The system provides role-based access with dedicated dashboards for different user types.

## User Roles

### 1. Super Admin
- **Purpose**: System-wide administrative control with global oversight
- **Key Features**: 
  - Global dashboard (clinics, therapists, patients, revenue)
  - Full CRUD operations on all clinics, therapists, and patients
  - Financial & analytics module (revenue trends, compliance reports)
  - System configuration (feature toggles, backups, security settings)

### 2. Clinic Admin
- **Purpose**: Clinic-level management and operations
- **Key Features**: 
  - Manage therapists, patients, and schedules at clinic level
  - Revenue tracking & session invoicing
  - Communication tools (announcements, reminders)
  - Patient outcome analytics

### 3. Therapist
- **Purpose**: Patient care, treatment, and clinical documentation
- **Key Features**: 
  - Patient management & session documentation (SOAP format)
  - Exercise assignment with video library
  - Progress analytics & adherence tracking
  - Secure in-app messaging with patients

### 4. Patient
- **Purpose**: Personal health portal and treatment engagement
- **Key Features**: 
  - Appointment booking & rescheduling
  - Progress dashboard (goals, sessions, exercises)
  - Home exercise tracking & feedback
  - Billing portal + payment history

## Technical Features
- Role-based authentication and authorization
- Responsive design for all device types
- Real-time dashboard updates with live data
- Secure data management with Trickle database
- Multi-page application structure
- Full CRUD operations for clinic management
- Interactive clinic creation and management
- Live statistics and analytics
- Secure HIPAA-compliant messaging between patients and therapists
- Real-time chat interface with message history

## Getting Started
1. Visit the main landing page
2. Click on any demo account email to auto-fill credentials, or enter custom credentials
3. Select your role from the dropdown menu
4. Click "Sign In" to access your role-specific dashboard

### Demo Accounts
- **Super Admin**: admin@uniquorn.com / admin123
- **Clinic Admin**: clinic@uniquorn.com / clinic123  
- **Therapist**: therapist@uniquorn.com / therapist123
- **Patient**: patient@uniquorn.com / patient123

## System Architecture
- Frontend: React with modern JavaScript
- Styling: TailwindCSS with custom design system
- Icons: Lucide icon library
- Authentication: Local storage based (demo)
- Structure: Multi-page application with separate dashboards

## Last Updated
October 16, 2025 - Added secure chat system between assigned patients and therapists with real-time messaging capabilities
