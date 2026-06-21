<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../auth/session_check.php';
require_role(['clinic_admin', 'super_admin']);

$input     = json_decode(file_get_contents('php://input'), true);
$patientId = $input['patient_id'] ?? null;
if (!$patientId) {
    http_response_code(400);
    die(json_encode(['error' => 'patient_id required']));
}

$stmt = $pdo->prepare("SELECT user_id FROM patients WHERE patient_id = ?");
$stmt->execute([$patientId]);
$row = $stmt->fetch();
if (!$row) {
    http_response_code(404);
    die(json_encode(['error' => 'Patient not found']));
}

// Delete at the USERS level, not the patients level — ON DELETE CASCADE
// in the schema then automatically cleans up the patients row, every
// appointment, and every SOAP note tied to them. One delete, no orphans.
$del = $pdo->prepare("DELETE FROM users WHERE user_id = ?");
$del->execute([$row['user_id']]);

echo json_encode(['success' => true]);
