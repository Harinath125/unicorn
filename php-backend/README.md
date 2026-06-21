# UniQuorn Backend — XAMPP Setup

## 1. Install & start XAMPP
Download from apachefriends.org, install, open the XAMPP Control Panel,
click **Start** next to **Apache** and **MySQL**.

## 2. Import the database
Go to `http://localhost/phpmyadmin` → **Import** tab → choose `uniquorn_schema.sql`
→ **Go**. This creates the `uniquorn_db` database with all 6 tables and demo seed data.

## 3. Place this folder in htdocs
- Windows: copy this whole folder to `C:\xampp\htdocs\uniquorn`
- Mac: copy to `/Applications/XAMPP/htdocs/uniquorn`

## 4. Test it
With Apache + MySQL running, hit (e.g. with Postman, or `fetch` from your React app):

```
POST http://localhost/uniquorn/auth/login.php
Body: {"email": "clinic@uniquorn.com", "password": "<whatever you reset it to>"}
```

Note: the demo password hashes in the seed data are placeholders. Run this once in any
PHP file to generate real ones, then UPDATE the `users` table in phpMyAdmin:

```php
<?php echo password_hash('yourpassword123', PASSWORD_BCRYPT);
```

After logging in, your session cookie carries `role` and `clinic_id` — every other
endpoint in `patients/`, `therapists/`, and `appointments/` checks that session,
never anything the client claims about itself. That session-role check is the
entire RBAC implementation.

## File map → resume bullet
- `config/db.php` — the MySQL connection (PDO, prepared statements only)
- `auth/login.php`, `auth/session_check.php` — authentication + the RBAC enforcement point
- `patients/`, `therapists/`, `appointments/` — full CRUD, each one query-scoped by role
- `uniquorn_schema.sql` (from earlier) — the structured database design, including the
  `UNIQUE` constraint that makes double-booking a therapist impossible at the DB level
