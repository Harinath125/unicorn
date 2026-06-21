<?php
// Shared helpers — required at the top of every protected endpoint.
// This file is the entire RBAC enforcement mechanism: every endpoint
// trusts $_SESSION['role'] (set once at login, server-side), never a
// role value sent in the request body from the client.
session_start();

header('Content-Type: application/json');
// CORS — only needed because the React frontend (e.g. localhost:3000 in dev)
// runs on a different origin than XAMPP's Apache (localhost, port 80).
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

function require_login() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        die(json_encode(['error' => 'Not logged in']));
    }
}

function require_role(array $allowedRoles) {
    require_login();
    if (!in_array($_SESSION['role'], $allowedRoles, true)) {
        http_response_code(403);
        die(json_encode([
            'error' => 'Forbidden — your role (' . $_SESSION['role'] . ') cannot access this resource'
        ]));
    }
}
