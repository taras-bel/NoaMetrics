<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Consider more restrictive CORS policies for production
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database credentials
define('DB_HOST', 'db5018088022.hosting-data.io'); // e.g., 'localhost' or 'db.ionos.com'
define('DB_USER', 'dbu3872171');
define('DB_PASS', 'as;daskdjka@#$22323');
define('DB_NAME', 'dbs14363591');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// Check for user_id from cookie or session (if you implement sessions)
$userId = $_COOKIE['user_id'] ?? null;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'User not identified. Please submit your details first.']);
    exit();
}

// Verify if the user_id exists in the database to prevent arbitrary uploads
$stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID.']);
    $stmt->close();
    $conn->close();
    // Optionally clear the invalid cookie
    setcookie("user_id", "", time() - 3600, "/");
    exit();
}
$stmt->close();

$targetDir = "../uploads/" . $userId . "/"; // Files will be stored in uploads/{user_id}/

// Create user specific directory if it doesn't exist
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true); // Create recursively with read/write permissions for owner
}

$uploadedFiles = [];

if (!empty($_FILES['files']['name'][0])) { // Check if files were uploaded
    foreach ($_FILES['files']['name'] as $key => $fileName) {
        $fileTmpName = $_FILES['files']['tmp_name'][$key];
        $fileSize = $_FILES['files']['size'][$key];
        $fileType = $_FILES['files']['type'][$key];
        $fileError = $_FILES['files']['error'][$key];

        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowed = ['pdf', 'docx'];

        if (in_array($fileExt, $allowed)) {
            if ($fileError === 0) {
                // Generate a unique file name to prevent overwrites and improve security
                $newFileName = uniqid('cv_') . '.' . $fileExt;
                $targetFilePath = $targetDir . $newFileName;

                if (move_uploaded_file($fileTmpName, $targetFilePath)) {
                    // Save file info to database
                    $stmt = $conn->prepare("INSERT INTO user_files (user_id, file_name, file_path) VALUES (?, ?, ?)");
                    $stmt->bind_param("iss", $userId, $fileName, $targetFilePath);
                    if ($stmt->execute()) {
                        $uploadedFiles[] = ['name' => $fileName, 'status' => 'success', 'path' => $targetFilePath];
                    } else {
                        $uploadedFiles[] = ['name' => $fileName, 'status' => 'error', 'message' => 'Database error: ' . $stmt->error];
                    }
                    $stmt->close();
                } else {
                    $uploadedFiles[] = ['name' => $fileName, 'status' => 'error', 'message' => 'Failed to move uploaded file.'];
                }
            } else {
                $uploadedFiles[] = ['name' => $fileName, 'status' => 'error', 'message' => 'File upload error: ' . $fileError];
            }
        } else {
            $uploadedFiles[] = ['name' => $fileName, 'status' => 'error', 'message' => 'Invalid file type. Only PDF and DOCX are allowed.'];
        }
    }
    echo json_encode(['success' => true, 'message' => 'Files processed.', 'files' => $uploadedFiles]);
} else {
    echo json_encode(['success' => false, 'message' => 'No files uploaded or empty file list.']);
}

$conn->close();
?>
