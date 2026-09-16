<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

ini_set('display_errors', APP_ENV === 'development' ? '1' : '0');
error_reporting(E_ALL);

session_name(SESSION_NAME);
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function db(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME);
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function json_response(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['error' => 'Invalid JSON body.'], 400);
    }
    return $data;
}

function require_fields(array $data, array $fields): void
{
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
            json_response(['error' => "Missing required field: {$field}"], 422);
        }
    }
}

function is_admin(): bool
{
    return isset($_SESSION['admin_id']);
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function require_admin(): void
{
    if (!is_admin()) {
        json_response(['error' => 'Authentication required.'], 401);
    }
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!hash_equals(csrf_token(), $token)) {
            json_response(['error' => 'Invalid security token. Refresh and try again.'], 403);
        }
    }
}

function decode_json_field(mixed $value, array $fallback = []): array
{
    if (is_array($value)) {
        return $value;
    }
    $decoded = json_decode((string)$value, true);
    return is_array($decoded) ? $decoded : $fallback;
}

function room_from_row(array $row): array
{
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'type' => $row['type'],
        'price' => (int)$row['price'],
        'originalPrice' => $row['original_price'] === null ? null : (int)$row['original_price'],
        'capacity' => $row['capacity'],
        'bed' => $row['bed'],
        'size' => $row['size'],
        'rating' => (float)$row['rating'],
        'reviewsCount' => (int)$row['reviews_count'],
        'image' => $row['image'],
        'gallery' => decode_json_field($row['gallery']),
        'amenities' => decode_json_field($row['amenities']),
        'mealPlans' => decode_json_field($row['meal_plans']),
        'description' => $row['description'],
    ];
}

function booking_from_row(array $row): array
{
    return [
        'id' => $row['id'], 'guestName' => $row['guest_name'], 'email' => $row['email'],
        'phone' => $row['phone'], 'roomName' => $row['room_name'], 'checkIn' => $row['check_in'],
        'checkOut' => $row['check_out'], 'guests' => (int)$row['guests'],
        'totalAmount' => (int)$row['total_amount'], 'status' => $row['status'],
        'paymentMode' => $row['payment_mode'], 'notes' => $row['notes'],
        'createdAt' => $row['created_at'],
    ];
}

function query_from_row(array $row): array
{
    return [
        'id' => $row['id'], 'name' => $row['name'], 'email' => $row['email'],
        'phone' => $row['phone'], 'subject' => $row['subject'], 'message' => $row['message'],
        'date' => $row['display_date'], 'status' => $row['status'], 'createdAt' => $row['created_at'],
    ];
}

function review_from_row(array $row): array
{
    return [
        'id' => $row['id'], 'name' => $row['name'], 'city' => $row['city'],
        'rating' => (int)$row['rating'], 'room' => $row['room'], 'date' => $row['display_date'],
        'comment' => $row['comment'], 'avatar' => $row['avatar'], 'approved' => (bool)$row['approved'],
    ];
}

function settings_data(): array
{
    $rows = db()->query('SELECT setting_key, setting_value FROM hotel_settings')->fetchAll();
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    return $settings;
}
