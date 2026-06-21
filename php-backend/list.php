<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../auth/session_check.php';
require_login();

// Same endpoint, four different SQL scopes — this IS what "RBAC enforced
// at the database query level" actually looks like, not just a UI hiding
// buttons it shouldn't show.
$role = $_SESSION['role'];

if ($role === 'super_admin') {
    $stmt = $pdo->query("SELECT p.*, u.name, u.email FROM patients p
                          JOIN users u ON u.user_id = p.user_id");

} elseif ($role === 'clinic_admin') {
    $stmt = $pdo->prepare("SELECT p.*, u.name, u.email FROM patients p
                            JOIN users u ON u.user_id = p.user_id
                            WHERE p.clinic_id = ?");
    $stmt->execute([$_SESSION['clinic_id']]);

} elseif ($role === 'therapist') {
    // a therapist sees only patients assigned to them — not the whole clinic
    $stmt = $pdo->prepare("SELECT p.*, u.name, u.email FROM patients p
                            JOIN users u ON u.user_id = p.user_id
                            JOIN therapists t ON t.therapist_id = p.therapist_id
                            WHERE t.user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);

} elseif ($role === 'patient') {
    // a patient can only ever see their own record
    $stmt = $pdo->prepare("SELECT p.*, u.name, u.email FROM patients p
                            JOIN users u ON u.user_id = p.user_id
                            WHERE p.user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
} else {
    http_response_code(403);
    die(json_encode(['error' => 'Unknown role']));
}

echo json_encode($stmt->fetchAll());
