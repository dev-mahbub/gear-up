# 🏋️ GearUp

> **Rent Sports & Outdoor Gear Instantly**

A backend REST API for a sports and outdoor equipment rental service. Customers browse and rent gear, providers manage inventory and fulfill orders, admins oversee the platform.

---

## 📌 Table of Contents

- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Payment Integration](#-payment-integration)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

| Category             | Technology                                          |
| -------------------- | --------------------------------------------------- |
| **Runtime**          | Node.js + TypeScript (ESM)                          |
| **Framework**        | Express 5                                           |
| **Database**         | PostgreSQL                                          |
| **ORM**              | Prisma 7 (driver adapter mode)                      |
| **Authentication**   | JWT (access + refresh tokens via HTTP-only cookies) |
| **Password Hashing** | bcryptjs                                            |
| **Payment Gateway**  | Stripe                                              |
| **Deployment**       | Vercel (Serverless Functions)                       |

### Installation

```bash
# Clone the repo
git clone https://github.com/dev-mahbub/gear-up.git
cd gear-up

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root (see [Environment Variables](#-environment-variables)).

### Database Migration

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client (also runs automatically on postinstall)
npx prisma generate
```

### Run the Server

```bash
# Development (hot reload via tsx)
npm run dev

# Production build & start
npm run build
npm start
```

The server runs at `http://localhost:5000`.

---

## 🔑 Environment Variables

Create a `.env` file with the following variables:

```env
# App
PORT=5000
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gearup

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEB_SECRETE=whsec_your_stripe_webhook_secret
```

> ⚠️ **Important:** Never commit the `.env` file. It is already in `.gitignore`.

---

## 🗄 Database Schema

The project uses a multi-file Prisma schema located in `prisma/schema/`. Key models:

| Model               | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| **User**            | Users with role (`ADMIN`, `CUSTOMER`, `PROVIDER`) and active status    |
| **Category**        | Gear categories (cycling, camping, fitness, water sports, etc.)        |
| **Gear**            | Sports/outdoor gear listings, linked to a Provider and Category        |
| **RentalOrder**     | Rental orders with dates, total amount, and status                     |
| **RentalOrderItem** | Individual gear items within an order (qty, price/day, days, subtotal) |
| **Payment**         | Payment transactions (Stripe), linked to a rental order                |
| **Review**          | Customer reviews for gear items (after rental return)                  |

### Order Status Flow

```
PLACED → CONFIRMED → PAID → PICKED_UP → RETURNED
  ↓
CANCELLED
```

### Payment Status

```
PENDING → COMPLETED | FAILED
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication

| Method  | Endpoint                  | Description                           | Auth        |
| ------- | ------------------------- | ------------------------------------- | ----------- |
| `POST`  | `/api/users/register`     | Register new user (customer/provider) | ❌ Public   |
| `POST`  | `/api/auth/login`         | Login, returns JWT via cookies        | ❌ Public   |
| `POST`  | `/api/auth/refresh-token` | Refresh access token                  | ❌ Public   |
| `GET`   | `/api/auth/me`            | Get current authenticated user        | ✅ Any role |
| `GET`   | `/api/users/me`           | Get own profile                       | ✅ Any role |
| `PATCH` | `/api/users/me`           | Update own profile                    | ✅ Any role |

**Register Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "CUSTOMER",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### Gear (Public)

| Method | Endpoint         | Description               | Auth      |
| ------ | ---------------- | ------------------------- | --------- |
| `GET`  | `/api/gears`     | Get all gear with filters | ❌ Public |
| `GET`  | `/api/gears/:id` | Get gear details          | ❌ Public |

**Query Parameters for `GET /api/gears`:**

- `category_id` — filter by category
- `brand` — filter by brand (case-insensitive)
- `minPrice` / `maxPrice` — price range
- `is_available` — `true` / `false`
- `search` — search by name or brand

### Gear (Provider)

| Method   | Endpoint         | Description                | Auth        |
| -------- | ---------------- | -------------------------- | ----------- |
| `POST`   | `/api/gears`     | Add gear to inventory      | 🔐 Provider |
| `PATCH`  | `/api/gears/:id` | Update gear listing        | 🔐 Provider |
| `DELETE` | `/api/gears/:id` | Remove gear from inventory | 🔐 Provider |

**Create Gear Body:**

```json
{
  "name": "Mountain Bike Pro",
  "brand": "Trek",
  "description": "Full suspension mountain bike",
  "rental_price_per_day": 25.0,
  "stock": 5,
  "is_available": true,
  "image": "https://example.com/bike.jpg",
  "category_id": "uuid-of-category"
}
```

### Categories

| Method   | Endpoint              | Description        | Auth      |
| -------- | --------------------- | ------------------ | --------- |
| `GET`    | `/api/categories`     | Get all categories | ❌ Public |
| `POST`   | `/api/categories`     | Create category    | 🔐 Admin  |
| `PATCH`  | `/api/categories/:id` | Update category    | 🔐 Admin  |
| `DELETE` | `/api/categories/:id` | Delete category    | 🔐 Admin  |

### Rental Orders

| Method  | Endpoint                                | Description                    | Auth        |
| ------- | --------------------------------------- | ------------------------------ | ----------- |
| `POST`  | `/api/rentalOrdres`                     | Create rental order            | 🔐 Customer |
| `GET`   | `/api/rentalOrdres`                     | Get customer's rental orders   | 🔐 Customer |
| `GET`   | `/api/rentalOrdres/:id`                 | Get rental order details       | 🔐 Customer |
| `GET`   | `/api/rentalOrdres/provider/all`        | Get provider's incoming orders | 🔐 Provider |
| `PATCH` | `/api/rentalOrdres/provider/:id/status` | Update order status            | 🔐 Provider |

**Create Rental Order Body:**

```json
{
  "startDate": "2025-08-01",
  "endDate": "2025-08-05",
  "items": [
    {
      "gear_item_id": "uuid-of-gear",
      "quantity": 2
    }
  ]
}
```

**Update Order Status Body:**

```json
{
  "status": "CONFIRMED"
}
```

### Payments

| Method | Endpoint                | Description                    | Auth                 |
| ------ | ----------------------- | ------------------------------ | -------------------- |
| `POST` | `/api/payments/create`  | Create Stripe checkout session | 🔐 Customer          |
| `GET`  | `/api/payments`         | Get payment history            | 🔐 Customer          |
| `GET`  | `/api/payments/:id`     | Get payment details            | 🔐 Customer          |
| `POST` | `/api/payments/webhook` | Stripe webhook handler         | ❌ Public (raw body) |

**Create Payment Body:**

```json
{
  "rentalOrderId": "uuid-of-rental-order"
}
```

### Reviews

| Method | Endpoint                    | Description                         | Auth        |
| ------ | --------------------------- | ----------------------------------- | ----------- |
| `POST` | `/api/reviews`              | Create review (after rental return) | 🔐 Customer |
| `GET`  | `/api/reviews/gear/:gearId` | Get reviews for a gear item         | ❌ Public   |

**Create Review Body:**

```json
{
  "gear_item_id": "uuid-of-gear",
  "rental_order_id": "uuid-of-rental-order",
  "rating": 5,
  "comment": "Great equipment, well maintained!"
}
```

### Admin

| Method  | Endpoint               | Description           | Auth     |
| ------- | ---------------------- | --------------------- | -------- |
| `GET`   | `/api/admin/users`     | Get all users         | 🔐 Admin |
| `PATCH` | `/api/admin/users/:id` | Suspend/activate user | 🔐 Admin |
| `GET`   | `/api/admin/gear`      | Get all gear listings | 🔐 Admin |
| `GET`   | `/api/admin/rentals`   | Get all rental orders | 🔐 Admin |

**Update User Status Body:**

```json
{
  "active_status": "BLOCKED"
}
```

---

## 🔐 Authentication

- Uses **JWT** with access and refresh tokens
- Tokens are stored in **HTTP-only cookies** (`accessToken`, `refreshToken`)
- Role-based access control via `auth(...roles)` middleware
- Three roles: `ADMIN`, `CUSTOMER`, `PROVIDER`
- Blocked users cannot access protected routes

### Auth Header Format

For API testing (e.g., Postman), use either:

```
Cookie: accessToken=<token>
```

or

```
Authorization: Bearer <token>
```

---

## 💳 Payment Integration

### Stripe

1. **Create Checkout Session** — `POST /api/payments/create` with a `rentalOrderId`
   - Order must be in `CONFIRMED` status
   - Returns a Stripe checkout URL
2. **Webhook** — Stripe sends `checkout.session.completed` to `POST /api/payments/webhook`
   - Updates payment status to `COMPLETED`
   - Updates order status to `PAID`

### Local Webhook Testing

```bash
# Install Stripe CLI, then:
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Or use the included script:

```bash
npm run stripe:webhook
```

---

## ☁️ Deployment (Vercel)

The project is configured for **Vercel Serverless Functions**:

- **Entry point:** `api/index.ts` (exports the Express app)
- **Rewrites:** All routes are rewritten to `/api/index` (see `vercel.json`)
- **Build:** `prisma generate && tsc`

### Deploy Steps

1. Push to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy

> 📝 **Note:** The local server (`src/server.ts`) only starts when `VERCEL` env var is **not** set. On Vercel, the Express app is served directly as a serverless function.

---

## 📂 Project Structure

```
gear-up/
├── api/
│   └── index.ts            # Vercel serverless entry
├── prisma/
│   ├── migrations/         # Database migrations
│   └── schema/             # Multi-file Prisma schema
│       ├── schema.prisma   # Generator + datasource
│       ├── enum.prisma     # Enums
│       ├── user.prisma     # User model
│       ├── category.prisma # Category model
│       ├── gear.prisma     # Gear model
│       ├── rentalOrder.prisma       # RentalOrder model
│       ├── rentalOrderItem.prisma   # RentalOrderItem model
│       ├── payment.prisma  # Payment model
│       └── review.prisma   # Review model
├── src/
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Local dev server
│   ├── config/             # Environment config
│   ├── lib/                # Prisma client, Stripe instance
│   ├── middleware/         # auth, error handlers
│   ├── modules/            # Feature modules
│   │   ├── auth/           # Login, refresh token, /me
│   │   ├── user/           # Registration, profile
│   │   ├── gear/           # Gear CRUD + filters
│   │   ├── category/       # Category CRUD
│   │   ├── rentalOrder/    # Rental orders + provider status
│   │   ├── payment/        # Stripe payments + webhook
│   │   ├── review/         # Reviews
│   │   └── admin/          # Admin endpoints
│   └── utils/              # JWT, sendResponse, catchAsync
├── package.json
├── tsconfig.json
├── vercel.json
└── .env                    # (not committed)
```

---

## 📜 Scripts

| Command                  | Description                                 |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Start dev server with hot reload            |
| `npm run build`          | Generate Prisma client + compile TypeScript |
| `npm start`              | Run compiled server                         |
| `npm run stripe:webhook` | Forward Stripe webhooks to localhost        |

---

## 📄 License

ISC
