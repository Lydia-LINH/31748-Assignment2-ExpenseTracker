# Personal Expense Tracker

> UTS Master of Information Technology — Assessment 2  
> Full-stack personal finance web application with authentication, transaction management, account-based filtering, admin monitoring, and MongoDB data persistence.

---

## 1. Project Overview

**Personal Expense Tracker** is a full-stack web application designed to help users record, organise, and review their personal income and expenses.

The system allows users to:

- register and log in securely;
- create and manage financial accounts, such as cash, savings, or credit card accounts;
- add, edit, delete, and categorise transactions;
- filter financial records by account, category, date, and transaction type;
- view dashboard summaries of income, expenses, balances, and recent activity;
- manage budgets and categories;
- customise interface colour themes;
- protect private user data through JSON Web Token authentication;
- support an admin role for system-level monitoring.

The main purpose of this software is to provide a structured personal finance tracker while demonstrating practical full-stack application design, authentication, database modelling, and API integration.

---

## 2. Problem Statement

Many simple expense trackers store all transactions in one flat list. This becomes difficult to manage when a user has multiple payment sources, such as cash, savings, and credit cards. It can also create data integrity problems when account-related records are deleted incorrectly.

This project addresses these issues through:

1. **Multi-account transaction management**  
   Transactions are linked to specific accounts so users can separate financial activity by account.

2. **Clear financial summaries**  
   The dashboard updates totals, balances, and recent transactions based on the selected account and available transaction data.

3. **Database relationship handling in MongoDB**  
   Because MongoDB does not enforce foreign keys in the same way as relational databases, the backend includes logic to remove or update related transaction records when an account is deleted.

4. **Secure multi-user access**  
   Authentication and role-based access control prevent normal users from accessing another user's private financial data or admin-only endpoints.

---

## 3. Key Features

### User Authentication

- User registration and login
- Password hashing with `bcryptjs`
- JWT-based authentication
- Protected private API routes
- Role-based access control for admin routes

### Account Management

- Create financial accounts
- View account-specific balances
- Update account details
- Delete accounts with related transaction cleanup

### Transaction Management

- Add income or expense records
- Edit existing transactions
- Delete transactions
- Assign transactions to accounts and categories
- Filter transactions by account, category, type, and date

### Dashboard

- Total income summary
- Total expense summary
- Balance calculation
- Recent transaction display
- Account-based dashboard view

### Theme Customisation

- Switch between predefined application themes
- Create and customise interface colour themes
- Dynamically update dashboard and component styling

### Category and Budget Support

- Built-in and custom categories
- Category management
- Budget setting and tracking

### Admin Functions

- Admin dashboard for system-level data review
- Admin-only access checks
- User and transaction monitoring routes
- Activity logging for important operations

---

## 4. Technical Implementation Overview

| Assignment Requirement | How It Is Addressed in This Project |
|---|---|
| Full-stack web application | Uses a React/Vite frontend and Node.js/Express backend |
| Database integration | Uses MongoDB with Mongoose schemas |
| CRUD functionality | Supports CRUD operations for users, accounts, transactions, categories, and budgets |
| User authentication | Implements login and registration with hashed passwords and JWT tokens |
| Authorisation | Uses role-based access control to separate normal users from admin users |
| State management | Uses React state, custom hooks, and filtered data views |
| API design | Backend exposes RESTful endpoints for frontend communication |
| Data validation and integrity | Uses Mongoose schemas and account-transaction cleanup logic |
| Security consideration | Protects private routes and admin routes with middleware |
| Individual contribution documentation | Includes a solo project declaration and file ownership table |
| Local deployment instructions | Provides clear frontend and backend setup steps |

---

## 5. Technical Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React Icons
- date-fns

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)

### Development Tools

- Vite
- npm
- PostCSS

---

## 6. System Architecture

```text
[React Frontend]
       |
       | HTTP requests with JWT Bearer Token
       v
[Express Backend API]
       |
       | Authentication and role-check middleware
       v
[MongoDB Database via Mongoose]
```

The frontend is responsible for user interaction, form handling, dashboard rendering, theme customisation, and client-side filtering.

The backend is responsible for authentication, route protection, business logic, database operations, and admin-only access control.

MongoDB stores users, accounts, transactions, categories, and activity logs.

---

## 7. Database Models

### Users

Stores user account information and authentication data.

Main responsibilities:

- username and email storage
- hashed password storage
- role field for normal user or admin access
- authentication identity used by JWT

### Accounts

Stores financial account information.

Main responsibilities:

- account name
- linked user ID
- balance or budget-related values
- relationship with transaction records

### Transactions

Stores income and expense entries.

Main responsibilities:

- transaction amount
- transaction type
- category
- date
- description
- linked account ID
- linked user ID

### Categories

Stores default and custom transaction categories.

Main responsibilities:

- category name
- category icon
- category colour
- user-defined category support

### ActivityLogs

Stores important system operations for audit purposes.

Main responsibilities:

- operation type
- user information
- timestamp
- affected data record

---

## 8. Project Structure

```text
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── dialogs/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── Homepage.tsx
│   │   │   ├── NetworkError.tsx
│   │   │   └── StartPage.tsx
│   │   └── App.tsx
│   ├── constants/
│   │   └── data.ts
│   ├── hooks/
│   │   ├── useCategories.ts
│   │   └── useTransactions.ts
│   ├── styles/
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── vite.config.ts
```

---

## 9. Local Development

### Requirements

- Node.js
- npm
- MongoDB Community Server or MongoDB Atlas

### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=your_jwt_secret
```

Install dependencies and start the backend server:

```bash
cd server
npm install
npm start
```

The backend API runs on:

```text
http://localhost:5000
```

### Frontend

Open a new terminal in the project root folder, then install dependencies and start the frontend development server:

```bash
npm install
npm run dev
```

The frontend application runs on:

```text
http://localhost:5173
```

---

## 10. Application Usage

After launching the application, users can:

- register and log into a secure account;
- manage personal financial accounts and budgets;
- create, edit, and delete income or expense transactions;
- organise transactions using custom categories;
- filter and review transaction history by account, category, date, or transaction type;
- view dashboard summaries and monthly financial insights;
- customise interface colour themes;
- access role-protected admin features using an administrator account;
- manage users and monitor system-wide transaction activity from the admin dashboard.

---

## 11. API Overview

The main route groups are:

```text
/api/auth          user registration and login
/api/accounts      account CRUD operations
/api/transactions  transaction CRUD operations
/api/categories    category management
/api/admin         admin-only monitoring routes
```

Protected routes require a JWT token in the request header:

```text
Authorization: Bearer <token>
```

Admin routes additionally require the authenticated user to have an admin role.

---

## 12. Security Design

This project includes several security-focused design choices.

### Password Protection

Plain-text passwords are not stored. Passwords are hashed with `bcryptjs` before being saved to the database.

### JWT Authentication

After login, the backend signs a JWT token. The frontend sends this token with requests to protected API routes.

### Route Protection

Private endpoints use authentication middleware to verify the token before allowing database access.

### Role-Based Access Control

Admin-only endpoints check the user's role before returning system-wide data.

### Data Ownership Checks

Normal users can only read or modify records that belong to their own user ID.

### Cascade Delete Logic

When an account is deleted, related transactions are also removed or handled to avoid orphaned transaction records.

---

## 13. State Management Design

The frontend uses React state and custom hooks to separate interface logic from data operations.

- `useState` is used for UI state such as dialogs, sidebars, and selected views.
- Custom hooks are used to manage transaction and category data.
- Theme state management is used to dynamically update application colours and UI appearance.
- Filtered views allow the dashboard and transaction list to update when the selected account or filter changes.
- This keeps UI components easier to read and reduces duplicated fetch or filtering logic.

---

## 14. Individual Contribution Statement

This project was completed as a solo project.

| Role | Name | Student ID | Contribution |
|---|---|---|---|
| Sole Developer | Hang Lin | 14745260 | 100% |

The sole developer was responsible for:

- frontend component development;
- backend API implementation;
- database schema design;
- authentication and authorisation logic;
- state management;
- UI styling;
- testing and debugging;
- documentation.

---

## 15. File Ownership

| Area | File / Folder | Responsibility |
|---|---|---|
| Database Models | `server/models/User.js` | User schema and authentication data |
| Database Models | `server/models/Account.js` | Account schema and account data structure |
| Database Models | `server/models/Transaction.js` | Transaction schema and financial records |
| Database Models | `server/models/ActivityLogs.js` | Activity and audit log schema |
| Backend Routes | `server/routes/authRoutes.js` | User registration and login APIs |
| Backend Routes | `server/routes/transactionRoutes.js` | Transaction CRUD APIs |
| Backend Routes | `server/routes/accountRoutes.js` | Account and budget management APIs |
| Backend Routes | `server/routes/categoryRoutes.js` | Category management APIs |
| Backend Routes | `server/routes/adminRoutes.js` | Admin dashboard and user management APIs |
| Backend Middleware | `server/middleware/auth.js` | JWT authentication and role-based access control |
| Backend Configuration | `server/config/db.js` | MongoDB connection configuration |
| Backend Entry | `server/index.js` | Express server initialisation and route registration |
| Frontend Routing | `src/app/App.tsx` | Main application routing and global state management |
| Dashboard | `src/app/pages/Homepage.tsx` | Main user dashboard |
| Admin | `src/app/pages/AdminDashboard.tsx` | Admin dashboard |
| Components | `src/app/components/` | Reusable UI components |
| Dialogs | `src/app/dialogs/` | Modal windows and forms |
| Styles | `src/styles/` | Global styles and Tailwind-related styling |

> This project was completed individually. All files and features were implemented by the same author.

---

## 16. Conclusion

This project demonstrates a modular full-stack personal expense tracking application with secure authentication, database persistence, role-based access control, and maintainable frontend-backend integration. The system combines React, Express, MongoDB, and JWT authentication to provide a structured and secure financial management platform while demonstrating practical software engineering design principles.
