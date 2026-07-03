import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000
})

api.interceptors.request.use(config => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  } catch {}
  return config
})

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data || err.message)
)

export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data)
}

export const studentAPI = {
  getProfile: (id) => api.get(`/api/students/profile/${id}`),
  updateProfile: (id, data) => api.put(`/api/students/profile/${id}`, data),
  uploadResume: (id, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/api/students/upload-resume/${id}`, form)
  },
  getSkillGap: (id) => api.get(`/api/students/skill-gap/${id}`)
}

export const jobAPI = {
  list: (params) => api.get('/api/jobs/', { params }),
  get: (id) => api.get(`/api/jobs/${id}`),
  getMatched: (studentId) => api.get(`/api/jobs/match/${studentId}`),
  atsCheck: (jobId, studentId) => api.get(`/api/jobs/ats-check/${jobId}`, { params: { student_id: studentId } })
}

export const applicationAPI = {
  apply: (data) => api.post('/api/applications/apply', data),
  getMyApplications: (studentId) => api.get(`/api/applications/student/${studentId}`),
  updateStatus: (id, status) => api.put(`/api/applications/status/${id}`, null, { params: { status } })
}

export const analyticsAPI = {
  getStats: () => api.get('/api/analytics/placement-stats'),
  getSkillTrends: () => api.get('/api/analytics/skill-trends'),
  getInterviewReadiness: (id) => api.get(`/api/analytics/interview-readiness/${id}`)
}

export default api
