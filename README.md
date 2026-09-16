# Checkinn Homes Application Guide

## Purpose

Checkinn Homes is a hotel website and staff management portal for the Upper Tapovan, Rishikesh property. Guests can explore rooms, select a pricing plan, make a direct booking, apply an eligible coupon, and submit contact messages or reviews. Staff manage the property through a protected admin dashboard.

**Live demo:** `https://demo.checkinnhomes.com/`

## Public Website

| Page | Clean URL | What visitors can do |
| --- | --- | --- |
| Home | `/` | View property overview, featured rooms, guest stories, and start a booking. |
| Rooms | `/rooms` | Compare rooms, amenities, gallery photos, meal plans, and prices. |
| About Us | `/aboutus` | Learn about the property and Upper Tapovan location. |
| Gallery | `/gallery` | Browse all media, images, or videos. |
| Guest Stories | `/feedback` | Read and submit guest feedback. |
| Contact | `/contact` | Send a booking or general enquiry to the staff team. |
| Staff Login | `/admin` | Login to the protected management portal. |

Legacy `.html` URLs redirect to the clean URLs. For example, `/rooms.html` redirects to `/rooms`.

## Guest Booking Flow

1. Select **Book** from the homepage, room page, or room detail modal.
2. Select the preferred room.
3. Select a pricing plan. Available plans are configured per room:
   - `Room Only (EP)`
   - `With Breakfast (CP)`
   - `With Meals (MAP)`
4. Select check-in date, check-out date, and guest count.
5. Enter guest name, email address, contact number, and WhatsApp number.
6. Select **Same as contact number** when the WhatsApp and contact number are identical.
7. Choose a payment preference:
   - **Cash on Check-in**
   - **Pay Online**
8. When Pay Online is selected, enter or select an eligible coupon code.
9. Optionally select rafting or scooty add-ons.
10. Confirm the booking.

### Booking Amount

The amount is calculated as:

$$
\text{Total} = (\text{selected pricing-plan rate} \times \text{nights}) + \text{add-ons} - \text{coupon discount}
$$

The final booking record stores the selected rate plan, WhatsApp number, coupon discount, payment preference, notes, dates, room, guest details, and amount.

### Coupons

Coupons are shown only for eligible **Pay Online** bookings. Each coupon has:

- Code
- Discount type: Percentage or Flat Amount
- Discount value
- Minimum booking amount
- Active or inactive state

A flat discount cannot reduce the total below zero.

## Staff Admin Portal

Open `/admin` and sign in with the configured staff account. When logged in, public website controls show **Dashboard** instead of **Login**.

### Dashboard

The dashboard summarizes bookings, room performance, guest queries, and operational items requiring attention.

### Bookings

Staff can:

- Search and filter bookings by status.
- Change status: Confirmed, Checked-In, Completed, or Cancelled.
- Edit guest name, email, phone, room, dates, guest count, amount, payment mode, status, and notes.
- Open a WhatsApp conversation with the guest.
- Export booking data as CSV.
- Delete a booking when necessary.

### Rooms and Room Types

Staff can:

- Add, edit, or delete room types.
- Add, edit, or delete rooms.
- Set room name, category, capacity, bed, room size, description, room-only price, original price, meal-plan prices, amenities, cover image, and image gallery.
- Upload JPG, PNG, or WEBP room images to `api/uploads/`.

The configured meal plans are displayed to guests during booking and directly determine their booking price.

### Guest Queries and Reviews

Staff can review website enquiries, mark them New or Resolved, open a WhatsApp reply, and delete obsolete entries. Reviews can be moderated or removed.

### Coupons

Staff can create, edit, activate, deactivate, or delete coupons.

Use **Percentage** for offers such as `10% off on Rs 3,000+`.

Use **Flat Amount** for offers such as `Rs 500 off on Rs 1,200+`.

Inactive coupons stay visible in the admin panel but do not appear in the public booking form.

### Property Settings

Staff can update shared property details:

- Property name, tagline, address, phone, WhatsApp, email, Wi-Fi, and check-in/check-out times.
- Property logo via URL or image upload.
- Email booking-confirmation subject and HTML template.
- WhatsApp booking-confirmation template.

When a logo is saved, the public navigation shows the logo alone. When no logo is saved, the `C` mark and property text are shown.

### Account Menu

Select the account initial/profile image in the admin header to:

- Edit display name.
- Add or change profile photo URL.
- Change password by confirming the current password.
- Logout.
- Deactivate the account.

Deactivation prevents future login until the database account is manually reactivated.

## SEO Management

The **SEO** menu contains separate settings for Home, Rooms, About Us, Gallery, Guest Stories, and Contact.

For every page, staff can manage:

- SEO title
- Meta description
- Focus keyword
- Canonical path
- Robots directive
- Open Graph image URL
- H1 guidance
- Content and internal-linking notes
- JSON-LD schema

SEO settings are rendered server-side in the HTML `<head>`, so title, meta description, canonical URL, robots, Open Graph data, and schema are available to crawlers without JavaScript rendering.

Use [SEO_COPY_PASTE_GUIDE.md](documents markdown/SEO_COPY_PASTE_GUIDE.md) for ready-to-paste, page-specific SEO content and JSON-LD examples.

### Search Discovery

- Robots: `https://demo.checkinnhomes.com/robots.txt`
- Sitemap: `https://demo.checkinnhomes.com/sitemap.xml`

Submit the sitemap to Google Search Console after verifying the production domain.

## Data and Integrations

| Area | Storage or service |
| --- | --- |
| Rooms and room types | MySQL |
| Guest bookings | MySQL |
| Guest contact messages | MySQL |
| Reviews | MySQL |
| Coupons | MySQL |
| Property settings and SEO records | MySQL |
| Uploaded room/logo images | `api/uploads/` |
| Admin sessions | PHP sessions with CSRF protection |
| Booking email confirmation | PHP `mail()` when Hostinger mail is configured |

### Payment and WhatsApp Notes

The application records **Cash on Check-in** and **Pay Online** preferences and calculates coupon discounts. It does not collect money automatically until a payment gateway such as Razorpay is connected with real server-side credentials and verification.

Automatic WhatsApp delivery requires an approved WhatsApp Business API provider such as Meta Cloud API, Interakt, or WATI. The editable WhatsApp template is ready for that integration, but no message is sent automatically until provider credentials are configured.

## Technical Structure

| Path | Responsibility |
| --- | --- |
| `page.php` | Server-rendered public page shell and SEO metadata. |
| `js/app.js` | React application source. |
| `js/app.bundle.js` | Browser-ready React bundle loaded by pages. |
| `api/index.php` | JSON API for bookings, rooms, settings, coupons, SEO, and authentication. |
| `api/upload.php` | Protected image uploader. |
| `api/common.php` | Database, session, CSRF, and response helpers. |
| `database/schema.sql` | MySQL tables and schema. |
| `.htaccess` | Clean URLs, redirects, and sitemap route. |
| `robots.txt` | Crawl instructions. |
| `sitemap.php` | XML sitemap output. |
| `HOSTINGER_DEPLOYMENT.md` | Deployment and migration instructions. |

## Deployment Checklist

1. Push the latest application changes to GitHub.
2. On Hostinger, enter the demo directory and pull the update:

```bash
cd ~/domains/checkinnhomes.com/public_html/demo
git pull origin main
```

3. Import the current `database/schema.sql` in phpMyAdmin to create missing tables. Existing data remains intact because tables use `CREATE TABLE IF NOT EXISTS`.
4. Run any one-time database migrations listed in [HOSTINGER_DEPLOYMENT.md](documents markdown/HOSTINGER_DEPLOYMENT.md) when updating an existing installation.
5. Confirm `api/uploads/` is writable with permission `755` or `775` if Hostinger requires it.
6. Hard refresh the website and admin panel after deployment.
7. Test one full booking, room update, coupon activation, and SEO save before announcing changes.

## Production Security Checklist

- Change the database password and update `api/config.php`.
- Change the initial admin password and installer key.
- Delete `api/install.php` after installation.
- Keep HTTPS enabled.
- Never store payment gateway secrets, WhatsApp API tokens, or mail passwords in frontend JavaScript.
- Restrict admin access to trusted staff.
- Add Privacy Policy and Terms pages before large-scale customer data collection or paid marketing.

## Visual Reference

The public homepage includes a top contact bar, Login/Dashboard action, property branding, navigation, booking action, and room discovery experience. The staff experience begins at `/admin` with a secure login screen and exposes management tools after successful authentication.

Live screenshots are intentionally not embedded because browser-session image links are temporary. Capture durable images into a repository `docs/` folder before adding them to this guide.
