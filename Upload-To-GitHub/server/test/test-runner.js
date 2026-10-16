/**
 * Automated Verification & Test Suite
 * Tests Schema Validation, REST API Endpoints, and Atlas Connectivity
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const dotenv = require('dotenv');

// Load environment
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const Student = require('../src/models/Student');
const app = require('../src/app');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 STUDENT MANAGEMENT SYSTEM - TEST & VERIFICATION SUITE');
  console.log('======================================================\n');

  // TEST SUITE 1: Project Architecture & Security Checklist
  console.log('📂 1. Verifying Project File Structure & Security:');
  const requiredFiles = [
    '../../.gitignore',
    '../../.env.example',
    '../package.json',
    '../src/server.js',
    '../src/app.js',
    '../src/config/database.js',
    '../src/models/Student.js',
    '../src/controllers/studentController.js',
    '../src/controllers/statsController.js',
    '../src/routes/studentRoutes.js',
    '../src/routes/statsRoutes.js',
    '../src/routes/healthRoutes.js',
    '../../client/index.html',
    '../../client/css/style.css',
    '../../client/js/api.js',
    '../../client/js/app.js'
  ];

  requiredFiles.forEach((relPath) => {
    const fullPath = path.resolve(__dirname, relPath);
    assert(fs.existsSync(fullPath), `File exists: ${path.basename(relPath)}`);
  });

  const gitignoreContent = fs.readFileSync(path.resolve(__dirname, '../../.gitignore'), 'utf8');
  assert(gitignoreContent.includes('.env'), '.gitignore properly excludes .env secret file');
  assert(gitignoreContent.includes('node_modules'), '.gitignore properly excludes node_modules');

  const envExampleContent = fs.readFileSync(path.resolve(__dirname, '../../.env.example'), 'utf8');
  assert(!envExampleContent.includes('password123') && envExampleContent.includes('USERNAME:PASSWORD'), '.env.example contains generic placeholders and no exposed credentials');

  // TEST SUITE 2: Mongoose Schema Validation Logic
  console.log('\n📐 2. Verifying Mongoose Schema Validations:');

  // Test Missing Required Fields
  const incompleteStudent = new Student({});
  const valError = incompleteStudent.validateSync();
  assert(valError != null, 'Schema rejects empty student record');
  assert(valError.errors.studentId != null, 'Schema enforces required studentId');
  assert(valError.errors.fullName != null, 'Schema enforces required fullName');
  assert(valError.errors.email != null, 'Schema enforces required email');
  assert(valError.errors.department != null, 'Schema enforces required department');

  // Test Email Regex Validation
  const invalidEmailStudent = new Student({
    studentId: 'STU999',
    fullName: 'Test User',
    email: 'not-an-email',
    phone: '1234567890',
    department: 'Computer Science & Engineering',
    course: 'B.Tech',
    yearOfStudy: 1
  });
  const emailValError = invalidEmailStudent.validateSync();
  assert(emailValError != null && emailValError.errors.email != null, 'Schema rejects invalid email format ("not-an-email")');

  // Test Invalid Year of Study (< 1 or > 5)
  const invalidYearStudent = new Student({
    studentId: 'STU998',
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    department: 'Computer Science & Engineering',
    course: 'B.Tech',
    yearOfStudy: 9 // Invalid year
  });
  const yearValError = invalidYearStudent.validateSync();
  assert(yearValError != null && yearValError.errors.yearOfStudy != null, 'Schema rejects year of study greater than 5');

  // Test Valid Student Schema
  const validStudent = new Student({
    studentId: 'STU100',
    fullName: 'Test Student',
    email: 'student@test.edu',
    phone: '+1 555-0100',
    department: 'Computer Science & Engineering',
    course: 'B.Tech CSE',
    yearOfStudy: 2,
    admissionDate: new Date()
  });
  const validValError = validStudent.validateSync();
  assert(validValError == null, 'Schema accepts fully compliant student record');

  // TEST SUITE 3: HTTP API & Middleware Checks
  console.log('\n🌐 3. Verifying HTTP REST Server & API Responses:');

  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(0, resolve));
  const testPort = testServer.address().port;

  const makeRequest = (path, method = 'GET') => {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: testPort,
          path,
          method
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch {
              resolve({ status: res.statusCode, data });
            }
          });
        }
      );
      req.on('error', reject);
      req.end();
    });
  };

  try {
    // Check Health Endpoint
    const healthRes = await makeRequest('/api/health');
    assert(
      healthRes.status === 200 || healthRes.status === 503,
      `Health endpoint responds with HTTP ${healthRes.status} (status: ${healthRes.data.status})`
    );
    assert(healthRes.data.database != null, 'Health check returns database connectivity report');
    assert(healthRes.data.database.provider === 'MongoDB Atlas', 'Health check reports "MongoDB Atlas" as cloud provider');

    // Check Frontend Dashboard Serving
    const homeRes = await makeRequest('/');
    assert(homeRes.status === 200 && typeof homeRes.data === 'string' && homeRes.data.includes('Student Management System'), 'Root URL "/" successfully serves client index.html dashboard');

    // Check 404 Route Handling
    const notFoundRes = await makeRequest('/api/non-existent-endpoint');
    assert(notFoundRes.status === 404 && notFoundRes.data.success === false, 'Non-existent API route returns clean JSON 404 response');

  } finally {
    testServer.close();
  }

  // TEST SUITE 4: MongoDB Atlas Connection Status
  console.log('\n🍃 4. MongoDB Atlas Connection Check:');
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('USERNAME:PASSWORD')) {
    console.log('  ℹ️  [PENDING ATLAS CREDENTIALS]: MONGODB_URI is currently set to template placeholder.');
    console.log('  ℹ️  To connect to your cloud database, follow Phase 4 in README.md.');
  } else {
    console.log(`  ℹ️  MONGODB_URI configured. Connecting to test live Atlas cluster...`);
    try {
      const mongoose = require('mongoose');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      assert(true, 'Successfully connected to live MongoDB Atlas cluster!');
      await mongoose.connection.close();
    } catch (err) {
      assert(false, `Atlas connection test failed: ${err.message}`);
    }
  }

  console.log('\n======================================================');
  console.log(`📊 TEST RESULTS SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
