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
define('DB_HOST', 'your_database_host'); // e.g., 'localhost' or 'db.ionos.com'
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
define('DB_NAME', 'your_database_name');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

$name = filter_var($input['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$receiveNotifications = isset($input['notifications']) ? (bool)$input['notifications'] : false;

if (empty($name) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Name and Email are required.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit();
}

// Check if user already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already exists.']);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, email, receive_notifications) VALUES (?, ?, ?)");
$stmt->bind_param("ssi", $name, $email, $receiveNotifications);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    // Set a cookie to remember the user (e.g., for 30 days)
    setcookie("user_id", $userId, time() + (86400 * 30), "/"); // 86400 = 1 day

    echo json_encode(['success' => true, 'message' => 'Successfully joined the beta!', 'user_id' => $userId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
