# Bike CRM - Full Stack Application

A comprehensive Customer Relationship Management system for bike dealerships, built with Angular frontend and Node.js/Express backend with MongoDB Atlas database.

## 🚀 Features

- **Customer Management**: Create, read, update, and delete customer records
- **Bike Inventory**: Manage bike catalog and inventory
- **Sales Tracking**: Track sales and quotations
- **Service Management**: Manage bike servicing and repairs
- **Staff Management**: Handle staff and user roles
- **Cloud Database**: MongoDB Atlas integration for data persistence

## 🏗️ Tech Stack

**Frontend:**

- Angular 21.1.4
- TypeScript
- SCSS

**Backend:**

- Node.js
- Express.js
- Mongoose ODM
- MongoDB Atlas

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB Atlas account
- Angular CLI

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd bikecrm
```

### 2. Install Dependencies

**Frontend:**

```bash
npm install
```

**Backend:**

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend` folder:

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
MONGO_URI_LOCAL=mongodb://127.0.0.1:27017/bikecrm_local
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

**⚠️ Important:** Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas connection string.

### 4. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your IP to Network Access
4. Create a database user
5. Get your connection string and add it to `.env`

## 🚦 Running the Application

### Development Mode

**Start Backend Server:**

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3000`

**Start Frontend (in another terminal):**

```bash
ng serve
```

Application runs on `http://localhost:4200`

## 📡 API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Other Endpoints

- `GET /api/test` - Test API connectivity
- `GET /api/db-info` - Database connection info

## 🧪 Testing with Postman

Import the collection and test endpoints:

```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "city": "Mumbai",
  "notes": "Test customer"
}
```

## 🌍 Deployment

The application is configured for deployment on:

- **Frontend**: Vercel/Netlify
- **Backend**: Render/Railway
- **Database**: MongoDB Atlas (Production)

## 📁 Project Structure

```
bikecrm/
├── src/                    # Angular frontend
├── backend/               # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.js        # Server entry point
├── .env.example         # Environment template
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email [your-email] or create an issue in this repository.

````

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
````

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
