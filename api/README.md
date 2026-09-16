# Check In Homes API

All JSON routes use `api/index.php?resource=RESOURCE`.

## Public routes

- `GET ?resource=bootstrap`
- `GET ?resource=rooms`
- `GET ?resource=room-types`
- `GET ?resource=reviews`
- `GET ?resource=settings`
- `POST ?resource=bookings`
- `POST ?resource=queries`
- `POST ?resource=reviews`
- `POST ?resource=auth`

## Admin routes

Admin routes require the PHP session cookie and `X-CSRF-Token` returned by login.

- `GET/PUT/DELETE ?resource=bookings`
- `POST/PUT/DELETE ?resource=rooms`
- `POST/PUT/DELETE ?resource=room-types`
- `GET/PUT/DELETE ?resource=queries`
- `DELETE ?resource=reviews`
- `PUT ?resource=settings`
- `POST upload.php` with `images[]`
- `DELETE ?resource=auth`

See `../HOSTINGER_DEPLOYMENT.md` for upload and installation steps.
