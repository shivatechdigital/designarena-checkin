<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';

if (!hash_equals(INSTALL_KEY, (string)($_GET['key'] ?? ''))) {
    json_response(['error' => 'Invalid installation key.'], 403);
}

try {
    $schema = file_get_contents(dirname(__DIR__) . '/database/schema.sql');
    if ($schema === false) {
        throw new RuntimeException('database/schema.sql was not found.');
    }
    foreach (preg_split('/;\s*(?:\r?\n|$)/', $schema) as $statement) {
        $statement = trim($statement);
        if ($statement !== '') {
            db()->exec($statement);
        }
    }

    $admin = db()->prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)');
    $admin->execute([ADMIN_EMAIL, password_hash(ADMIN_INITIAL_PASSWORD, PASSWORD_DEFAULT)]);

    $roomTypes = ['Premium Stay', 'Enhanced Comfort', 'Modern Comfort', 'Social Group Stay'];
    $typeStmt = db()->prepare('INSERT IGNORE INTO room_types (name) VALUES (?)');
    foreach ($roomTypes as $type) {
        $typeStmt->execute([$type]);
    }

    $rooms = [
        ['room-1','Premium Room','Premium Stay',5286,7049,'2 Guests','Double Bed','Premium Room',5,5,'https://checkinnhomes.com/wp-content/uploads/2026/03/premium.jpeg',['https://checkinnhomes.com/wp-content/uploads/2026/03/premium.jpeg','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01206-scaled.jpg','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01304-scaled.jpg'],['TV','Private Bathroom','Towels','Water','AC','Fan'],['Room Only (EP): ₹5,286','With Breakfast (CP): ₹5,699','With Meals (MAP): ₹6,374'],'Comfortable premium accommodation for two guests with modern essentials and a private bathroom.'],
        ['room-2','Super Deluxe Room','Enhanced Comfort',3486,4649,'2 Guests','Double Bed','Super Deluxe Room',5,5,'https://checkinnhomes.com/wp-content/uploads/2026/03/Super-Deluxe-room.jpeg',['https://checkinnhomes.com/wp-content/uploads/2026/03/Super-Deluxe-room.jpeg','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01298-scaled.jpg','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01286-scaled.jpg'],['TV','Private Bathroom','Towels & Toiletries','Water','Toilet Paper','Fan'],['Room Only (EP): ₹3,486','With Breakfast (CP): ₹3,899','With Meals (MAP): ₹4,574'],'Spacious elegance with enhanced comfort for a relaxing and premium stay.'],
        ['room-3','Deluxe Room','Modern Comfort',3899,5199,'2 Guests','Double Bed','Deluxe Room',5,5,'https://checkinnhomes.com/wp-content/uploads/2026/04/super-rooms12.png',['https://checkinnhomes.com/wp-content/uploads/2026/04/super-rooms12.png','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01284-scaled.jpg','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01275-scaled.jpg'],['TV','Private Bathroom','Towels','Water','Trash Can','Fan','AC'],['Room Only (EP): ₹3,899','With Breakfast (CP): ₹4,161','With Meals (MAP): ₹4,649'],'Luxury living with modern amenities for a refined and indulgent experience.'],
        ['room-4','Shared Dormitory Room','Social Group Stay',3486,null,'Up to 6 Guests','Shared Sleeping Space','Shared Dormitory',5,5,'https://checkinnhomes.com/wp-content/uploads/2026/04/Shared-Dormitory-Room-12.jpeg',['https://checkinnhomes.com/wp-content/uploads/2026/04/Shared-Dormitory-Room-12.jpeg','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01244-scaled.jpg','https://checkinnhomes.com/wp-content/uploads/2026/03/JKS01240-scaled.jpg'],['Shared Sleeping Space','Basic Essentials','Fan'],['Room Only (EP): ₹3,486'],'An affordable and social stay option, perfect for groups and solo travelers.']
    ];
    $roomStmt = db()->prepare('INSERT INTO rooms (id,name,type,price,original_price,capacity,bed,size,rating,reviews_count,image,gallery,amenities,meal_plans,description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),type=VALUES(type),price=VALUES(price),original_price=VALUES(original_price),capacity=VALUES(capacity),bed=VALUES(bed),size=VALUES(size),rating=VALUES(rating),reviews_count=VALUES(reviews_count),image=VALUES(image),gallery=VALUES(gallery),amenities=VALUES(amenities),meal_plans=VALUES(meal_plans),description=VALUES(description)');
    foreach ($rooms as $room) {
        $room[11] = json_encode($room[11], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $room[12] = json_encode($room[12], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $room[13] = json_encode($room[13], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $roomStmt->execute($room);
    }

    $bookingStmt = db()->prepare('INSERT IGNORE INTO bookings (id,guest_name,email,phone,room_name,check_in,check_out,guests,total_amount,status,payment_mode,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
    $bookingStmt->execute(['CIH-7821','Shreya Gore','vikram.m@gmail.com','+91 98765 43210','Premium Room','2025-04-10','2025-04-14',2,9996,'Confirmed','Pay at Stay','Early check-in around 11:00 AM requested']);
    $bookingStmt->execute(['CIH-7822','Sophie Turner','sophie.travels@yahoo.com','+44 7911 123456','Shared Dormitory Room','2025-04-12','2025-04-19',1,4193,'Confirmed','Direct Host Reservation','Needs bike rental on arrival']);

    $queryStmt = db()->prepare('INSERT IGNORE INTO queries (id,name,email,phone,subject,message,display_date,status) VALUES (?,?,?,?,?,?,?,?)');
    $queryStmt->execute(['qry-1','Pooja Verma','pooja.v@outlook.com','+91 91234 56789','Group Booking for 10 Yogis','Hi team, we are planning a 5-day retreat in May. Can we book the full floor with breakfast arrangements?','Yesterday at 4:30 PM','New']);

    $reviews = [
        ['rev-1','Gautam Ahuja','Google Review',5,'Check In Homes','Verified guest','We had an awesome stay. Rooms were very clean, staff were very helpful, and the food was awesome.','',1],
        ['rev-2','Pratik Singh','Google Review',5,'Check In Homes','Verified guest','Had a great stay experience.','',1],
        ['rev-3','New Indian Surgical','Google Review',5,'Check In Homes','Verified guest','A great place to stay in. A little inside the lane but totally worth it. The staff was nice, the manager was super professional, rooms were clean, food was homely, and they catered to everything you could ask for.','',1],
        ['rev-4','Kishan Dwivedi','Google Review',5,'Check In Homes','Verified guest','Service was good, food was great, rooms were clean, and the staff was humble. Overall, a good stay.','',1],
        ['rev-5','Srikar Namburi','Google Review',5,'Check In Homes','Verified guest','Mr Sharma ji, the manager, and the staff were really welcoming and sweet. A great place to stay.','',1]
    ];
    $reviewStmt = db()->prepare('INSERT IGNORE INTO reviews (id,name,city,rating,room,display_date,comment,avatar,approved) VALUES (?,?,?,?,?,?,?,?,?)');
    foreach ($reviews as $review) {
        $reviewStmt->execute($review);
    }

    $settings = [
        'name' => 'Checkinn Homes', 'tagline' => 'Your trusted stay partner in Rishikesh',
        'location' => 'Check inn homes, Secret Waterfall Rd, near Kundan Restaurant, Upper Tapovan, Rishikesh, Uttarakhand 249192',
        'phone' => '+91 82793 09665', 'email' => 'checkinnhomes@gmail.com', 'whatsapp' => '+918279309665',
        'checkInTime' => '12:00 PM', 'checkOutTime' => '11:00 AM', 'wifiSpeed' => '100 Mbps Fibre'
    ];
    $settingStmt = db()->prepare('INSERT INTO hotel_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value)');
    foreach ($settings as $key => $value) {
        $settingStmt->execute([$key, $value]);
    }

    json_response([
        'ok' => true,
        'message' => 'Database installed successfully. Delete api/install.php after confirming the site works.',
        'adminEmail' => ADMIN_EMAIL,
    ]);
} catch (Throwable $error) {
    json_response(['error' => APP_ENV === 'development' ? $error->getMessage() : 'Installation failed. Check database credentials and server logs.'], 500);
}
