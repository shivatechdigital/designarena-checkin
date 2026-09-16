<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_response(['error' => 'Method not allowed.'], 405);
}

if (!isset($_FILES['images'])) {
    json_response(['error' => 'No images were uploaded.'], 422);
}

$files = $_FILES['images'];
$names = is_array($files['name']) ? $files['name'] : [$files['name']];
$tmpNames = is_array($files['tmp_name']) ? $files['tmp_name'] : [$files['tmp_name']];
$errors = is_array($files['error']) ? $files['error'] : [$files['error']];
$sizes = is_array($files['size']) ? $files['size'] : [$files['size']];

$uploadDirectory = __DIR__ . '/uploads';
if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
    json_response(['error' => 'Upload directory could not be created.'], 500);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$urls = [];
foreach ($tmpNames as $index => $tmpName) {
    if (($errors[$index] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        json_response(['error' => 'An image upload failed.'], 422);
    }
    if (($sizes[$index] ?? 0) > MAX_UPLOAD_BYTES) {
        json_response(['error' => 'Each image must be 5 MB or smaller.'], 422);
    }
    $mime = $finfo->file($tmpName);
    if (!in_array($mime, ALLOWED_IMAGE_TYPES, true)) {
        json_response(['error' => 'Only JPG, PNG, and WEBP images are allowed.'], 422);
    }
    $extension = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$mime];
    $filename = bin2hex(random_bytes(16)) . '.' . $extension;
    if (!move_uploaded_file($tmpName, $uploadDirectory . '/' . $filename)) {
        json_response(['error' => 'Could not store uploaded image.'], 500);
    }
    $basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/api/upload.php')), '/');
    $urls[] = $basePath . '/uploads/' . $filename;
}

json_response(['ok' => true, 'urls' => $urls], 201);
