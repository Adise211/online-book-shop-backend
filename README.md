# 📚 Online Book Shop API

An online book shop backend where users can search for books and save them to their favorites.

> ❗ **Note:** Purchasing books is **not supported**.  
> This app is for **educational and practice purposes only**.

## 🚀 Features

- 🔍 Search for books
- ❤️ Save favorite books
- 🛡️ Secure authentication with JWT
- 🔐 Passwords hashed with bcrypt
- 🧱 Data persisted with Prisma ORM

## 🛠️ Tech Stack

- **TypeScript** – Strong typing and modern JavaScript features
- **Nodemon** – Auto-restarting server during development
- **Prisma** – Type-safe and intuitive ORM
- **bcrypt** – Secure password hashing
- **JWT (JSON Web Token)** – Authentication and session handling

## 📦 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install Dependencies

`$ npm install`

### 3. Set Up Environment Variables

Create a .env file in the root directory and add the following:

```bash
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

> Replace your_database_url with your actual database connection string (e.g., PostgreSQL or MySQL).<br/>
> Replace your_jwt_secret with a secure secret key for JWT.
> Ask me for the url and secret if you need mine.<br/>

### 4. Run Prisma Migrations

`$ npx prisma migrate dev --name init`

### 5. Start the Development Server

`$ npm start`

Your server will start on the configured port (http://localhost:3030).

## 📝 License

This project is open source and available under the MIT License.
