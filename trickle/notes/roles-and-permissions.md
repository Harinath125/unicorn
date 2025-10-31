# UniQuorn - User Roles & Permissions

## Role Hierarchy
```
Super Admin
├── Clinic Admin
│   ├── Therapist
│   └── Patient
```

## 1. Super Admin
**System-wide administrative control with global oversight**

### Core Permissions & Features:
- **Global Dashboard**: 
  - Total clinics, therapists, patients statistics
  - System-wide revenue tracking and trends
  - Platform health monitoring and alerts
  
- **Full CRUD Operations**:
  - Create, read, update, delete clinics
  - Manage all therapists across clinics
  - Oversee all patient accounts system-wide
  
- **Financial & Analytics Module**:
  - Revenue trends and financial analytics
  - Compliance reports and audit trails
  - Cross-clinic performance comparisons
  - Subscription and billing management
  
- **System Configuration**:
  - Feature toggles and system preferences
  - Automated backups and data management
  - Security settings and access controls
  - Platform-wide policy configuration

---

## 2. Clinic Admin
**Clinic-level management and operations**

### Core Permissions & Features:
- **Clinic Management**:
  - Manage therapists within clinic (hire, schedule, performance review)
  - Patient management and clinic enrollment
  - Clinic-wide scheduling and resource allocation
  
- **Revenue & Financial Tools**:
  - Clinic revenue tracking and reporting
  - Session invoicing and payment processing
  - Financial analytics for clinic performance
  
- **Communication & Coordination**:
  - Clinic-wide announcements and notifications
  - Automated appointment reminders
  - Staff communication and coordination tools
  
- **Analytics & Reporting**:
  - Patient outcome analytics and success metrics
  - Therapist performance and productivity reports
  - Clinic operational efficiency tracking

### Restrictions:
- Limited to assigned clinic only
- Cannot access other clinics' data
- Cannot modify system-wide settings

---

## 3. Therapist
**Patient care, treatment, and clinical documentation**

### Core Permissions & Features:
- **Patient Management & Documentation**:
  - Assigned patient management and care coordination
  - Session documentation using SOAP format (Subjective, Objective, Assessment, Plan)
  - Treatment plan creation and modification
  
- **Exercise & Treatment Tools**:
  - Exercise assignment with integrated video library
  - Custom exercise program creation
  - Treatment protocol management
  
- **Progress & Analytics**:
  - Patient progress analytics and trend monitoring
  - Treatment adherence tracking and reporting
  - Outcome measurement and goal tracking
  
- **Secure Communication**:
  - HIPAA-compliant in-app messaging with patients
  - Secure file sharing and document exchange
  - Appointment scheduling and coordination

### Restrictions:
- Access limited to assigned patients only
- Cannot view other therapists' patient data
- Cannot modify clinic-level settings or policies

---

## 4. Patient
**Personal health portal and treatment engagement**

### Core Permissions & Features:
- **Appointment Management**:
  - Self-service appointment booking with assigned therapist
  - Appointment rescheduling with availability checking
  - Appointment history and upcoming schedule view
  
- **Progress & Goal Tracking**:
  - Personal progress dashboard with visual analytics
  - Goal setting and milestone tracking
  - Session history and treatment timeline
  
- **Home Exercise & Engagement**:
  - Home exercise tracking and completion logging
  - Exercise feedback and difficulty rating
  - Video exercise library access
  
- **Billing & Payment**:
  - Personal billing portal with invoice access
  - Payment history and transaction records
  - Insurance information and co-pay tracking

### Restrictions:
- Access limited to personal data only
- Cannot view other patients' information
- Cannot modify treatment plans or clinical notes
- Cannot access administrative or clinic-level data

---

## Permission Matrix

| Feature | Super Admin | Clinic Admin | Therapist | Patient |
|---------|-------------|--------------|-----------|---------|
| System Configuration | ✅ Full Access | ❌ None | ❌ None | ❌ None |
| Multi-Clinic Management | ✅ All Clinics | ❌ None | ❌ None | ❌ None |
| Clinic Management | ✅ All Clinics | ✅ Own Clinic | ❌ None | ❌ None |
| Therapist Management | ✅ All Therapists | ✅ Clinic Staff | ❌ None | ❌ None |
| Patient Management | ✅ All Patients | ✅ Clinic Patients | ✅ Assigned Only | ✅ Self Only |
| Financial Reports | ✅ Global | ✅ Clinic Level | ❌ None | ✅ Personal Bills |
| SOAP Documentation | ✅ View All | ✅ View Clinic | ✅ Create/Edit | ✅ View Own |
| Exercise Assignment | ❌ None | ❌ None | ✅ Full Access | ❌ None |
| Progress Analytics | ✅ All Data | ✅ Clinic Data | ✅ Patient Data | ✅ Personal Data |
| Appointment Scheduling | ✅ All Access | ✅ Clinic Level | ✅ Own Schedule | ✅ Personal Only |
| Secure Messaging | ✅ All Messages | ✅ Clinic Messages | ✅ Patient Comm | ✅ Therapist Comm |

---

## Data Access Levels

### Super Admin
- **Scope**: Entire platform
- **Data Access**: All clinics, users, financial data, system logs
- **Geographic**: Global access across all locations

### Clinic Admin  
- **Scope**: Single clinic
- **Data Access**: Clinic staff, patients, financial data, operational metrics
- **Geographic**: Clinic-specific location data

### Therapist
- **Scope**: Assigned caseload
- **Data Access**: Patient records, treatment data, session notes, progress metrics
- **Geographic**: Patient location data (for home visits/telehealth)

### Patient
- **Scope**: Personal account
- **Data Access**: Own medical records, appointments, billing, progress
- **Geographic**: Personal location data only

## Last Updated
October 16, 2025