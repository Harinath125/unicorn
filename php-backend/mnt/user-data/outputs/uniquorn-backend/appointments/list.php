<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../auth/session_check.php';
require_login();

$role = $_SESSION['role'];

if ($role === 'super_admin') {
    $stmt = $pdo->query("SELECT a.* FROM appointments a");

} elseif ($role === 'clinic_admin') {
    $stmt = $pdo->prepare("SELECT a.* FROM appointments a
                            JOIN therapists t ON t.therapist_id = a.therapist_id
                            WHERE t.clinic_id = ?");
    $stmt->execute([$_SESSION['clinic_id']]);

} elseif ($role === 'therapist') {
    $stmt = $pdo->prepare("SELECT a.* FROM appointments a
                            JOIN therapists t ON t.therapist_id = a.therapist_id
                            WHERE t.user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);

} elseif ($role === 'patient') {
    $stmt = $pdo->prepare("SELECT a.* FROM appointments a
                            JOIN patients p ON p.patient_id = a.patient_id
                            WHERE p.user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
} else {
    http_response_code(403);
    die(json_encode(['error' => 'Unknown role']));
}

echo json_encode($stmt->fetchAll());
