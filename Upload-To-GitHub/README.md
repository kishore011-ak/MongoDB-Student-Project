# Setting Up MongoDB for a Web Application Using AWS Cloud Services
## Student Management System (College Capstone Project)

[![Node.js Version](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![Backend Framework](https://img.shields.io/badge/Backend-Express.js%204.x-blue.svg)](https://expressjs.com/)
[![Cloud Deployment](https://img.shields.io/badge/Deployment-AWS%20EC2%20Ready-orange.svg)](https://aws.amazon.com/ec2/)

---

## 1. Abstract
The **Student Management System** is a cloud-connected web application engineered to demonstrate modern full-stack application development, database management with **MongoDB Atlas**, and cloud hosting concepts with **Amazon Web Services (AWS)**. By coupling a native HTML5/CSS3/JavaScript administrative dashboard with an asynchronous Node.js and Express RESTful API, the system manages academic student records, performs real-time queries and aggregations, and strictly complies with modern security protocols. This project fulfills academic capstone requirements by establishing a robust, non-relational database connection to the cloud and illustrating a complete production deployment workflow.

---

## 2. Introduction
In conventional educational environments, academic records are frequently siloed across spreadsheets or legacy on-premise systems that lack accessibility, scalability, and automated integrity validation. Cloud computing offers high availability and elasticity. This project demonstrates how an enterprise-grade document database—**MongoDB Atlas**—can be integrated into a web architecture, providing schema validation through Mongoose ODM, while decoupling backend services for containerized or virtual machine hosting via **AWS EC2**.

---

## 3. Problem Statement & Objectives

### Problem Statement
Traditional student records management faces:
1. Vulnerability to data inconsistency, missing required attributes, and duplicate records.
2. High latency or single points of failure in on-premise database servers.
3. Rigid relational schemas that make expanding student metadata difficult without database migrations.

### Project Objectives
- **MongoDB Cloud Integration:** Establish secure, authenticated connectivity to MongoDB Atlas using Mongoose ODM.
- **Full CRUD Capabilities:** Implement Create, Read, Update, and Delete operations for student records.
- **Server-Side Validation:** Enforce uniqueness, regular expression checks, and bounds validations.
- **Cloud Analytics:** Compute real-time department statistics and cohort distributions using MongoDB Aggregation Pipelines.
- **Production-Ready Cloud Architecture:** Provide step-by-step guidance for hosting the web tier on AWS EC2 while maintaining MongoDB Atlas as the primary database.

---

## 4. System Architecture

The application adopts a **3-Tier Cloud Architecture** separating presentation, business logic, and cloud data persistence.

```mermaid
flowchart TD
    subgraph ClientTier ["🖥️ Client Tier (Presentation)"]
        User["Academic Administrator / User"]
        Browser["Modern Web Browser\n(HTML5 / CSS3 / Vanilla JS)"]
        User -->|Interacts with UI| Browser
    end

    subgraph ApplicationTier ["⚙️ Application Tier (Backend - Local / AWS EC2)"]
        WebServer["Express.js HTTP Server\n(Port 5000)"]
        Router["Express Routers\n(/api/students, /api/stats, /api/health)"]
        Controllers["Controllers & Business Logic\n(CRUD, Pagination, Aggregation)"]
        MongooseODM["Mongoose ODM\n(Schema Validation & Query Builder)"]

        Browser -->|REST API Calls (JSON)| WebServer
        WebServer --> Router
        Router --> Controllers
        Controllers --> MongooseODM
    end

    subgraph DatabaseTier ["🍃 Database Tier (Cloud Database)"]
        AtlasCluster["MongoDB Atlas Cloud Database Cluster\n(Cluster M0 / Serverless)"]
        Database["student_management_db"]
        Collection["Collection: students"]

        MongooseODM -->|TLS/SSL Encrypted MONGODB_URI| AtlasCluster
        AtlasCluster --> Database
        Database --> Collection
    end

    classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef app fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    classDef db fill:#dcfce7,stroke:#16a34a,stroke-width:2px;

    class Browser,User client;
    class WebServer,Router,Controllers,MongooseODM app;
    class AtlasCluster,Database,Collection db;
```

> **Architecture Note:** The backend can run on a developer workstation or an **AWS EC2 Virtual Machine**. Under all circumstances, **MongoDB Atlas** remains the independent cloud database tier.

---

## 5. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Modern, responsive dashboard, client validation, dynamic DOM rendering |
| **Styling** | Vanilla CSS3 Design System | Tailored color tokens, responsive grid/flexbox, glassmorphic modals |
| **Backend Runtime** | Node.js (v24.x) | High-performance asynchronous JavaScript server runtime |
| **Web Framework** | Express.js (v4.21.x) | REST API routing, centralized error handling, static asset serving |
| **Database ODM** | Mongoose (v8.9.x) | Object Data Modeling, schema validation, index enforcement |
| **Cloud Database** | MongoDB Atlas | Managed cloud NoSQL database, automated backups, global clusters |
| **Cloud Hosting** | AWS EC2 (Optional) | Elastic Compute Cloud virtual machine for production hosting |

---

## 6. MongoDB Database Design

### Databases, Collections, Documents & Schemas
- **Database (`student_management_db`):** The logical container in MongoDB Atlas holding collections and security privileges.
- **Collection (`students`):** Analogous to a table in relational databases, but storing schema-flexible documents without requiring table alterations.
- **Document:** A JSON-like record encoded in **BSON (Binary JSON)** representing an individual student.
- **Schema & Indexes:** Defined in Mongoose to enforce data integrity, type correctness, and unique constraints at the application layer.

### Student Schema Definition
| Field Name | BSON Type | Validation Rules | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated by MongoDB | Primary key unique document identifier |
| `studentId` | String | Required, Unique, Trimmed, Uppercase | College identification code (e.g., `STU1001`) |
| `fullName` | String | Required, Trimmed, Min: 2, Max: 100 | Legal name of student |
| `email` | String | Required, Unique, Lowercase, Regex | Academic or personal email address |
| `phone` | String | Required, Trimmed, Regex | Contact telephone number |
| `department` | String | Required, Enum list | Academic engineering/arts department |
| `course` | String | Required, Trimmed | Degree program (e.g., `B.Tech Computer Science`) |
| `yearOfStudy` | Number | Required, Min: 1, Max: 5 | Academic level/cohort |
| `admissionDate`| Date | Required, Default: `Date.now` | Enrollment admission date |
| `createdAt` | Date | Auto-managed by Mongoose | Timestamp of creation |
| `updatedAt` | Date | Auto-managed by Mongoose | Timestamp of latest modification |

### Indexing Strategy
1. **`{ studentId: 1 }` (Unique Index):** Guarantees constant-time $O(1)$ lookups and prevents duplicate enrollment numbers.
2. **`{ email: 1 }` (Unique Index):** Prevents duplicate email registrations across accounts.
3. **`{ department: 1, yearOfStudy: 1 }` (Compound Index):** Optimizes combined filtering queries across department and academic cohort.
4. **`{ fullName: "text", studentId: "text" }` (Text Index):** Accelerates full-text substring queries across the search bar.

---

## 7. Project Folder Structure

```
MongoDB-Student-Project/
├── .env.example              # Environment variable template with placeholders
├── .gitignore                 # Prevents committing .env, node_modules, and logs
├── package.json               # Root proxy scripts (npm start, npm run dev, npm test)
├── README.md                  # Comprehensive project technical documentation
├── PROJECT_REPORT.md          # College-format academic submission report
├── client/                    # Frontend presentation tier
│   ├── index.html             # Single-page admin dashboard layout
│   ├── css/
│   │   └── style.css          # Custom responsive CSS design system
│   └── js/
│       ├── api.js             # Client API service communication layer
│       └── app.js             # UI state controller, modal handling, and table rendering
└── server/                    # Backend application tier
    ├── package.json           # Backend dependency manifest and scripts
    ├── test/
    │   └── test-runner.js     # Automated test suite (schema, security, API tests)
    └── src/
        ├── server.js          # Entry point, environment loading, port listener
        ├── app.js             # Express app setup, CORS, JSON parser, static routes
        ├── seed.js            # Sample student database population script
        ├── config/
        │   └── database.js    # Mongoose connection manager & credential masking
        ├── models/
        │   └── Student.js     # Mongoose schema, validation rules, and indexes
        ├── controllers/
        │   ├── studentController.js  # CRUD controller logic
        │   └── statsController.js    # Aggregation & metrics controller
        ├── routes/
        │   ├── studentRoutes.js      # Routes for /api/students
        │   ├── statsRoutes.js        # Routes for /api/stats
        │   └── healthRoutes.js       # Routes for /api/health
        └── middleware/
            ├── errorHandler.js       # Centralized error handler (E11000, CastError)
            └── notFound.js           # 404 handler for unknown routes
```

---

## 8. REST API Specification

### Base URL: `http://localhost:5000/api`

| Endpoint | Method | Description | Success Code | Sample Request / Query |
| :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | Health check & MongoDB Atlas status | `200` / `503` | None |
| `/stats` | `GET` | Aggregated student & department stats | `200` | None |
| `/students` | `GET` | Retrieve paginated and filtered students | `200` | `?page=1&limit=10&department=IT` |
| `/students/:id` | `GET` | Retrieve single student by `_id` or `studentId` | `200` | Path parameter |
| `/students` | `POST` | Create a new student document | `201` | JSON payload in body |
| `/students/:id` | `PUT` | Update student details | `200` | JSON payload in body |
| `/students/:id` | `DELETE` | Permanently remove student document | `200` | Path parameter |

#### Sample Response: `GET /api/health`
```json
{
  "status": "UP",
  "timestamp": "2026-10-12T15:00:00.000Z",
  "uptime": 124.5,
  "environment": "development",
  "database": {
    "provider": "MongoDB Atlas",
    "status": "Connected",
    "connected": true,
    "databaseName": "student_management_db",
    "maskedHost": "cluster0...mongodb.net"
  },
  "system": {
    "nodeVersion": "v24.21.0",
    "memoryUsageMB": 42
  }
}
```

---

## 9. Step-by-Step MongoDB Atlas Setup Guide

Follow this guide to obtain your free MongoDB Atlas cloud database:

### Step 1: Create an Account
1. Navigate to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Sign up for a free account or log in with your credentials.

### Step 2: Create a Free Cluster
1. In the MongoDB Atlas dashboard, click **Create**.
2. Select the **M0 Free Tier** (free forever, 512 MB storage, ideal for college projects).
3. Choose a cloud provider (e.g., AWS) and region closest to your location (e.g., `AWS / us-east-1` or `AWS / ap-south-1`).
4. Name your cluster (e.g., `Cluster0`) and click **Create Deployment**.

### Step 3: Create a Dedicated Database User
1. Under **Security** in the left sidebar, click **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** authentication:
   - **Username:** `student_admin`
   - **Password:** Generate or create a secure password (e.g., `CollegePass2026!`). Note this down safely.
4. Under **Database User Privileges**, select **Read and write to any database** (least privilege principle).
5. Click **Add User**.

### Step 4: Configure Network Access (IP Whitelist)
1. Under **Security**, click **Network Access**.
2. Click **Add IP Address**.
3. For local development:
   - Click **Add Current IP Address** to permit your current machine, OR
   - For temporary testing during project demos: Select **Allow Access From Anywhere** (`0.0.0.0/0`) with a short expiration timer.
4. Click **Confirm**.

### Step 5: Obtain the Connection String
1. Return to **Database Deployments** and click the **Connect** button on your cluster.
2. Select **Drivers** (Node.js).
3. Copy the SRV connection string:
   ```
   mongodb+srv://student_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
4. Insert your database name `student_management_db` before the query parameter `?`:
   ```
   mongodb+srv://student_admin:CollegePass2026!@cluster0.abcde.mongodb.net/student_management_db?retryWrites=true&w=majority
   ```

---

## 10. Local Development Setup & Execution

### Prerequisites
- **Node.js** (v18.x or v20.x or v24.x)
- **npm** (v9.x+)

Check your versions:
```bash
node -v
npm -v
```

### Setup Instructions (macOS Terminal)

```bash
# 1. Open the project root directory
cd /Users/gobika/Desktop/MongoDB-Student-Project

# 2. Install dependencies
npm install

# 3. Create your local .env configuration from the template
cp .env.example .env

# 4. Open .env in your text editor and add your real Atlas connection string:
# MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/student_management_db?retryWrites=true&w=majority

# 5. Run automated verification tests
npm test

# 6. (Optional) Populate the Atlas database with realistic sample student data
npm run seed

# 7. Start the application
npm start
```

### Accessing the Web Application
Open your browser and navigate to:
```
http://localhost:5000
```
- The dashboard automatically syncs with your live **MongoDB Atlas** cluster.
- The status pill in the top header displays **Atlas Connected (student_management_db)**.

---

## 11. Testing and Verification Plan

Run the built-in automated verification script anytime:
```bash
npm test
```

### Manual Verification Checklist for College Viva
1. **Health Verification:** Open `http://localhost:5000/api/health` in your browser. Confirm that `database.connected` is `true`.
2. **Add Student (Create):** Click **+ Add Student**, enter complete details, and submit. Verify that a success toast appears and the table updates.
3. **Duplicate Prevention:** Try submitting another student with the same `studentId` or `email`. Confirm that HTTP 409 Conflict error is returned with a clear warning.
4. **Search Operation:** Type the student's name into the search bar. Observe instantaneous debounced table filtering.
5. **Department & Year Filtering:** Select a department dropdown item. Confirm table updates via database query.
6. **Update Student (Edit):** Click the ✏️ icon on any student row, modify their contact number or course, and click **Update MongoDB Record**.
7. **Delete Student (Delete):** Click the 🗑️ icon. Confirm that the confirmation modal displays the student name. After confirming, verify deletion from the database.
8. **Atlas Web Console Verification:** Log in to [cloud.mongodb.com](https://cloud.mongodb.com), go to **Browse Collections**, and inspect the `students` collection to observe your created documents in real time.

---

## 12. AWS EC2 Cloud Deployment Guide

This section explains how to deploy the web application tier onto an **Amazon EC2** Linux virtual machine while retaining **MongoDB Atlas** as the cloud database.

### Step 1: Launch an AWS EC2 Instance
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **EC2** and click **Launch Instance**.
3. **Name:** `Student-Management-WebServer`
4. **AMI (Amazon Machine Image):** Select **Ubuntu Server 24.04 LTS (HVM)** (Free tier eligible).
5. **Instance Type:** `t2.micro` (or `t3.micro`).
6. **Key Pair:** Create a new key pair (e.g., `student-project-key.pem`) and download it securely.

### Step 2: Configure AWS Security Group (Firewall)
In the Network settings, configure inbound security group rules:
- **SSH (Port 22):** Source: `My IP` (Restricts terminal access to your machine).
- **HTTP (Port 80):** Source: `Anywhere (0.0.0.0/0)` (Allows web visitors).
- **Custom TCP (Port 5000):** Source: `Anywhere (0.0.0.0/0)` (Express server port).
- **HTTPS (Port 443):** Source: `Anywhere (0.0.0.0/0)` (For SSL/TLS).

### Step 3: Connect to EC2 via SSH
```bash
chmod 400 student-project-key.pem
ssh -i "student-project-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 4: Install Node.js & Git on the EC2 Server
```bash
# Update Ubuntu package lists
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Verify installation
node -v
npm -v
```

### Step 5: Deploy the Code and Configure Environment
```bash
# Clone the repository or upload your files
git clone YOUR_REPOSITORY_URL app
cd app

# Install dependencies
npm install

# Create production .env file
nano .env
```
Inside `.env`, configure:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://student_admin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/student_management_db?retryWrites=true&w=majority
```

### Step 6: Restrict MongoDB Atlas Network Access to EC2 IP
1. In your AWS EC2 Console, copy the **Public IPv4 address** of your EC2 instance.
2. In MongoDB Atlas **Network Access**, add this EC2 IP address `/32` (e.g., `54.210.12.34/32`).
3. This restricts database access exclusively to your AWS EC2 server and prevents unauthorized external access!

### Step 7: Run the Application with PM2 Process Manager
```bash
# Install PM2 process supervisor
sudo npm install -g pm2

# Start the application as a background service
pm2 start server/src/server.js --name "student-system"

# Configure PM2 to restart automatically upon server reboot
pm2 startup
pm2 save
```

### Step 8: Verification
Visit `http://YOUR_EC2_PUBLIC_IP:5000` in your browser. The Student Management System is now live in the cloud!

---

## 13. Security Considerations
- **No Credentials in Source Control:** `.gitignore` excludes `.env`, `node_modules`, and debug logs.
- **Credential Masking:** Database connection strings are masked in server logs (`mongodb+srv://***:***@cluster0...`).
- **Input Sanitization & Validation:** Mongoose schemas validate all incoming types, string lengths, and formats.
- **Safe Object IDs:** The backend handles both MongoDB ObjectIds and custom alphanumeric student identifiers safely.
- **CORS Protection:** Cross-Origin Resource Sharing is controlled to prevent unauthorized third-party origins in production.

---

## 14. Viva & Oral Exam Questions and Answers

### Q1: Why did you choose MongoDB Atlas over relational databases like MySQL or Amazon RDS?
> **Answer:** MongoDB is a document-oriented NoSQL database that stores data as flexible, schema-free BSON documents. Unlike Amazon RDS, which requires pre-defined tabular schemas and costly schema migrations when attributes change, MongoDB Atlas offers horizontal scalability, native cloud clustering (sharding & replication), and rapid prototyping for modern web applications.

### Q2: What is Mongoose and why is it used?
> **Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It acts as an abstraction layer that provides schema enforcement, type validation, middleware hooks, and intuitive query building while maintaining the advantages of a NoSQL database.

### Q3: What is the purpose of the `.env` file and why is it never committed to Git?
> **Answer:** The `.env` file stores sensitive environment variables such as `MONGODB_URI` containing the database username and password. Committing this file to version control introduces severe security vulnerabilities where unauthorized parties could access or destroy the database. We provide `.env.example` as a template with placeholder values instead.

### Q4: How does the application handle duplicate student IDs?
> **Answer:** We enforce a `unique: true` constraint on `studentId` in the Mongoose schema. In addition, our `studentController` pre-validates uniqueness before insertion and our centralized `errorHandler` catches MongoDB error code `11000` (E11000 duplicate key error) to return a clean `409 Conflict` HTTP response to the client.

### Q5: How is AWS used in conjunction with MongoDB Atlas?
> **Answer:** AWS EC2 provides the compute infrastructure (hosting the Node.js/Express web server and serving the frontend), while MongoDB Atlas operates as an independent Database-as-a-Service (DBaaS). The web server communicates with MongoDB Atlas over TLS/SSL using the connection string.

---

## 15. References
- [MongoDB Atlas Official Documentation](https://www.mongodb.com/docs/atlas/)
- [Mongoose ODM Documentation](https://mongoosejs.com/docs/)
- [Express.js API Reference](https://expressjs.com/en/4x/api.html)
- [AWS EC2 User Guide for Linux Instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Concepts.html)
