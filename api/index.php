<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';

$resource = (string)($_GET['resource'] ?? 'bootstrap');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$body = in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true) ? json_body() : [];

try {
    if ($resource === 'bootstrap' && $method === 'GET') {
        $rooms = array_map('room_from_row', db()->query('SELECT * FROM rooms ORDER BY created_at, id')->fetchAll());
        $types = array_column(db()->query('SELECT name FROM room_types ORDER BY name')->fetchAll(), 'name');
        $reviews = array_map('review_from_row', db()->query('SELECT * FROM reviews WHERE approved=1 ORDER BY created_at DESC')->fetchAll());
        $coupons = array_map('coupon_from_row', db()->query('SELECT * FROM coupons WHERE active=1 ORDER BY discount_value DESC')->fetchAll());
        $response = ['rooms' => $rooms, 'roomTypes' => $types, 'reviews' => $reviews, 'coupons' => $coupons, 'hotelConfig' => settings_data(), 'razorpayKeyId' => RAZORPAY_KEY_ID];
        if (is_admin()) {
            $response['bookings'] = array_map('booking_from_row', db()->query('SELECT * FROM bookings ORDER BY created_at DESC')->fetchAll());
            $response['queries'] = array_map('query_from_row', db()->query('SELECT * FROM queries ORDER BY created_at DESC')->fetchAll());
            $response['coupons'] = array_map('coupon_from_row', db()->query('SELECT * FROM coupons ORDER BY created_at DESC')->fetchAll());
            $response['csrfToken'] = csrf_token();
        }
        json_response($response);
    }

    if ($resource === 'auth') {
        if ($method === 'GET') {
            $profile = null;
            if (is_admin()) {
                $stmt = db()->prepare('SELECT email, display_name, profile_photo FROM admins WHERE id=? AND active=1');
                $stmt->execute([$_SESSION['admin_id']]);
                $profile = $stmt->fetch() ?: null;
                if (!$profile) $_SESSION = [];
            }
            json_response(['authenticated' => $profile !== null, 'csrfToken' => $profile ? csrf_token() : null, 'profile' => $profile]);
        }
        if ($method === 'POST') {
            require_fields($body, ['email', 'password']);
            $stmt = db()->prepare('SELECT id, email, password_hash, display_name, profile_photo FROM admins WHERE email=? AND active=1 LIMIT 1');
            $stmt->execute([strtolower(trim((string)$body['email']))]);
            $admin = $stmt->fetch();
            if (!$admin || !password_verify((string)$body['password'], $admin['password_hash'])) {
                json_response(['error' => 'Incorrect email or password.'], 401);
            }
            session_regenerate_id(true);
            $_SESSION['admin_id'] = (int)$admin['id'];
            $_SESSION['admin_email'] = $admin['email'];
            json_response(['ok' => true, 'email' => $admin['email'], 'profile' => ['email' => $admin['email'], 'display_name' => $admin['display_name'], 'profile_photo' => $admin['profile_photo']], 'csrfToken' => csrf_token()]);
        }
        if ($method === 'DELETE') {
            require_admin();
            $_SESSION = [];
            session_destroy();
            json_response(['ok' => true]);
        }
        if ($method === 'PUT') {
            require_admin();
            require_fields($body, ['displayName']);
            $params = [trim((string)$body['displayName']), trim((string)($body['profilePhoto'] ?? ''))];
            $sql = 'UPDATE admins SET display_name=?, profile_photo=?';
            if (!empty($body['newPassword'])) {
                require_fields($body, ['currentPassword']);
                $stmt = db()->prepare('SELECT password_hash FROM admins WHERE id=?'); $stmt->execute([$_SESSION['admin_id']]);
                if (!password_verify((string)$body['currentPassword'], (string)$stmt->fetchColumn())) json_response(['error' => 'Current password is incorrect.'], 422);
                $sql .= ', password_hash=?';
                $params[] = password_hash((string)$body['newPassword'], PASSWORD_DEFAULT);
            }
            $deactivate = !empty($body['deactivate']);
            if ($deactivate) $sql .= ', active=0';
            $sql .= ' WHERE id=?'; $params[] = $_SESSION['admin_id'];
            db()->prepare($sql)->execute($params);
            if ($deactivate) { $_SESSION = []; session_destroy(); json_response(['ok' => true, 'deactivated' => true]); }
            $stmt = db()->prepare('SELECT email, display_name, profile_photo FROM admins WHERE id=?'); $stmt->execute([$_SESSION['admin_id']]);
            json_response(['ok' => true, 'profile' => $stmt->fetch()]);
        }
    }

    if ($resource === 'payment') {
        if (RAZORPAY_KEY_ID === '' || RAZORPAY_KEY_SECRET === '') json_response(['error' => 'Online payment is not configured yet.'], 503);
        if ($method === 'POST') {
            require_fields($body, ['amount', 'receipt']);
            $amount = (int)$body['amount'];
            if ($amount < 100) json_response(['error' => 'Payment amount must be at least Rs 1.'], 422);
            $curl = curl_init('https://api.razorpay.com/v1/orders');
            curl_setopt_array($curl, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_USERPWD => RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET, CURLOPT_HTTPAUTH => CURLAUTH_BASIC, CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_POSTFIELDS => json_encode(['amount' => $amount, 'currency' => 'INR', 'receipt' => substr((string)$body['receipt'], 0, 40), 'payment_capture' => 1])]);
            $response = curl_exec($curl);
            $status = (int)curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $curlError = curl_error($curl);
            curl_close($curl);
            $order = json_decode((string)$response, true);
            if ($response === false || $status < 200 || $status >= 300 || !is_array($order) || empty($order['id'])) json_response(['error' => 'Could not create Razorpay order. ' . ($curlError ?: '')], 502);
            json_response(['orderId' => $order['id'], 'amount' => $amount, 'currency' => 'INR', 'keyId' => RAZORPAY_KEY_ID]);
        }
        if ($method === 'PUT') {
            require_fields($body, ['orderId', 'paymentId', 'signature']);
            $expected = hash_hmac('sha256', $body['orderId'] . '|' . $body['paymentId'], RAZORPAY_KEY_SECRET);
            if (!hash_equals($expected, (string)$body['signature'])) json_response(['error' => 'Razorpay payment verification failed.'], 422);
            json_response(['ok' => true]);
        }
        json_response(['error' => 'Method not allowed.'], 405);
    }

    if ($resource === 'rooms') {
        if ($method === 'GET') {
            json_response(array_map('room_from_row', db()->query('SELECT * FROM rooms ORDER BY created_at, id')->fetchAll()));
        }
        require_admin();
        if (in_array($method, ['POST', 'PUT'], true)) {
            require_fields($body, ['id','name','type','capacity','bed','image','description']);
            $stmt = db()->prepare('INSERT INTO rooms (id,name,type,price,original_price,capacity,bed,size,rating,reviews_count,image,gallery,amenities,meal_plans,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),type=VALUES(type),price=VALUES(price),original_price=VALUES(original_price),capacity=VALUES(capacity),bed=VALUES(bed),size=VALUES(size),rating=VALUES(rating),reviews_count=VALUES(reviews_count),image=VALUES(image),gallery=VALUES(gallery),amenities=VALUES(amenities),meal_plans=VALUES(meal_plans),description=VALUES(description)');
            $stmt->execute([$body['id'],$body['name'],$body['type'],(int)($body['price']??0),isset($body['originalPrice'])?(int)$body['originalPrice']:null,$body['capacity'],$body['bed'],$body['size']??'',(float)($body['rating']??5),(int)($body['reviewsCount']??0),$body['image'],json_encode($body['gallery']??[$body['image']]),json_encode($body['amenities']??[]),json_encode($body['mealPlans']??[]),$body['description']]);
            $stmt = db()->prepare('SELECT * FROM rooms WHERE id=?'); $stmt->execute([$body['id']]);
            json_response(room_from_row($stmt->fetch()), $method === 'POST' ? 201 : 200);
        }
        if ($method === 'DELETE') {
            require_fields($body, ['id']);
            $stmt = db()->prepare('DELETE FROM rooms WHERE id=?'); $stmt->execute([$body['id']]);
            json_response(['ok' => true]);
        }
    }

    if ($resource === 'room-types') {
        if ($method === 'GET') json_response(array_column(db()->query('SELECT name FROM room_types ORDER BY name')->fetchAll(), 'name'));
        require_admin();
        if ($method === 'POST') {
            require_fields($body, ['name']);
            $stmt = db()->prepare('INSERT INTO room_types (name) VALUES (?)'); $stmt->execute([trim($body['name'])]);
            json_response(['name' => trim($body['name'])], 201);
        }
        if ($method === 'PUT') {
            require_fields($body, ['oldName','name']);
            db()->beginTransaction();
            $stmt = db()->prepare('UPDATE room_types SET name=? WHERE name=?'); $stmt->execute([trim($body['name']), $body['oldName']]);
            $stmt = db()->prepare('UPDATE rooms SET type=? WHERE type=?'); $stmt->execute([trim($body['name']), $body['oldName']]);
            db()->commit();
            json_response(['name' => trim($body['name'])]);
        }
        if ($method === 'DELETE') {
            require_fields($body, ['name']);
            $stmt = db()->prepare('SELECT COUNT(*) FROM rooms WHERE type=?'); $stmt->execute([$body['name']]);
            if ((int)$stmt->fetchColumn() > 0) json_response(['error' => 'Reassign rooms before deleting this type.'], 409);
            $stmt = db()->prepare('DELETE FROM room_types WHERE name=?'); $stmt->execute([$body['name']]);
            json_response(['ok' => true]);
        }
    }

    if ($resource === 'bookings') {
        if ($method === 'POST') {
            require_fields($body, ['id','guestName','email','phone','roomName','checkIn','checkOut']);
            $stmt = db()->prepare('INSERT INTO bookings (id,guest_name,email,phone,room_name,check_in,check_out,guests,total_amount,status,payment_mode,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
            $stmt->execute([$body['id'],$body['guestName'],$body['email']??'',$body['phone'],$body['roomName'],$body['checkIn'],$body['checkOut'],(int)($body['guests']??1),(int)($body['totalAmount']??0),'Confirmed',$body['paymentMode']??'Direct Host Reservation',$body['notes']??'']);
            $stmt = db()->prepare('SELECT * FROM bookings WHERE id=?'); $stmt->execute([$body['id']]);
            $booking = booking_from_row($stmt->fetch());
            $booking['emailSent'] = send_booking_confirmation($booking);
            json_response($booking, 201);
        }
        require_admin();
        if ($method === 'GET') json_response(array_map('booking_from_row', db()->query('SELECT * FROM bookings ORDER BY created_at DESC')->fetchAll()));
        if (in_array($method, ['PUT','PATCH'], true)) {
            require_fields($body, ['id','status']);
            $bookingFields = ['guestName', 'email', 'phone', 'roomName', 'checkIn', 'checkOut', 'guests', 'totalAmount', 'paymentMode', 'notes'];
            $hasBookingEdits = array_intersect(array_keys($body), $bookingFields) !== [];
            if ($hasBookingEdits) {
                require_fields($body, ['guestName', 'email', 'phone', 'roomName', 'checkIn', 'checkOut']);
                $stmt = db()->prepare('UPDATE bookings SET guest_name=?, email=?, phone=?, room_name=?, check_in=?, check_out=?, guests=?, total_amount=?, status=?, payment_mode=?, notes=? WHERE id=?');
                $stmt->execute([$body['guestName'], $body['email'], $body['phone'], $body['roomName'], $body['checkIn'], $body['checkOut'], (int)($body['guests'] ?? 1), (int)($body['totalAmount'] ?? 0), $body['status'], $body['paymentMode'] ?? '', $body['notes'] ?? '', $body['id']]);
                $stmt = db()->prepare('SELECT * FROM bookings WHERE id=?'); $stmt->execute([$body['id']]);
                json_response(booking_from_row($stmt->fetch()));
            }
            $stmt = db()->prepare('UPDATE bookings SET status=? WHERE id=?'); $stmt->execute([$body['status'],$body['id']]);
            json_response(['ok' => true]);
        }
        if ($method === 'DELETE') {
            require_fields($body, ['id']); $stmt = db()->prepare('DELETE FROM bookings WHERE id=?'); $stmt->execute([$body['id']]); json_response(['ok'=>true]);
        }
    }

    if ($resource === 'coupons') {
        if ($method === 'GET') json_response(array_map('coupon_from_row', db()->query('SELECT * FROM coupons ORDER BY created_at DESC')->fetchAll()));
        require_admin();
        if ($method === 'POST') {
            require_fields($body, ['code', 'discountType', 'discountValue']);
            $discountType = $body['discountType'] === 'fixed' ? 'fixed' : 'percentage';
            $discountValue = (int)$body['discountValue'];
            if ($discountValue < 1 || ($discountType === 'percentage' && $discountValue > 100)) json_response(['error' => 'Enter a valid discount value.'], 422);
            $legacyPercent = $discountType === 'percentage' ? $discountValue : 1;
            $stmt = db()->prepare('INSERT INTO coupons (code,discount_type,discount_value,discount_percent,minimum_amount,active) VALUES (?,?,?,?,?,?)');
            $stmt->execute([strtoupper(trim((string)$body['code'])), $discountType, $discountValue, $legacyPercent, (int)($body['minimumAmount'] ?? 0), !empty($body['active']) ? 1 : 0]);
            $stmt = db()->prepare('SELECT * FROM coupons WHERE id=?'); $stmt->execute([(int)db()->lastInsertId()]);
            json_response(coupon_from_row($stmt->fetch()), 201);
        }
                if ($method === 'PUT') {
                    require_fields($body, ['id', 'code', 'discountType', 'discountValue']);
                    $discountType = $body['discountType'] === 'fixed' ? 'fixed' : 'percentage';
                    $discountValue = (int)$body['discountValue'];
                    if ($discountValue < 1 || ($discountType === 'percentage' && $discountValue > 100)) json_response(['error' => 'Enter a valid discount value.'], 422);
                    $legacyPercent = $discountType === 'percentage' ? $discountValue : 1;
                    $stmt = db()->prepare('UPDATE coupons SET code=?, discount_type=?, discount_value=?, discount_percent=?, minimum_amount=?, active=? WHERE id=?');
                    $stmt->execute([strtoupper(trim((string)$body['code'])), $discountType, $discountValue, $legacyPercent, (int)($body['minimumAmount'] ?? 0), !empty($body['active']) ? 1 : 0, (int)$body['id']]);
                        $stmt = db()->prepare('SELECT * FROM coupons WHERE id=?'); $stmt->execute([(int)$body['id']]);
                        json_response(coupon_from_row($stmt->fetch()));
                }
        if ($method === 'DELETE') {
            require_fields($body, ['id']);
            $stmt = db()->prepare('DELETE FROM coupons WHERE id=?'); $stmt->execute([(int)$body['id']]);
            json_response(['ok' => true]);
        }
    }

    if ($resource === 'queries') {
        if ($method === 'POST') {
            require_fields($body, ['id','name','phone','subject','message']);
            $stmt=db()->prepare('INSERT INTO queries (id,name,email,phone,subject,message,display_date,status) VALUES (?,?,?,?,?,?,?,?)');
            $stmt->execute([$body['id'],$body['name'],$body['email']??'',$body['phone'],$body['subject'],$body['message'],$body['date']??'Just now','New']);
            json_response($body,201);
        }
        require_admin();
        if ($method === 'GET') json_response(array_map('query_from_row',db()->query('SELECT * FROM queries ORDER BY created_at DESC')->fetchAll()));
        if (in_array($method,['PUT','PATCH'],true)) { require_fields($body,['id','status']); $stmt=db()->prepare('UPDATE queries SET status=? WHERE id=?'); $stmt->execute([$body['status'],$body['id']]); json_response(['ok'=>true]); }
        if ($method === 'DELETE') { require_fields($body,['id']); $stmt=db()->prepare('DELETE FROM queries WHERE id=?'); $stmt->execute([$body['id']]); json_response(['ok'=>true]); }
    }

    if ($resource === 'reviews') {
        if ($method === 'GET') json_response(array_map('review_from_row',db()->query('SELECT * FROM reviews WHERE approved=1 ORDER BY created_at DESC')->fetchAll()));
        if ($method === 'POST') {
            require_fields($body,['id','name','comment']);
            $stmt=db()->prepare('INSERT INTO reviews (id,name,city,rating,room,display_date,comment,avatar,approved) VALUES (?,?,?,?,?,?,?,?,1)');
            $stmt->execute([$body['id'],$body['name'],$body['city']??'Traveler',(int)($body['rating']??5),$body['room']??'Check In Homes',$body['date']??'Just now',$body['comment'],$body['avatar']??'']);
            json_response($body,201);
        }
        require_admin();
        if ($method === 'DELETE') { require_fields($body,['id']); $stmt=db()->prepare('DELETE FROM reviews WHERE id=?'); $stmt->execute([$body['id']]); json_response(['ok'=>true]); }
    }

    if ($resource === 'settings') {
        if ($method === 'GET') json_response(settings_data());
        require_admin();
        if ($method === 'PUT') {
            $stmt=db()->prepare('INSERT INTO hotel_settings (setting_key,setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)');
            foreach ($body as $key=>$value) $stmt->execute([(string)$key,(string)$value]);
            json_response(settings_data());
        }
    }

    if ($resource === 'seo') {
        $allowedPages = ['home', 'rooms', 'aboutus', 'gallery', 'feedback', 'contact'];
        if ($method === 'GET') {
            $pageKey = (string)($_GET['page'] ?? '');
            if ($pageKey !== '' && !in_array($pageKey, $allowedPages, true)) json_response(['error' => 'Invalid SEO page.'], 422);
            if ($pageKey !== '') {
                $stmt = db()->prepare('SELECT * FROM seo_pages WHERE page_key=?'); $stmt->execute([$pageKey]);
                json_response($stmt->fetch() ?: []);
            }
            json_response(db()->query('SELECT * FROM seo_pages ORDER BY page_key')->fetchAll());
        }
        require_admin();
        if ($method === 'PUT') {
            require_fields($body, ['pageKey', 'title']);
            if (!in_array($body['pageKey'], $allowedPages, true)) json_response(['error' => 'Invalid SEO page.'], 422);
            $stmt = db()->prepare('INSERT INTO seo_pages (page_key,title,meta_description,focus_keyword,canonical_path,robots,og_image,h1,intro_text,schema_json) VALUES (?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title),meta_description=VALUES(meta_description),focus_keyword=VALUES(focus_keyword),canonical_path=VALUES(canonical_path),robots=VALUES(robots),og_image=VALUES(og_image),h1=VALUES(h1),intro_text=VALUES(intro_text),schema_json=VALUES(schema_json)');
            $stmt->execute([$body['pageKey'], trim($body['title']), trim((string)($body['metaDescription'] ?? '')), trim((string)($body['focusKeyword'] ?? '')), trim((string)($body['canonicalPath'] ?? '')), $body['robots'] === 'noindex,nofollow' ? 'noindex,nofollow' : 'index,follow', trim((string)($body['ogImage'] ?? '')), trim((string)($body['h1'] ?? '')), trim((string)($body['introText'] ?? '')), trim((string)($body['schemaJson'] ?? ''))]);
            $stmt = db()->prepare('SELECT * FROM seo_pages WHERE page_key=?'); $stmt->execute([$body['pageKey']]);
            json_response($stmt->fetch());
        }
    }

    json_response(['error' => 'Endpoint not found.'], 404);
} catch (PDOException $error) {
    try { if (db()->inTransaction()) db()->rollBack(); } catch (Throwable $ignored) {}
    $status = $error->getCode() === '23000' ? 409 : 500;
    json_response(['error' => $status === 409 ? 'This record already exists or is still in use.' : 'Database request failed.'], $status);
} catch (Throwable $error) {
    try { if (db()->inTransaction()) db()->rollBack(); } catch (Throwable $ignored) {}
    json_response(['error' => APP_ENV === 'development' ? $error->getMessage() : 'Server request failed.'], 500);
}
