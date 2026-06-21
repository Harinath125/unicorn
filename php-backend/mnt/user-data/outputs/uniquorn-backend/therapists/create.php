<?php
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../auth/session_check.php';
require_role(['clinic_admin', 'super_admin']); // only a clinic admin "hires" a therapist

$input = json_decode(file_get_contents('php://input'), true);
foreach (['name', 'email', 'license_number'] as $f) {
    if (empty($input[$f])) {
        http_response_code(400);
        die(json_encode(['error' => "Missing $f"]));
    }
}

try {
    $pdo->beginTransaction();

    $tempPassword = bin2hex(random_bytes(4));
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, role, clinic_id, status)
                            VALUES (?, ?, ?, 'therapist', ?, 'active')");
    $stmt->execute([
        $input['name'],
        $input['email'],
        password_hash($tempPassword, PASSWORD_BCRYPT),
        $_SESSION['clinic_id'],
    ]);
    $userId = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO therapists (user_id, clinic_id, specialization, license_number, phone)
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $userId,
        $_SESSION['clinic_id'],
        $input['specialization'] ?? null,
        $input['license_number'],
        $input['phone'] ?? null,
    ]);

    $pdo->commit();
    http_response_code(201);
    echo json_encode(['success' => true, 'therapist_id' => $pdo->lastInsertId(), 'temp_password' => $tempPassword]);

} catch (PDOException $e) {
    $pdo->rollBack();
    if ($e->getCode() == 23000) {
        // could be duplicate email OR duplicate license_number — both are UNIQUE
        http_response_code(409);
        die(json_encode(['error' => 'Email or license number already in use']));
    }
    http_response_code(500);
    die(json_encode(['error' => 'Failed to hire therapist: ' . $e->getMessage()]));
}
