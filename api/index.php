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
        $coupons = array_map('coupon_from_row', db()->query('SELECT * FROM coupons WHERE active=1 ORDER BY discount_percent DESC')->fetchAll());
        $response = ['rooms' => $rooms, 'roomTypes' => $types, 'reviews' => $reviews, 'coupons' => $coupons, 'hotelConfig' => settings_data()];
        if (is_admin()) {
            $response['bookings'] = array_map('booking_from_row', db()->query('SELECT * FROM bookings ORDER BY created_at DESC')->fetchAll());
            $response['queries'] = array_map('query_from_row', db()->query('SELECT * FROM queries ORDER BY created_at DESC')->fetchAll());
            $response['csrfToken'] = csrf_token();
        }
        json_response($response);
    }

    if ($resource === 'auth') {
        if ($method === 'GET') {
            json_response(['authenticated' => is_admin(), 'csrfToken' => is_admin() ? csrf_token() : null]);
        }
        if ($method === 'POST') {
            require_fields($body, ['email', 'password']);
            $stmt = db()->prepare('SELECT id, email, password_hash FROM admins WHERE email=? LIMIT 1');
            $stmt->execute([strtolower(trim((string)$body['email']))]);
            $admin = $stmt->fetch();
            if (!$admin || !password_verify((string)$body['password'], $admin['password_hash'])) {
                json_response(['error' => 'Incorrect email or password.'], 401);
            }
            session_regenerate_id(true);
            $_SESSION['admin_id'] = (int)$admin['id'];
            $_SESSION['admin_email'] = $admin['email'];
            json_response(['ok' => true, 'email' => $admin['email'], 'csrfToken' => csrf_token()]);
        }
        if ($method === 'DELETE') {
            require_admin();
            $_SESSION = [];
            session_destroy();
            json_response(['ok' => true]);
        }
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
            require_fields($body, ['code', 'discountPercent']);
            $stmt = db()->prepare('INSERT INTO coupons (code,discount_percent,minimum_amount,active) VALUES (?,?,?,?)');
            $stmt->execute([strtoupper(trim((string)$body['code'])), (int)$body['discountPercent'], (int)($body['minimumAmount'] ?? 0), !empty($body['active']) ? 1 : 0]);
            $stmt = db()->prepare('SELECT * FROM coupons WHERE id=?'); $stmt->execute([(int)db()->lastInsertId()]);
            json_response(coupon_from_row($stmt->fetch()), 201);
        }
                if ($method === 'PUT') {
                        require_fields($body, ['id', 'code', 'discountPercent']);
                        $stmt = db()->prepare('UPDATE coupons SET code=?, discount_percent=?, minimum_amount=?, active=? WHERE id=?');
                        $stmt->execute([strtoupper(trim((string)$body['code'])), (int)$body['discountPercent'], (int)($body['minimumAmount'] ?? 0), !empty($body['active']) ? 1 : 0, (int)$body['id']]);
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

    json_response(['error' => 'Endpoint not found.'], 404);
} catch (PDOException $error) {
    try { if (db()->inTransaction()) db()->rollBack(); } catch (Throwable $ignored) {}
    $status = $error->getCode() === '23000' ? 409 : 500;
    json_response(['error' => $status === 409 ? 'This record already exists or is still in use.' : 'Database request failed.'], $status);
} catch (Throwable $error) {
    try { if (db()->inTransaction()) db()->rollBack(); } catch (Throwable $ignored) {}
    json_response(['error' => APP_ENV === 'development' ? $error->getMessage() : 'Server request failed.'], 500);
}
