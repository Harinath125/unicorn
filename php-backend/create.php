<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../auth/session_check.php';
require_role(['clinic_admin', 'super_admin']);

$input = json_decode(file_get_contents('php://input'), true);

foreach (['name', 'email', 'date_of_birth'] as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        die(json_encode(['error' => "Missing required field: $field"]));
    }
}

try {
    // Two related INSERTs (a login row + a patient profile row) have to
    // succeed together or not at all — that's exactly what a transaction
    // is for. If the second insert failed after the first committed, you'd
    // have an orphaned login with no patient record: a real data bug.
    $pdo->beginTransaction();

    $tempPassword = bin2hex(random_bytes(4)); // patient resets this on first login
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role, clinic_id, status)
                            VALUES (?, ?, ?, 'patient', ?, 'active')");
    $stmt->execute([
        $input['name'],
        $input['email'],
        password_hash($tempPassword, PASSWORD_BCRYPT),
        $_SESSION['clinic_id'],
    ]);
    $userId = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO patients
        (user_id, clinic_id, therapist_id, date_of_birth, phone, insurance_provider, emergency_contact)
        VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $userId,
        $_SESSION['clinic_id'],
        $input['therapist_id'] ?? null,
        $input['date_of_birth'],
        $input['phone'] ?? null,
        $input['insurance_provider'] ?? null,
        $input['emergency_contact'] ?? null,
    ]);

    $pdo->commit();
    http_response_code(201);
    echo json_encode([
        'success'       => true,
        'patient_id'    => $pdo->lastInsertId(),
        'temp_password' => $tempPassword, // in a real system: emailed, never returned in the response
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    if ($e->getCode() == 23000) { // MySQL 1062 — duplicate key, hit the UNIQUE on users.email
        http_response_code(409);
        die(json_encode(['error' => 'A user with this email already exists']));
    }
    http_response_code(500);
    die(json_encode(['error' => 'Failed to enroll patient: ' . $e->getMessage()]));
}
