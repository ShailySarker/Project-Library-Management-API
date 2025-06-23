# Assignment: Library Management API with Express, TypeScript & MongoDB

A robust RESTful API built with Node.js, Express, MongoDB (Mongoose), and TypeScript for managing books and borrowing operations in a library system.

## 🔧 Features

### 📖 Book Management

```md
* Create, Read, Update, Delete books

* Validate genres (e.g., SCIENCE, FICTION)

* Handle availability and copy counts
```

### 📘 Borrow Book

```md

* Borrow book if enough copies are available

* Deduct available copies

* Automatically set available = false when copies reach 0

```
### 📊 Borrow Summary

```md

* Aggregated borrow reports with book title, ISBN, and total quantity
```

### ⚠️ Robust Validation

```md

* Zod validation for input data

* Mongoose schema validation

* Middleware-based ObjectId checking

* Global error handler for cleaner responses

```
## 🧪 API Endpoints

### Books

```md
* POST /api/books — Create a new book

* GET /api/books — Get all books (supports filter, sort, limit)

* GET /api/books/:bookId — Get book by ID

* PUT /api/books/:bookId — Update book

* DELETE /api/books/:bookId — Delete book
```

### Borrow

```md
* POST /api/borrow — Borrow a book (with business logic)

* GET /api/borrow — Get borrowed book summary (aggregated)
```

## ⚙️ Technologies
```md
* Node.js

* Express.js

* MongoDB & Mongoose

* TypeScript

* Zod

* Dotenv

* Mongoose Middleware(PRE & POST)
```

## 📂 Folder Structure (Simplified)

```md
src/
├── app/
│   ├── controllers/
│   ├── models/
│   ├── interfaces/
│   └── zodSchemaValidations/
├── server.ts
└── app.ts
```

## 🏁 Getting Started

## Git Clone

```md
git clone (https://github.com/ShailySarker/Project-Library-Management-API)

cd Project-Library-Management-API
```

## Install

```md
npm install

npm run dev

```

## Create a .env file:

```md
env file

PORT=3000

MONGODB_URL=mongodb://localhost:27017/LibraryManagementDB
```