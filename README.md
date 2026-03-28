# Filament E-commerce Platform

A complete e-commerce platform built with Laravel 11, Filament 4, and React for selling books and courses with integrated payment methods.

## Features

### Frontend (Customer Portal)
- 📚 Browse books and courses by categories
- 🛒 Shopping cart with session/user support
- 💳 Multiple payment methods (bKash, Rocket, Nagad, Cash on Delivery)
- 📦 Order tracking and history
- 👤 Customer authentication and profile management
- 💰 Payment confirmation system

### Backend (Admin Panel)
- 📊 Dashboard with revenue and order statistics
- 👥 User management
- 📂 Category management with slug and images
- 📖 Product management (books and courses)
- 🛍️ Order management with status tracking
- 💵 Payment management with transaction details
- ⚙️ Dynamic payment method configuration

## Tech Stack

- **Backend**: Laravel 11
- **Admin Panel**: Filament 4
- **Frontend**: React 18 + Inertia.js
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Database**: MySQL

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mdkhairul773islam/filament-ecommerce.git
cd filament-ecommerce
```

2. Install dependencies:
```bash
composer install
npm install
```

3. Setup environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure database in `.env` and run migrations:
```bash
php artisan migrate --seed
```

5. Build frontend and start server:
```bash
npm run build
php artisan serve
```

## Default Credentials

**Admin**: admin@example.com / password  
**Customer**: test@example.com / password

## License

MIT License
