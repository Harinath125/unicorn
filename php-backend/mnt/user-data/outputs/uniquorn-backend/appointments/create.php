<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../auth/session_check.php';
require_role(['patient', 'clinic_admin', 'therapist']);

$input = json_decode(file_get_contents('php://input'), true);
foreach (['patient_id', 'therapist_id', 'appointment_date', 'appointment_time'] as $f) {
    if (empty($input[$f])) {
        http_response_code(400);
        die(json_encode(['error' => "Missing $f"]));
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO appointments
        (patient_id, therapist_id, appointment_date, appointment_time, session_type, notes)
        VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $input['patient_id'],
        $input['therapist_id'],
        $input['appointment_date'],
        $input['appointment_time'],
        $input['session_type'] ?? 'individual',
        $input['notes'] ?? null,
    ]);
    http_response_code(201);
    echo json_encode(['success' => true, 'appointment_id' => $pdo->lastInsertId()]);

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        // MySQL error 1062 — violates uq_therapist_slot(therapist_id, date, time).
        // The DATABASE caught the double-booking here, not application logic —
        // this is the exact constraint from the schema doing its job.
        http_response_code(409);
        die(json_encode(['error' => 'This therapist already has an appointment at that date and time']));
    }
    http_response_code(500);
    die(json_encode(['error' => 'Booking failed: ' . $e->getMessage()]));
}
