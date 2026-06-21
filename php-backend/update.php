<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../auth/session_check.php';
require_role(['clinic_admin', 'therapist', 'super_admin']);

$input     = json_decode(file_get_contents('php://input'), true);
$patientId = $input['patient_id'] ?? null;
if (!$patientId) {
    http_response_code(400);
    die(json_encode(['error' => 'patient_id required']));
}

// Ownership check: a therapist can only edit patients actually assigned
// to them, even though they have the right ROLE to hit this endpoint.
// Role check alone isn't enough — this is row-level access control.
if ($_SESSION['role'] === 'therapist') {
    $check = $pdo->prepare("SELECT p.patient_id FROM patients p
                             JOIN therapists t ON t.therapist_id = p.therapist_id
                             WHERE p.patient_id = ? AND t.user_id = ?");
    $check->execute([$patientId, $_SESSION['user_id']]);
    if (!$check->fetch()) {
        http_response_code(403);
        die(json_encode(['error' => 'Not your patient']));
    }
}

$allowedFields = ['phone', 'insurance_provider', 'emergency_contact', 'therapist_id'];
$updates = [];
$params  = [];
foreach ($allowedFields as $f) {
    if (array_key_exists($f, $input)) {
        $updates[] = "$f = ?";
        $params[]  = $input[$f];
    }
}
if (!$updates) {
    http_response_code(400);
    die(json_encode(['error' => 'No valid fields to update']));
}

$params[] = $patientId;
$stmt = $pdo->prepare("UPDATE patients SET " . implode(', ', $updates) . " WHERE patient_id = ?");
$stmt->execute($params);

echo json_encode(['success' => true, 'rows_updated' => $stmt->rowCount()]);
