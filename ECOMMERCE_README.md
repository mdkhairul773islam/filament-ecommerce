# E-Commerce Platform for Books & Courses

A complete e-commerce platform built with Laravel, Filament Admin Panel, and Inertia.js + React for selling books and courses.

## Features

### Admin Panel (Filament)
- **Dashboard** with sales analytics, revenue tracking, and order statistics
- **User Management** - Manage platform users
- **Category Management** - Organize products by categories
- **Product Management** - Add and manage books and courses with:
  - Product type (Book/Course)
  - Pricing and discount pricing
  - Stock management
  - Featured products
  - Author information
  - Duration/pages
  - Multiple images support
- **Order Management** - View and manage all orders
- **Payment Tracking** - Monitor payment status for all orders

### Customer Frontend (Inertia + React)
- **Home Page** - Featured products and category browsing
- **Product Listing** - Filter by category and type (book/course)
- **Product Details** - Comprehensive product information
- **Shopping Cart** - Add, update, and remove items
- **Checkout** - Complete order with customer information
- **Order Tracking** - Track order and payment status
- **Payment Methods** - bKash, Rocket, Nagad, Cash on Delivery

## Technology Stack

- **Backend**: Laravel 11
- **Admin Panel**: Filament 4
- **Frontend**: Inertia.js + React
- **Styling**: Tailwind CSS 4
- **Database**: MySQL
- **Build Tool**: Vite

## Installation

1. **Clone the repository** (if applicable)

2. **Install PHP dependencies**:
   ```bash
   cd /home/khairul/Documents/Ebook/filament-app
   composer install
   ```

3. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

4. **Configure environment**:
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Generate application key:
     ```bash
     php artisan key:generate
     ```

5. **Run migrations and seed database**:
   ```bash
   php artisan migrate:fresh --seed
   ```
   
   This will create:
   - Admin user: `admin@example.com` / `password`
   - Test user: `test@example.com` / `password`
   - 4 categories with 5 products each (20 products total)

6. **Build frontend assets**:
   ```bash
   npm run build
   ```
   
   Or for development with hot reload:
   ```bash
   npm run dev
   ```

7. **Start the application**:
   ```bash
   php artisan serve
   ```

8. **Access the application**:
   - **Frontend**: http://localhost:8000
   - **Admin Panel**: http://localhost:8000/admin
     - Email: `admin@example.com`
     - Password: `password`

## Database Structure

### Tables
- **users** - User accounts
- **categories** - Product categories
- **products** - Books and courses
- **orders** - Customer orders
- **order_items** - Items in each order
- **payments** - Payment records
- **carts** - Shopping carts
- **cart_items** - Items in shopping cart

## Usage

### Admin Panel

1. **Access admin panel** at `/admin`
2. **Manage Categories**: Create and organize product categories
3. **Add Products**: 
   - Choose category
   - Select type (Book/Course)
   - Set pricing
   - Add images
   - Set stock quantity
4. **Monitor Orders**: View all orders with filtering options
5. **View Dashboard**: See sales statistics and analytics

### Customer Experience

1. **Browse products** on home page or products listing
2. **Filter products** by category or type
3. **View product details**
4. **Add to cart**
5. **Proceed to checkout**
6. **Enter shipping information**
7. **Select payment method** (bKash, Rocket, Nagad, Cash)
8. **Place order**
9. **Track order** using order number

## Payment Integration

The platform supports Bangladesh's popular payment methods:
- **bKash** - Mobile financial service
- **Rocket** - Mobile payment system
- **Nagad** - Mobile payment service  
- **Cash on Delivery**

Payment gateway integration is set up structurally. For production:
1. Register with payment providers (bKash, Rocket, Nagad)
2. Get API credentials
3. Implement webhook handlers for payment confirmation
4. Update payment status based on gateway responses

## Development

### Run development server:
```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server  
npm run dev
```

### Clear cache:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Run migrations:
```bash
php artisan migrate:fresh --seed
```

## File Structure

```
app/
├── Filament/
│   ├── Resources/      # Admin panel resources
│   └── Widgets/        # Dashboard widgets
├── Http/
│   └── Controllers/    # Frontend controllers
└── Models/             # Eloquent models

resources/
├── js/
│   ├── Layouts/        # React layout components
│   └── Pages/          # Inertia React pages
└── views/
    └── app.blade.php   # Inertia root template

database/
├── migrations/         # Database migrations
└── seeders/           # Database seeders
```

## Features in Detail

### Dashboard Analytics
- Total revenue (all time)
- Today's revenue
- Total orders count
- Pending orders count
- Completed orders count
- Active products count

### Product Features
- Auto-generated slugs
- Featured product marking
- Stock management
- Discount pricing
- Multiple image support
- Type-based categorization (Book/Course)

### Order Management
- Automatic order number generation
- Order status tracking (pending, processing, completed, cancelled, refunded)
- Payment status tracking
- Customer information storage

## Security Notes

- Change default admin password after first login
- Update `.env` with secure APP_KEY
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate all user inputs
- Sanitize file uploads

## Future Enhancements

- Email notifications for orders
- SMS notifications via BD gateways
- User reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Course progress tracking
- Digital product delivery
- Invoice generation
- Refund processing
- Multi-language support

## Support

For issues or questions, please create an issue in the repository.

## License

This project is proprietary software.