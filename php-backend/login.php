<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/session_check.php';

$input    = json_decode(file_get_contents('php://input'), true);
$email    = $input['email']    ?? '';
$password = $input['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    die(json_encode(['error' => 'Email and password required']));
}

$stmt = $pdo->prepare("SELECT user_id, name, email, password_hash, role, clinic_id, status
                        FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    die(json_encode(['error' => 'Invalid email or password']));
}

if ($user['status'] !== 'active') {
    http_response_code(403);
    die(json_encode(['error' => 'Account is inactive']));
}

// This is the RBAC anchor: role is stamped into the SERVER-SIDE session here,
// once, at login. Every other endpoint reads $_SESSION['role'] — it is never
// trusted from anything the client sends afterward.
$_SESSION['user_id']   = $user['user_id'];
$_SESSION['role']      = $user['role'];
$_SESSION['clinic_id'] = $user['clinic_id'];

unset($user['password_hash']); // never echo the hash back to the client
echo json_encode(['success' => true, 'user' => $user]);
