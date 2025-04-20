# Admin Dashboard for Product Management

This application provides an admin dashboard to manage products using SQLite for data storage. The admin dashboard allows authenticated users to create, read, update, and delete products.

## Features

- Secure login with JWT authentication
- Product management (CRUD operations)
- Change admin password
- Responsive UI for all devices
- Dark/light mode support

## Default Credentials

- **Username:** admin
- **Password:** Azerbaycan123

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
npm install
# Run setup script to create necessary directories
npm run setup
```

3. Run the development server:

```bash
npm run dev
```

4. Access the admin dashboard:
   - Navigate to http://localhost:3000/admin
   - The database will be automatically initialized on the first API request

## Important Note on Database Initialization

The SQLite database will be initialized when:
- You first log in to the admin dashboard
- You access the products page
- You directly call the API endpoints

If you want to manually initialize the database, you can make a GET request to:
```
/api/init-db
```

## Project Structure

- `/pages` - Next.js pages including admin dashboard
- `/pages/api` - API endpoints for authentication and product management
- `/src/components` - React components
- `/src/lib` - Database utilities
- `/src/data` - Initial product data

## Database

The application uses SQLite for data storage. The database file `data.db` will be created automatically when the application starts.

## API Endpoints

- `/api/auth` - Authentication endpoint
- `/api/products` - Product management endpoint (CRUD)
- `/api/user` - User management endpoint (change password)
- `/api/init-db` - Database initialization endpoint

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

Or, to use the custom server:

```bash
npm run serve
``` 