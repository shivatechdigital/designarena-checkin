<?php
declare(strict_types=1);

require_once __DIR__ . '/api/config.php';

$pageKey = (string)($_GET['page'] ?? 'home');
$pages = [
    'home' => ['dataPage' => 'home', 'title' => 'Checkinn Homes | Stay in Upper Tapovan, Rishikesh', 'description' => 'Book comfortable rooms at Checkinn Homes in Upper Tapovan, Rishikesh.'],
    'rooms' => ['dataPage' => 'rooms', 'title' => 'Rooms at Checkinn Homes | Rishikesh', 'description' => 'Explore comfortable rooms at Checkinn Homes in Upper Tapovan, Rishikesh.'],
    'aboutus' => ['dataPage' => 'about', 'title' => 'About Checkinn Homes | Rishikesh', 'description' => 'Learn about Checkinn Homes and our peaceful stay experience in Upper Tapovan, Rishikesh.'],
    'gallery' => ['dataPage' => 'gallery', 'title' => 'Checkinn Homes Gallery | Rishikesh', 'description' => 'See rooms, spaces, and the surroundings at Checkinn Homes in Rishikesh.'],
    'feedback' => ['dataPage' => 'feedback', 'title' => 'Guest Stories | Checkinn Homes', 'description' => 'Read guest stories and reviews for Checkinn Homes in Rishikesh.'],
    'contact' => ['dataPage' => 'contact', 'title' => 'Contact Checkinn Homes | Rishikesh', 'description' => 'Contact Checkinn Homes for room bookings and stay information in Upper Tapovan, Rishikesh.'],
    'admin' => ['dataPage' => 'admin', 'title' => 'Checkinn Homes | Staff Login', 'description' => 'Staff login for Checkinn Homes.'],
];
if (!isset($pages[$pageKey])) {
    http_response_code(404);
    exit('Page not found.');
}

$page = $pages[$pageKey];
$host = preg_replace('/[^A-Za-z0-9.:-]/', '', $_SERVER['HTTP_HOST'] ?? 'demo.checkinnhomes.com');
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$baseUrl = $scheme . '://' . $host;
try {
    $pdo = new PDO(sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME), DB_USER, DB_PASSWORD, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $stmt = $pdo->prepare('SELECT * FROM seo_pages WHERE page_key=?');
    $stmt->execute([$pageKey]);
    $seo = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
} catch (Throwable $error) {
    $seo = [];
}
$title = trim((string)($seo['title'] ?? $page['title']));
$description = trim((string)($seo['meta_description'] ?? $page['description']));
$canonicalPath = trim((string)($seo['canonical_path'] ?? '')) ?: ($pageKey === 'home' ? '/' : '/' . $pageKey);
$canonical = str_starts_with($canonicalPath, 'http') ? $canonicalPath : $baseUrl . '/' . ltrim($canonicalPath, '/');
$robots = ($seo['robots'] ?? 'index,follow') === 'noindex,nofollow' ? 'noindex,nofollow' : 'index,follow';
$ogImage = trim((string)($seo['og_image'] ?? ''));
$schema = trim((string)($seo['schema_json'] ?? ''));
if ($schema !== '' && json_decode($schema, true) === null) $schema = '';
$baseSchema = $pageKey === 'admin' ? '' : json_encode([
  '@context' => 'https://schema.org', '@type' => 'LodgingBusiness',
  'name' => 'Checkinn Homes', 'url' => $baseUrl . '/',
  'description' => $description,
  'address' => ['@type' => 'PostalAddress', 'streetAddress' => 'Secret Waterfall Rd, Upper Tapovan', 'addressLocality' => 'Rishikesh', 'addressRegion' => 'Uttarakhand', 'postalCode' => '249192', 'addressCountry' => 'IN'],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
function esc(string $value): string { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= esc($title) ?></title>
  <meta name="description" content="<?= esc($description) ?>">
  <meta name="robots" content="<?= esc($robots) ?>">
  <link rel="canonical" href="<?= esc($canonical) ?>">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?= esc($title) ?>">
  <meta property="og:description" content="<?= esc($description) ?>">
  <meta property="og:url" content="<?= esc($canonical) ?>">
  <?php if ($ogImage !== ''): ?><meta property="og:image" content="<?= esc($ogImage) ?>"><?php endif; ?>
  <?php if ($baseSchema !== ''): ?><script type="application/ld+json"><?= $baseSchema ?></script><?php endif; ?>
  <?php if ($schema !== ''): ?><script type="application/ld+json"><?= $schema ?></script><?php endif; ?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="js/tailwind-config.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
</head>
<body data-page="<?= esc($page['dataPage']) ?>">
  <div id="root"></div>
  <script src="js/app.bundle.js"></script>
</body>
</html>
