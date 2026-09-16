# Hostinger Deployment

## Configured test environment

- Website: `https://demo.checkinnhomes.com/`
- API: `https://demo.checkinnhomes.com/api/`
- MySQL database: `u605122432_checkinnhomes`
- MySQL user: `u605122432_checkinnhomes`
- PHP requirement: PHP 8.1 or newer with PDO MySQL and Fileinfo enabled

## Upload

1. In Hostinger File Manager, open the document root for `demo.checkinnhomes.com`.
2. Upload **all project contents** into that directory, including hidden `.htaccess` files.
3. The final structure must include:

```text
admin.html
index.html
rooms.html
aboutus.html
contact.html
feedback.html
css/
js/
api/
  config.php
  common.php
  index.php
  install.php
  upload.php
  uploads/
database/
  schema.sql
```

4. Ensure `api/uploads/` is writable. Use permission `755`; use `775` only if Hostinger requires it.

## Install the database

After upload, open this URL once:

```text
https://demo.checkinnhomes.com/api/install.php?key=checkinn-install-2026
```

A successful response contains:

```json
{"ok":true,"message":"Database installed successfully..."}
```

Then delete `api/install.php` from Hostinger File Manager.

The installer creates and seeds:

- `admins`
- `rooms`
- `room_types`
- `bookings`
- `queries`
- `reviews`
- `hotel_settings`

## Admin login

```text
URL: https://demo.checkinnhomes.com/admin.html
Email: admin@checkinnhomes.com
Password: CheckInn@2026
```

The `file://` offline demo intentionally uses a different local-only password: `LocalDemo@2026`. It cannot authenticate against the deployed PHP API.

Change the admin password before production. To set a new initial password, edit `ADMIN_INITIAL_PASSWORD` in `api/config.php`, temporarily restore/run `install.php`, then delete `install.php` again.

## Production security checklist

Before moving from testing to production:

1. Change the MySQL password in Hostinger and `api/config.php`.
2. Change `ADMIN_INITIAL_PASSWORD`.
3. Change `INSTALL_KEY`.
4. Run the installer once, then delete `api/install.php`.
5. Keep `api/config.php` protected by the included `api/.htaccess`.
6. Keep HTTPS enabled.
7. Do not send database or admin passwords in chat, email, or frontend JavaScript.

## Database host

The package uses `localhost`, which is standard for a Hostinger database attached to the same website. If Hostinger shows a different MySQL hostname, update only this line in `api/config.php`:

```php
const DB_HOST = 'your-hostname';
```

## How data works

On `https://demo.checkinnhomes.com`, the frontend automatically uses MySQL through `/api/index.php`:

- Website bookings insert into `bookings`.
- Contact messages insert into `queries`.
- Guest feedback inserts into `reviews`.
- Admin room/type changes update `rooms` and `room_types`.
- Admin status changes update bookings and queries.
- Property settings update `hotel_settings`.
- Uploaded room photos are stored in `api/uploads/` and their URLs are saved in MySQL.

When HTML is opened directly with `file://`, the website intentionally falls back to localStorage for offline testing.

## Troubleshooting

- `Database request failed`: verify `DB_HOST`, database name, username, and password in `api/config.php`.
- `Authentication required`: log in again through `admin.html`.
- Upload failure: verify `api/uploads/` permissions and PHP Fileinfo support.
- Installer 403: verify the `key` URL value matches `INSTALL_KEY` in `api/config.php`.
- Blank API response: select PHP 8.1+ in Hostinger hPanel and check PHP error logs.
