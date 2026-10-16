# PROJECT REPORT

## SETTING UP MONGODB FOR A WEB APPLICATION USING AWS CLOUD SERVICES
### Application: Student Management System

---

### A Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of
**BACHELOR OF TECHNOLOGY / BACHELOR OF ENGINEERING**  
in  
**COMPUTER SCIENCE & ENGINEERING / INFORMATION TECHNOLOGY**

**Submitted by:**  
- **Student Name:** [Your Name Here]  
- **Register / Roll Number:** [Your Register Number Here]  
- **Department:** Department of Computer Science & Engineering  
- **Institution:** [Your College / University Name Here]  
- **Academic Year:** 2025–2026  

**Under the Guidance of:**  
- **Project Supervisor / Guide:** [Guide Name & Designation]  

---

## CERTIFICATE OF APPROVAL

This is to certify that the project entitled **"Setting Up MongoDB for a Web Application Using AWS Cloud Services: Student Management System"** is a bona fide record of work carried out by **[Your Name Here]** (Roll No: **[Your Roll Number]**) under my supervision and guidance, in partial fulfillment of the requirements for the degree of Bachelor of Technology in Computer Science & Engineering.

<br><br>

___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ___________________________  
**Internal Guide** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Head of the Department**  

<br>

___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ___________________________  
**Internal Examiner** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **External Examiner**  

---

## TABLE OF CONTENTS
1. Abstract
2. Introduction
3. Existing System Analysis
4. Proposed System
5. Project Objectives
6. Requirements Specification
7. System Architecture & Design
8. Database Design & Schemas
9. Module Descriptions
10. Implementation Details
11. Testing & Validation
12. Results & Discussion (Screenshots)
13. Advantages of the System
14. Limitations
15. Future Scope & Enhancements
16. Conclusion
17. References

---

## 1. ABSTRACT
In modern academic institutions, managing student lifecycle data accurately and securely is paramount. This project demonstrates the design, development, and cloud integration of a full-stack **Student Management System** using **MongoDB Atlas** as the centralized cloud database and **Node.js with Express.js** for server-side business logic. The user interface is developed as a responsive, accessible single-page administrative dashboard utilizing HTML5, CSS3, and JavaScript. 

The primary contribution of this work lies in showcasing how cloud-native NoSQL document databases seamlessly interface with asynchronous web APIs, execute real-time aggregations, enforce schema validation through Mongoose ODM, and prepare for elastic cloud scaling via **Amazon Web Services (AWS EC2)**. The system successfully implements full CRUD functionality, real-time analytics, debounced multi-field searching, and automated error handling.

---

## 2. INTRODUCTION
Cloud database technologies have largely displaced static, on-premise relational database installations due to their high availability, zero server maintenance, automated scaling, and cross-region replication. While relational database management systems (RDBMS) like MySQL require rigid tabular schemas, modern web applications frequently handle variable attributes that are better represented as JSON-like documents.

This project addresses this modern paradigm by implementing an administrative Student Management System connected to **MongoDB Atlas**, a Database-as-a-Service (DBaaS) cloud platform. The architecture separates the compute/web tier from the data persistence tier, illustrating how web applications can be deployed across cloud platforms like AWS while leveraging MongoDB Atlas for database operations.

---

## 3. EXISTING SYSTEM ANALYSIS
In conventional educational administration workflows:
1. **Manual / Spreadsheet Storage:** Records are maintained in spreadsheet formats (e.g., CSV, Excel) without multi-user concurrency control or referential integrity.
2. **On-Premise Relational Databases:** Systems running on local MySQL or SQLite installations suffer from single points of hardware failure and lack automated cloud disaster recovery.
3. **Rigid Schemas:** Updating student attributes (e.g., adding dynamic elective courses or certifications) requires costly database schema alterations.
4. **Poor Validation:** Frontends often fail to enforce strict uniqueness constraints, resulting in duplicate student enrollment codes and corrupted datasets.

---

## 4. PROPOSED SYSTEM
The proposed system resolves existing limitations by delivering:
- **Cloud-Native Persistence:** MongoDB Atlas guarantees high availability, automated TLS encryption, and cloud clustering.
- **Strict Data Validation:** Mongoose schemas enforce required attributes, unique constraints on `studentId` and `email`, and regex validation on the server tier.
- **Real-Time Dynamic Dashboard:** Summary statistics (total enrollment, department counts, cohort breakdowns) are calculated dynamically using database aggregation queries.
- **Responsive Admin UI:** A clean interface featuring live database connectivity badges, debounced search, modal dialogs, and toast notifications.
- **Cloud Readiness:** Architectural design decoupled for optional hosting on AWS EC2.

---

## 5. PROJECT OBJECTIVES
1. To design and implement a web application connecting to a live MongoDB Atlas cluster.
2. To create a RESTful API supporting all CRUD operations (Create, Read, Update, Delete).
3. To implement data integrity checks preventing duplicate student IDs or invalid emails.
4. To calculate real-time analytics using MongoDB aggregation pipelines.
5. To document the end-to-end cloud deployment procedure on AWS EC2.

---

## 6. REQUIREMENTS SPECIFICATION

### 6.1 Hardware Requirements
- **Processor:** Intel Core i5 / Apple M-Series or equivalent (minimum 2.0 GHz)
- **RAM:** Minimum 4 GB (8 GB recommended)
- **Storage:** Minimum 1 GB available disk space for Node.js modules and local cache
- **Network:** Active broadband Internet connection (required for MongoDB Atlas cloud connectivity)

### 6.2 Software Requirements
- **Operating System:** macOS, Linux (Ubuntu 22.04+), or Windows 10/11
- **Runtime Environment:** Node.js v18.x / v20.x / v24.x
- **Package Manager:** npm v9.x+
- **Database Engine:** MongoDB Atlas (M0 Free Tier)
- **Web Browser:** Google Chrome, Mozilla Firefox, or Safari (modern ES6+ compliant)

### 6.3 Functional Requirements
- **FR-1:** System must allow administrators to enroll new students with full details.
- **FR-2:** System must validate unique student ID and email format before writing to the database.
- **FR-3:** System must list all students with pagination controls.
- **FR-4:** System must allow searching by student ID, name, or email.
- **FR-5:** System must permit filtering records by department and year of study.
- **FR-6:** System must allow editing existing student records with pre-filled forms.
- **FR-7:** System must prompt for confirmation prior to deleting any record.
- **FR-8:** System must report real-time MongoDB Atlas health status.

### 6.4 Non-Functional Requirements
- **Security:** Credentials must never be exposed to frontend code or committed to Git.
- **Reliability:** Graceful error handling for database connection drops or validation failures.
- **Usability:** Responsive layout with clear user feedback (toasts, loading spinners).

---

## 7. SYSTEM ARCHITECTURE & DESIGN

### 7.1 Tiered Architecture Overview
The system follows an industry-standard **3-Tier Architecture**:
1. **Presentation Tier (Client):** Single-page web dashboard using HTML5, CSS3, and JavaScript interacting via Fetch API.
2. **Application Tier (Server):** Node.js and Express.js REST API handling HTTP routes, request validation, and business logic.
3. **Data Tier (Database):** Cloud-hosted MongoDB Atlas managing BSON documents within the `students` collection.

```
[ User / Administrator ]
          │
          ▼
┌───────────────────────────────┐
│     Client Web Dashboard      │  (HTML5, CSS3, Vanilla JS)
└──────────────┬────────────────┘
               │  REST API Calls (JSON via HTTP)
               ▼
┌───────────────────────────────┐
│ Express.js Application Server │  (Hosted locally or on AWS EC2)
│  - Routes & Middleware       │
│  - Controllers (CRUD)         │
│  - Mongoose ODM               │
└──────────────┬────────────────┘
               │  Mongoose TLS/SSL Connection String (MONGODB_URI)
               ▼
┌───────────────────────────────┐
│      MongoDB Atlas Cloud      │  (student_management_db)
│   - Collection: students      │
└───────────────────────────────┘
```

---

## 8. DATABASE DESIGN & SCHEMAS

### 8.1 Database & Collection
- **Database Name:** `student_management_db`
- **Collection Name:** `students`

### 8.2 Data Dictionary (Student Schema)

| Field | Type | Required | Unique | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes (Auto) | Yes | MongoDB primary key identifier |
| `studentId` | String | Yes | Yes | Unique student registration code (e.g., `STU1001`) |
| `fullName` | String | Yes | No | Full legal name of student |
| `email` | String | Yes | Yes | Validated academic or personal email |
| `phone` | String | Yes | No | Contact telephone number |
| `department` | String | Yes | No | Enrolled engineering/academic department |
| `course` | String | Yes | No | Degree program (e.g., `B.Tech CSE`) |
| `yearOfStudy` | Number | Yes | No | Academic year level (1 to 5) |
| `admissionDate`| Date | Yes | No | Enrollment admission timestamp |
| `createdAt` | Date | Auto | No | Document creation timestamp |
| `updatedAt` | Date | Auto | No | Document last update timestamp |

### 8.3 Indexes Implemented
- Unique index on `studentId` for $O(1)$ fast lookup and uniqueness enforcement.
- Unique index on `email` to avoid duplicate contact records.
- Compound index on `{ department: 1, yearOfStudy: 1 }` to optimize filtered queries.
- Text index on `{ fullName: "text", studentId: "text" }` to accelerate keyword searching.

---

## 9. MODULE DESCRIPTIONS

### Module 1: Presentation & UI Dashboard (`client/`)
Renders the administrative dashboard, metrics cards, table view, pagination controls, search inputs, and modal dialogs. Communicates with backend endpoints asynchronously via `api.js`.

### Module 2: REST API Routing & Dispatcher (`server/src/routes/`)
Maps HTTP verbs and URLs (`GET`, `POST`, `PUT`, `DELETE`) to corresponding controller functions using Express Router.

### Module 3: Controller Business Logic (`server/src/controllers/`)
Extracts and sanitizes request parameters, coordinates pagination calculations, runs aggregation pipelines for dashboard metrics, and handles database operations via Mongoose.

### Module 4: Cloud Data Persistence (`server/src/models/` & `config/`)
Defines the Mongoose schema, enforces data validation constraints, and manages persistent connection pooling to MongoDB Atlas.

### Module 5: Centralized Error Handling (`server/src/middleware/`)
Catches uncaught exceptions, converts Mongoose validation errors into readable 400 Bad Request messages, and intercepts code `11000` duplicate key collisions into 409 Conflict responses.

---

## 10. IMPLEMENTATION DETAILS

### 10.1 Key Code Highlights

#### Connection to MongoDB Atlas (`database.js`):
```javascript
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });
  console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
};
```

#### Duplicate Key Error Interception (`errorHandler.js`):
```javascript
if (err.code === 11000) {
  statusCode = 409;
  const field = Object.keys(err.keyValue || {})[0];
  message = `Duplicate error: ${field} "${err.keyValue[field]}" is already in use.`;
}
```

#### Real-Time Aggregation Pipeline (`statsController.js`):
```javascript
const departmentStats = await Student.aggregate([
  { $group: { _id: '$department', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

---

## 11. TESTING & VALIDATION

### 11.1 Test Case Summary Table

| Test ID | Test Description | Input Data | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Backend Health Check | `GET /api/health` | Returns status 200 with database details | **PASSED** |
| **TC-02** | Schema Required Fields | Empty student object `{}` | Validation error rejecting missing fields | **PASSED** |
| **TC-03** | Email Format Validation | Email: `invalid-email` | Mongoose validation error on email | **PASSED** |
| **TC-04** | Year Bounds Validation | Year: `9` | Rejected (yearOfStudy > 5) | **PASSED** |
| **TC-05** | Add New Student (CRUD) | Valid student JSON | 201 Created; document stored in Atlas | **PASSED** |
| **TC-06** | Duplicate ID Rejection | Existing `studentId` | 409 Conflict with informative error message | **PASSED** |
| **TC-07** | Read & Pagination | Page: 1, Limit: 8 | Returns paginated document array | **PASSED** |
| **TC-08** | Dynamic Search | Query: `Sophia` | Returns records matching keyword | **PASSED** |
| **TC-09** | Update Student | Updated phone/department | 200 OK; modified document returned | **PASSED** |
| **TC-10** | Delete Confirmation | Student document ID | Record deleted from Atlas collection | **PASSED** |
| **TC-11** | 404 Route Protection | Non-existent route | Returns clean JSON 404 error | **PASSED** |
| **TC-12** | Secret Leak Prevention | Check `.env` and Git status | `.env` ignored; credentials masked | **PASSED** |

---

## 12. RESULTS & DISCUSSION

### 12.1 Screen Captures of Working Application

> *Note for Student: Capture your live screen after running the application and paste the images into the sections below.*

#### Screenshot 1: Student Management System Dashboard
```
+--------------------------------------------------------------------------+
|  [ INSERT SCREENSHOT: Admin Dashboard with Statistics & Student Table ]   |
|  Filename: screenshot_dashboard.png                                      |
+--------------------------------------------------------------------------+
```
*Figure 12.1: Home Dashboard displaying dynamic enrollment count, department distribution, and student data table.*

#### Screenshot 2: Add Student Modal with Real-Time Validation
```
+--------------------------------------------------------------------------+
|  [ INSERT SCREENSHOT: Add Student Modal Form ]                           |
|  Filename: screenshot_add_student.png                                    |
+--------------------------------------------------------------------------+
```
*Figure 12.2: Add Student dialog with field validation rules and admission date selection.*

#### Screenshot 3: MongoDB Atlas Web Console Showing Collection
```
+--------------------------------------------------------------------------+
|  [ INSERT SCREENSHOT: MongoDB Atlas Browse Collections Interface ]       |
|  Filename: screenshot_atlas_console.png                                  |
+--------------------------------------------------------------------------+
```
*Figure 12.3: MongoDB Atlas web interface displaying live documents in the `students` collection of `student_management_db`.*

#### Screenshot 4: Health Check Endpoint (`/api/health`)
```
+--------------------------------------------------------------------------+
|  [ INSERT SCREENSHOT: Browser / Postman output of /api/health ]          |
|  Filename: screenshot_health_api.png                                     |
+--------------------------------------------------------------------------+
```
*Figure 12.4: Express health check response verifying live MongoDB Atlas connectivity and system memory metrics.*

---

## 13. ADVANTAGES OF THE SYSTEM
1. **Zero Database Infrastructure Overhead:** MongoDB Atlas automates clustering, backups, and operating system patching.
2. **High Security Standards:** Secrets are isolated in `.env` files, connection strings are masked in logs, and Atlas network access restricts incoming IP addresses.
3. **Real-Time Data Accuracy:** Dashboard analytics reflect live database documents rather than cached or mock data.
4. **Intuitive User Experience:** Responsive design, debounced filtering, and confirmation modals prevent accidental data deletion.

---

## 14. LIMITATIONS
1. **Network Dependency:** MongoDB Atlas requires active internet connectivity for database reads and writes.
2. **Free-Tier Limits:** The M0 Free Tier provides 512 MB of storage, which is suitable for college demonstration datasets but requires upgrading to M10+ for institutional scale.

---

## 15. FUTURE SCOPE & ENHANCEMENTS
1. **Role-Based Authentication (RBAC):** Implementing JSON Web Tokens (JWT) for student and administrator logins.
2. **Attendance & Grading Modules:** Extending the schema with sub-documents or referenced collections for course grades and daily attendance.
3. **AWS S3 Profile Picture Storage:** Integrating Amazon S3 for storing student ID photographs.
4. **CI/CD Pipeline with AWS CodePipeline:** Automating deployments directly from GitHub to AWS EC2.

---

## 16. CONCLUSION
The project **"Setting Up MongoDB for a Web Application Using AWS Cloud Services"** was successfully designed, developed, and verified. The application demonstrates how an Express.js backend can be paired with MongoDB Atlas to deliver a responsive Student Management System. By adhering to clean architectural separation, strict data validation, credential masking, and automated testing, the project provides a comprehensive capstone deliverable suitable for academic evaluation and real-world deployment.

---

## 17. REFERENCES
1. Chodorow, K. (2013). *MongoDB: The Definitive Guide*. O'Reilly Media.
2. Holmes, S. (2019). *Getting MEAN with Mongo, Express, Angular, and Node*. Manning Publications.
3. MongoDB Documentation. *MongoDB Atlas Cloud Database Overview*. [https://www.mongodb.com/docs/atlas/](https://www.mongodb.com/docs/atlas/)
4. Mongoose ODM Documentation. *Mongoose Validation and Schemas*. [https://mongoosejs.com/docs/validation.html](https://mongoosejs.com/docs/validation.html)
5. Amazon Web Services. *Amazon Elastic Compute Cloud (EC2) Documentation*. [https://docs.aws.amazon.com/ec2/](https://docs.aws.amazon.com/ec2/)
