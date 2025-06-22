# Assignment: Library Management API with Express, TypeScript & MongoDB

A robust RESTful API built with Node.js, Express, MongoDB (Mongoose), and TypeScript for managing books and borrowing operations in a library system.

## 🔧 Features
 ### 📖 Book Management

* Create, Read, Update, Delete books

* Validate genres (e.g., SCIENCE, FICTION)

* Handle availability and copy counts

### 📘 Borrow Book

* Borrow book if enough copies are available

* Deduct available copies

* Automatically set available = false when copies reach 0

### 📊 Borrow Summary

* Aggregated borrow reports with book title, ISBN, and total quantity

### ⚠️ Robust Validation

* Zod validation for input data

* Mongoose schema validation

* Middleware-based ObjectId checking

* Global error handler for cleaner responses

## 🧪 API Endpoints
### Books
* POST /api/books — Create a new book

* GET /api/books — Get all books (supports filter, sort, limit)

* GET /api/books/:bookId — Get book by ID

* PUT /api/books/:bookId — Update book

* DELETE /api/books/:bookId — Delete book

### Borrow
* POST /api/borrow — Borrow a book (with business logic)

* GET /api/borrow — Get borrowed book summary (aggregated)


## ⚙️ Technologies
* Node.js

* Express.js

* MongoDB & Mongoose

* TypeScript

* Zod

* Dotenv

* Mongoose Middleware

## 🏁 Getting Started

## Install
git clone (https://github.com/ShailySarker/Assignment3_PH_L2_B5)

cd Assignment3_PH_L2_B5

npm install

npm run dev


## Create a .env file:
env file

PORT=3000

MONGODB_URL=mongodb://localhost:27017/library_db
