# AmirNet Backend (API Server)

This is the **backend server** for the AmirNet exam simulation platform. It is built with **Node.js**, **Express.js**, and **MongoDB**, and includes user authentication, simulation data APIs, role-based access control, and secure email-based password resets.

---

## 📦 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication (Access & Refresh Tokens)
- Nodemailer (for password reset)
- dotenv (for environment management)
- CORS, cookie-parser

---

## ⚙️ Environment Variables

Create a `.env` file in the root of your project with the following keys:

```env
# Port the server runs on
PORT=5000

# MongoDB connection string (can be local or Atlas)
MONGO_CONNECTION_STRING=mongodb+srv://your_user:your_pass@cluster.mongodb.net/amirnet-db

# Secrets for JWT token signing
ACCESS_TOKEN_SECRET=your_long_random_access_token_secret
REFRESH_TOKEN_SECRET=your_long_random_refresh_token_secret
RESET_PASSWORD_SECRET=your_long_random_secret_for_reset_links

# Email credentials (used for sending reset password links)
EMAIL=youremail@example.com
EMAIL_PASSWORD=your_email_password_or_app_password
