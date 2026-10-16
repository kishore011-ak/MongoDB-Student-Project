/**
 * Application Controller for Student Management System
 * Integrates Frontend UI with REST API & MongoDB Atlas
 */

(function () {
  'use strict';

  // Application State
  const state = {
    students: [],
    currentPage: 1,
    totalPages: 1,
    limit: 8,
    totalRecords: 0,
    searchQuery: '',
    selectedDepartment: 'All',
    selectedYear: 'All',
    studentToDelete: null,
    currentStudent: null,
    isSubmitting: false,
    debounceTimer: null
  };

  // DOM Elements
  const elements = {
    // Nav & Health
    sidebar: document.getElementById('sidebar'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    dbHealthPill: document.getElementById('dbHealthPill'),
    healthPulse: document.getElementById('healthPulse'),
    dbHealthText: document.getElementById('dbHealthText'),
    sidebarPulse: document.getElementById('sidebarPulse'),
    sidebarDbState: document.getElementById('sidebarDbState'),

    // Stats
    statTotalStudents: document.getElementById('statTotalStudents'),
    statTotalDepartments: document.getElementById('statTotalDepartments'),
    statTotalYears: document.getElementById('statTotalYears'),
    statDbEngine: document.getElementById('statDbEngine'),
    statDbHost: document.getElementById('statDbHost'),

    // Table & Filters
    searchInput: document.getElementById('searchInput'),
    departmentFilter: document.getElementById('departmentFilter'),
    yearFilter: document.getElementById('yearFilter'),
    btnResetFilters: document.getElementById('btnResetFilters'),
    btnRefreshData: document.getElementById('btnRefreshData'),
    studentsTableBody: document.getElementById('studentsTableBody'),
    emptyState: document.getElementById('emptyState'),
    emptyStateMsg: document.getElementById('emptyStateMsg'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    btnEmptyAdd: document.getElementById('btnEmptyAdd'),

    // Pagination
    paginationBar: document.getElementById('paginationBar'),
    paginationInfo: document.getElementById('paginationInfo'),
    btnPrevPage: document.getElementById('btnPrevPage'),
    btnNextPage: document.getElementById('btnNextPage'),
    pageNumbers: document.getElementById('pageNumbers'),

    // Modals
    btnOpenAddModal: document.getElementById('btnOpenAddModal'),
    studentFormModal: document.getElementById('studentFormModal'),
    btnCloseFormModal: document.getElementById('btnCloseFormModal'),
    btnCancelForm: document.getElementById('btnCancelForm'),
    studentForm: document.getElementById('studentForm'),
    formModalTitle: document.getElementById('formModalTitle'),
    submitBtnText: document.getElementById('submitBtnText'),
    submitBtnSpinner: document.getElementById('submitBtnSpinner'),

    // Form inputs
    editMongoId: document.getElementById('editMongoId'),
    inputStudentId: document.getElementById('inputStudentId'),
    inputFullName: document.getElementById('inputFullName'),
    inputEmail: document.getElementById('inputEmail'),
    inputPhone: document.getElementById('inputPhone'),
    inputDepartment: document.getElementById('inputDepartment'),
    inputCourse: document.getElementById('inputCourse'),
    inputYearOfStudy: document.getElementById('inputYearOfStudy'),
    inputAdmissionDate: document.getElementById('inputAdmissionDate'),

    // Details Modal
    studentDetailsModal: document.getElementById('studentDetailsModal'),
    btnCloseDetailsModal: document.getElementById('btnCloseDetailsModal'),
    btnCloseDetailsBtn: document.getElementById('btnCloseDetailsBtn'),
    btnEditFromDetails: document.getElementById('btnEditFromDetails'),
    detailStudentId: document.getElementById('detailStudentId'),
    detailMongoId: document.getElementById('detailMongoId'),
    detailFullName: document.getElementById('detailFullName'),
    detailEmail: document.getElementById('detailEmail'),
    detailPhone: document.getElementById('detailPhone'),
    detailDepartment: document.getElementById('detailDepartment'),
    detailCourse: document.getElementById('detailCourse'),
    detailYear: document.getElementById('detailYear'),
    detailAdmissionDate: document.getElementById('detailAdmissionDate'),
    detailCreatedAt: document.getElementById('detailCreatedAt'),

    // Delete Modal
    deleteConfirmModal: document.getElementById('deleteConfirmModal'),
    btnCloseDeleteModal: document.getElementById('btnCloseDeleteModal'),
    btnCancelDelete: document.getElementById('btnCancelDelete'),
    btnConfirmDelete: document.getElementById('btnConfirmDelete'),
    deleteStudentTargetName: document.getElementById('deleteStudentTargetName'),
    deleteStudentTargetId: document.getElementById('deleteStudentTargetId'),
    deleteSpinner: document.getElementById('deleteSpinner'),

    // Architecture Modal
    architectureModal: document.getElementById('architectureModal'),
    btnCloseArchModal: document.getElementById('btnCloseArchModal'),
    btnCloseArchModalBtn: document.getElementById('btnCloseArchModalBtn'),
    archModalDbInfo: document.getElementById('archModalDbInfo'),
    navArchitecture: document.getElementById('navArchitecture'),
    navHealth: document.getElementById('navHealth'),
    toastContainer: document.getElementById('toastContainer')
  };

  /**
   * Show Toast Notification
   * @param {string} title 
   * @param {string} message 
   * @param {'success'|'error'|'warning'|'info'} type 
   */
  const showToast = (title, message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const iconMap = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type] || '🔔'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  };

  /**
   * Check Health of MongoDB Atlas Connection
   */
  const checkSystemHealth = async () => {
    try {
      const data = await window.api.checkHealth();
      const isConnected = data.database && data.database.connected;

      if (isConnected) {
        elements.dbHealthPill.className = 'health-pill connected';
        elements.healthPulse.style.backgroundColor = '#10b981';
        elements.healthPulse.style.boxShadow = '0 0 8px #10b981';
        elements.dbHealthText.textContent = `Atlas Connected (${data.database.databaseName})`;

        elements.sidebarPulse.style.backgroundColor = '#10b981';
        elements.sidebarPulse.style.boxShadow = '0 0 8px #10b981';
        elements.sidebarDbState.textContent = 'Connected (Live)';
        elements.sidebarDbState.style.color = '#10b981';

        elements.statDbEngine.textContent = 'MongoDB Atlas';
        elements.statDbHost.innerHTML = `<span>Host: ${data.database.maskedHost}</span>`;

        elements.archModalDbInfo.innerHTML = `
          <strong>Status:</strong> Connected ✅<br>
          <strong>Database:</strong> ${data.database.databaseName}<br>
          <strong>Provider:</strong> MongoDB Atlas Cloud<br>
          <strong>Host:</strong> ${data.database.maskedHost}<br>
          <strong>Node.js:</strong> ${data.system.nodeVersion}<br>
          <strong>Memory Usage:</strong> ${data.system.memoryUsageMB} MB
        `;
      } else {
        markDbDisconnected(data.database ? data.database.status : 'Disconnected');
      }
    } catch (error) {
      markDbDisconnected(error.message);
    }
  };

  const markDbDisconnected = (reason) => {
    elements.dbHealthPill.className = 'health-pill disconnected';
    elements.healthPulse.style.backgroundColor = '#ef4444';
    elements.healthPulse.style.boxShadow = '0 0 8px #ef4444';
    elements.dbHealthText.textContent = 'Database Disconnected';

    elements.sidebarPulse.style.backgroundColor = '#ef4444';
    elements.sidebarPulse.style.boxShadow = '0 0 8px #ef4444';
    elements.sidebarDbState.textContent = 'Disconnected';
    elements.sidebarDbState.style.color = '#ef4444';

    elements.statDbHost.innerHTML = `<span style="color: #ef4444;">Connection Pending (.env)</span>`;

    elements.archModalDbInfo.innerHTML = `
      <strong>Status:</strong> Disconnected ⚠️<br>
      <strong>Reason:</strong> ${reason}<br>
      <em>Tip: Set MONGODB_URI in your .env file with your Atlas connection string.</em>
    `;
  };

  /**
   * Fetch and render Dashboard Statistics
   */
  const loadDashboardStats = async () => {
    try {
      const response = await window.api.getStats();
      if (response && response.success) {
        const stats = response.data;
        elements.statTotalStudents.textContent = stats.totalStudents;
        elements.statTotalDepartments.textContent = stats.totalDepartments;

        if (stats.yearDistribution && stats.yearDistribution.length > 0) {
          const years = stats.yearDistribution.map(y => `Yr ${y.year}`).join(', ');
          elements.statTotalYears.textContent = years;
        } else {
          elements.statTotalYears.textContent = 'Year 1 - 4';
        }
      }
    } catch {
      // Handled silently to not block table
    }
  };

  /**
   * Fetch and render students table
   */
  const loadStudents = async () => {
    elements.loadingIndicator.style.display = 'flex';
    elements.emptyState.style.display = 'none';
    elements.studentsTableBody.innerHTML = '';

    try {
      const params = {
        page: state.currentPage,
        limit: state.limit,
        search: state.searchQuery,
        department: state.selectedDepartment,
        yearOfStudy: state.selectedYear
      };

      const response = await window.api.getStudents(params);

      elements.loadingIndicator.style.display = 'none';

      if (response && response.success) {
        state.students = response.data;
        state.totalPages = response.totalPages;
        state.totalRecords = response.total;

        renderTable();
        renderPagination();
      } else {
        showEmptyState('Could not retrieve students from database.');
      }
    } catch (error) {
      elements.loadingIndicator.style.display = 'none';
      showEmptyState(`Error connecting to MongoDB Atlas: ${error.message}`);
      showToast('Database Query Notice', error.message, 'warning');
    }
  };

  /**
   * Render table rows
   */
  const renderTable = () => {
    elements.studentsTableBody.innerHTML = '';

    if (!state.students || state.students.length === 0) {
      showEmptyState('No students match your query. Try resetting filters or adding a new student.');
      return;
    }

    elements.emptyState.style.display = 'none';

    state.students.forEach((student) => {
      const tr = document.createElement('tr');

      const formattedDate = student.admissionDate
        ? new Date(student.admissionDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'N/A';

      tr.innerHTML = `
        <td><span class="student-id-badge">${escapeHtml(student.studentId)}</span></td>
        <td>
          <div class="student-name-block">
            <span class="student-name">${escapeHtml(student.fullName)}</span>
            <span class="student-email">${escapeHtml(student.email)}</span>
          </div>
        </td>
        <td>${escapeHtml(student.phone)}</td>
        <td><span class="department-badge">${escapeHtml(student.department)}</span></td>
        <td>${escapeHtml(student.course)}</td>
        <td><span class="year-badge">Year ${student.yearOfStudy}</span></td>
        <td>${formattedDate}</td>
        <td>
          <div class="action-buttons" style="justify-content: flex-end;">
            <button class="btn-icon" data-action="view" data-id="${student._id}" title="View Details">
              👁️
            </button>
            <button class="btn-icon" data-action="edit" data-id="${student._id}" title="Edit Student">
              ✏️
            </button>
            <button class="btn-icon delete" data-action="delete" data-id="${student._id}" title="Delete Student">
              🗑️
            </button>
          </div>
        </td>
      `;

      elements.studentsTableBody.appendChild(tr);
    });
  };

  /**
   * Show empty state
   */
  const showEmptyState = (msg) => {
    elements.studentsTableBody.innerHTML = '';
    elements.emptyState.style.display = 'flex';
    elements.emptyStateMsg.textContent = msg;
    elements.paginationBar.style.display = 'none';
  };

  /**
   * Render pagination controls
   */
  const renderPagination = () => {
    if (state.totalRecords === 0) {
      elements.paginationBar.style.display = 'none';
      return;
    }

    elements.paginationBar.style.display = 'flex';
    const startIdx = (state.currentPage - 1) * state.limit + 1;
    const endIdx = Math.min(state.currentPage * state.limit, state.totalRecords);

    elements.paginationInfo.textContent = `Showing ${startIdx}–${endIdx} of ${state.totalRecords} students`;

    elements.btnPrevPage.disabled = state.currentPage <= 1;
    elements.btnNextPage.disabled = state.currentPage >= state.totalPages;

    // Render numbered page buttons
    elements.pageNumbers.innerHTML = '';
    for (let i = 1; i <= state.totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${i === state.currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => {
        state.currentPage = i;
        loadStudents();
      });
      elements.pageNumbers.appendChild(pageBtn);
    }
  };

  /**
   * Open Student Form Modal for Adding
   */
  const openAddStudentModal = () => {
    elements.studentForm.reset();
    elements.editMongoId.value = '';
    elements.formModalTitle.textContent = 'Add New Student';
    elements.submitBtnText.textContent = 'Save to MongoDB Atlas';
    elements.inputStudentId.disabled = false;

    // Set today's date as default admission date
    const today = new Date().toISOString().split('T')[0];
    elements.inputAdmissionDate.value = today;

    openModal(elements.studentFormModal);
  };

  /**
   * Open Student Form Modal for Editing
   */
  const openEditStudentModal = (student) => {
    elements.studentForm.reset();
    elements.editMongoId.value = student._id;
    elements.formModalTitle.textContent = `Edit Student: ${student.fullName}`;
    elements.submitBtnText.textContent = 'Update MongoDB Record';

    elements.inputStudentId.value = student.studentId;
    elements.inputFullName.value = student.fullName;
    elements.inputEmail.value = student.email;
    elements.inputPhone.value = student.phone;
    elements.inputDepartment.value = student.department;
    elements.inputCourse.value = student.course;
    elements.inputYearOfStudy.value = student.yearOfStudy;

    if (student.admissionDate) {
      const dateStr = new Date(student.admissionDate).toISOString().split('T')[0];
      elements.inputAdmissionDate.value = dateStr;
    }

    openModal(elements.studentFormModal);
  };

  /**
   * Handle Form Submit (Add or Edit)
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (state.isSubmitting) return;

    // Form field extraction
    const studentData = {
      studentId: elements.inputStudentId.value.trim(),
      fullName: elements.inputFullName.value.trim(),
      email: elements.inputEmail.value.trim(),
      phone: elements.inputPhone.value.trim(),
      department: elements.inputDepartment.value,
      course: elements.inputCourse.value.trim(),
      yearOfStudy: Number(elements.inputYearOfStudy.value),
      admissionDate: elements.inputAdmissionDate.value
    };

    // Client-side validations
    if (!studentData.studentId) {
      showToast('Validation Error', 'Student ID is required', 'error');
      return elements.inputStudentId.focus();
    }
    if (!studentData.fullName) {
      showToast('Validation Error', 'Full Name is required', 'error');
      return elements.inputFullName.focus();
    }
    if (!studentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
      showToast('Validation Error', 'Please enter a valid email address', 'error');
      return elements.inputEmail.focus();
    }
    if (!studentData.phone) {
      showToast('Validation Error', 'Phone number is required', 'error');
      return elements.inputPhone.focus();
    }
    if (!studentData.department) {
      showToast('Validation Error', 'Please select a department', 'error');
      return elements.inputDepartment.focus();
    }
    if (!studentData.course) {
      showToast('Validation Error', 'Course program is required', 'error');
      return elements.inputCourse.focus();
    }
    if (!studentData.yearOfStudy) {
      showToast('Validation Error', 'Please select the year of study', 'error');
      return elements.inputYearOfStudy.focus();
    }

    // Toggle submit button state
    state.isSubmitting = true;
    elements.submitBtnSpinner.style.display = 'inline';
    elements.submitBtnText.textContent = 'Saving to Atlas...';

    const editId = elements.editMongoId.value;

    try {
      if (editId) {
        // Update existing record
        const response = await window.api.updateStudent(editId, studentData);
        showToast('Student Updated', response.message || 'Record successfully updated in MongoDB Atlas!', 'success');
      } else {
        // Create new record
        const response = await window.api.createStudent(studentData);
        showToast('Student Added', response.message || 'New student saved to MongoDB Atlas!', 'success');
      }

      closeModal(elements.studentFormModal);
      await loadStudents();
      await loadDashboardStats();
    } catch (error) {
      showToast('Operation Failed', error.message, 'error');
    } finally {
      state.isSubmitting = false;
      elements.submitBtnSpinner.style.display = 'none';
      elements.submitBtnText.textContent = editId ? 'Update MongoDB Record' : 'Save to MongoDB Atlas';
    }
  };

  /**
   * Open Student Profile Details Modal
   */
  const openDetailsModal = (student) => {
    state.currentStudent = student;

    elements.detailStudentId.textContent = student.studentId;
    elements.detailMongoId.textContent = student._id;
    elements.detailFullName.textContent = student.fullName;
    elements.detailEmail.textContent = student.email;
    elements.detailPhone.textContent = student.phone;
    elements.detailDepartment.textContent = student.department;
    elements.detailCourse.textContent = student.course;
    elements.detailYear.textContent = `Year ${student.yearOfStudy}`;

    elements.detailAdmissionDate.textContent = student.admissionDate
      ? new Date(student.admissionDate).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';

    elements.detailCreatedAt.textContent = student.createdAt
      ? new Date(student.createdAt).toLocaleString()
      : 'N/A';

    openModal(elements.studentDetailsModal);
  };

  /**
   * Open Delete Confirmation Modal
   */
  const openDeleteModal = (student) => {
    state.studentToDelete = student;
    elements.deleteStudentTargetName.textContent = student.fullName;
    elements.deleteStudentTargetId.textContent = student.studentId;
    elements.deleteSpinner.style.display = 'none';
    openModal(elements.deleteConfirmModal);
  };

  /**
   * Confirm and Execute Deletion
   */
  const handleConfirmDelete = async () => {
    if (!state.studentToDelete) return;

    elements.deleteSpinner.style.display = 'inline';

    try {
      const response = await window.api.deleteStudent(state.studentToDelete._id);
      showToast('Student Deleted', response.message || 'Student document removed from MongoDB Atlas.', 'success');
      closeModal(elements.deleteConfirmModal);
      state.studentToDelete = null;

      await loadStudents();
      await loadDashboardStats();
    } catch (error) {
      showToast('Deletion Failed', error.message, 'error');
    } finally {
      elements.deleteSpinner.style.display = 'none';
    }
  };

  /**
   * Modal Helper Functions
   */
  const openModal = (modalEl) => {
    modalEl.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalEl) => {
    modalEl.classList.remove('show');
    document.body.style.overflow = '';
  };

  const escapeHtml = (str) => {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  /**
   * Setup Event Listeners
   */
  const setupEventListeners = () => {
    // Mobile menu toggle
    elements.mobileMenuBtn.addEventListener('click', () => {
      elements.sidebar.classList.toggle('open');
    });

    // Top navbar buttons & health check
    elements.btnOpenAddModal.addEventListener('click', openAddStudentModal);
    elements.btnEmptyAdd.addEventListener('click', openAddStudentModal);
    elements.dbHealthPill.addEventListener('click', () => openModal(elements.architectureModal));
    elements.navHealth.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(elements.architectureModal);
    });
    elements.navArchitecture.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(elements.architectureModal);
    });

    // Search input debounced
    elements.searchInput.addEventListener('input', (e) => {
      clearTimeout(state.debounceTimer);
      state.debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value.trim();
        state.currentPage = 1;
        loadStudents();
      }, 300);
    });

    // Filters
    elements.departmentFilter.addEventListener('change', (e) => {
      state.selectedDepartment = e.target.value;
      state.currentPage = 1;
      loadStudents();
    });

    elements.yearFilter.addEventListener('change', (e) => {
      state.selectedYear = e.target.value;
      state.currentPage = 1;
      loadStudents();
    });

    elements.btnResetFilters.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.departmentFilter.value = 'All';
      elements.yearFilter.value = 'All';
      state.searchQuery = '';
      state.selectedDepartment = 'All';
      state.selectedYear = 'All';
      state.currentPage = 1;
      loadStudents();
    });

    elements.btnRefreshData = document.getElementById('btnRefreshData');
    elements.btnRefreshData.addEventListener('click', () => {
      checkSystemHealth();
      loadDashboardStats();
      loadStudents();
      showToast('Data Synced', 'Refreshed records from MongoDB Atlas', 'info');
    });

    // Pagination
    elements.btnPrevPage.addEventListener('click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        loadStudents();
      }
    });

    elements.btnNextPage.addEventListener('click', () => {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        loadStudents();
      }
    });

    // Table action buttons delegation
    elements.studentsTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const student = state.students.find(s => s._id === id);

      if (!student) return;

      if (action === 'view') {
        openDetailsModal(student);
      } else if (action === 'edit') {
        openEditStudentModal(student);
      } else if (action === 'delete') {
        openDeleteModal(student);
      }
    });

    // Form Modal Events
    elements.studentForm.addEventListener('submit', handleFormSubmit);
    elements.btnCloseFormModal.addEventListener('click', () => closeModal(elements.studentFormModal));
    elements.btnCancelForm.addEventListener('click', () => closeModal(elements.studentFormModal));

    // Details Modal Events
    elements.btnCloseDetailsModal.addEventListener('click', () => closeModal(elements.studentDetailsModal));
    elements.btnCloseDetailsBtn.addEventListener('click', () => closeModal(elements.studentDetailsModal));
    elements.btnEditFromDetails.addEventListener('click', () => {
      closeModal(elements.studentDetailsModal);
      if (state.currentStudent) {
        openEditStudentModal(state.currentStudent);
      }
    });

    // Delete Modal Events
    elements.btnCloseDeleteModal.addEventListener('click', () => closeModal(elements.deleteConfirmModal));
    elements.btnCancelDelete.addEventListener('click', () => closeModal(elements.deleteConfirmModal));
    elements.btnConfirmDelete.addEventListener('click', handleConfirmDelete);

    // Architecture Modal Events
    elements.btnCloseArchModal.addEventListener('click', () => closeModal(elements.architectureModal));
    elements.btnCloseArchModalBtn.addEventListener('click', () => closeModal(elements.architectureModal));

    // Close modals on clicking backdrop
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        closeModal(e.target);
      }
    });

    // Keyboard accessibility: ESC key to close open modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModalEl = document.querySelector('.modal-backdrop.show');
        if (openModalEl) closeModal(openModalEl);
      }
    });
  };

  /**
   * Application Initialization
   */
  const init = async () => {
    setupEventListeners();
    await checkSystemHealth();
    await loadDashboardStats();
    await loadStudents();

    // Check health periodically every 30 seconds
    setInterval(checkSystemHealth, 30000);
  };

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
