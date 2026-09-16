<?php
declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'u605122432_checkinnhomes';
const DB_USER = 'u605122432_checkinnhomes';
const DB_PASSWORD = 'Checkinnhomes@1234';

const ADMIN_EMAIL = 'admin@checkinnhomes.com';
const ADMIN_INITIAL_PASSWORD = 'CheckInn@2026';
const INSTALL_KEY = 'checkinn-install-2026';

const APP_ENV = 'production';
const SESSION_NAME = 'checkinn_admin';
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Razorpay test-mode credentials. Keep the Key Secret private on this server.
const RAZORPAY_KEY_ID = 'rzp_test_TWfmtduM73FYlO';
const RAZORPAY_KEY_SECRET = 'Ye2XcRi2feiP6Jh4MY8AunO6';

// n8n test webhook. Use the production /webhook/ URL after publishing the workflow.
const N8N_BOOKING_WEBHOOK_URL = 'https://n8n.shivatechdigital.com/webhook-test/checkinn-booking';
// Paste the same value configured in n8n Header Auth directly here. Never expose it in JavaScript.
const N8N_WEBHOOK_SECRET = 'Password!234';
