<?php
declare(strict_types=1);

header('Content-Type: application/xml; charset=utf-8');
$host = preg_replace('/[^A-Za-z0-9.:-]/', '', $_SERVER['HTTP_HOST'] ?? 'demo.checkinnhomes.com');
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$baseUrl = $scheme . '://' . $host;
$paths = ['/', '/rooms', '/aboutus', '/gallery', '/feedback', '/contact'];
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($paths as $path): ?>
  <url><loc><?= htmlspecialchars($baseUrl . $path, ENT_XML1, 'UTF-8') ?></loc></url>
<?php endforeach; ?>
</urlset>
