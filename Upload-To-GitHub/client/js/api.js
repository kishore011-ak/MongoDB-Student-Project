/**
 * API Service for Student Management System
 * Handles communication with Express REST API and MongoDB Atlas
 */

// Dynamically determine API base URL (supports both same-origin and separate port hosting)
const API_BASE_URL = window.location.protocol.startsWith('http')
  ? '/api'
  : 'http://localhost:5050/api';

const api = {
  /**
   * Helper method to handle HTTP requests
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMsg);
        error.status = response.status;
        error.errors = data.errors || null;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        const connError = new Error('Cannot connect to the backend server. Please verify the Express server is running on port 5000.');
        connError.status = 0;
        throw connError;
      }
      throw error;
    }
  },

  /**
   * Check system and MongoDB Atlas health status
   */
  async checkHealth() {
    return this.request('/health');
  },

  /**
   * Fetch aggregate statistics for the dashboard
   */
  async getStats() {
    return this.request('/stats');
  },

  /**
   * Fetch paginated and filtered list of students
   * @param {Object} params { page, limit, search, department, yearOfStudy }
   */
  async getStudents(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.yearOfStudy && params.yearOfStudy !== 'All') query.append('yearOfStudy', params.yearOfStudy);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/students${queryString}`);
  },

  /**
   * Fetch a single student by Mongo _id or custom studentId
   * @param {string} id 
   */
  async getStudentById(id) {
    return this.request(`/students/${encodeURIComponent(id)}`);
  },

  /**
   * Create a new student record
   * @param {Object} studentData 
   */
  async createStudent(studentData) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  /**
   * Update an existing student record
   * @param {string} id 
   * @param {Object} studentData 
   */
  async updateStudent(id, studentData) {
    return this.request(`/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  /**
   * Delete a student record
   * @param {string} id 
   */
  async deleteStudent(id) {
    return this.request(`/students/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  }
};

window.api = api;
