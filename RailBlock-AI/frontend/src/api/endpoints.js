import client from './client';

export const authAPI = {
  login: (username, password) => client.post('/auth/login', { username, password }),
  refresh: (refreshToken) => client.post('/auth/refresh', { refresh_token: refreshToken }),
  getProfile: () => client.get('/auth/me'),
};

export const trainsAPI = {
  getTrains: (params) => client.get('/trains', { params }),
  getTrainDetails: (trainNumber) => client.get(`/trains/${trainNumber}`),
  getStations: (params) => client.get('/stations', { params }),
  getTrackSections: (params) => client.get('/track-sections', { params }),
};

export const assetsAPI = {
  getAssets: (params) => client.get('/assets', { params }),
  getAssetById: (id) => client.get(`/assets/${id}`),
};

export const maintenanceAPI = {
  getOverview: (params) => client.get('/maintenance', { params }),
  createRequest: (data) => client.post('/maintenance', data),
};

export const blockPlansAPI = {
  generate: (data) => client.post('/block-plans/generate', data),
  getPlans: (params) => client.get('/block-plans', { params }),
  getPlanById: (id) => client.get(`/block-plans/${id}`),
  getPlanComparison: (id) => client.get(`/block-plans/${id}/compare`),
  whatIfAnalysis: (data) => client.post('/block-plans/what-if', data),
};

export const predictionsAPI = {
  predictDelay: (data) => client.post('/predictions/delay', data),
  predictAssetRisk: (data) => client.post('/predictions/asset-risk', data),
};

export const optimizationAPI = {
  run: (data) => client.post('/optimization/run', data),
};

export const analyticsAPI = {
  getOverview: () => client.get('/analytics/overview'),
  getAlerts: () => client.get('/analytics/alerts'),
  getDataStatus: () => client.get('/analytics/data-status'),
};

export const healthAPI = {
  check: () => client.get('/health'),
};
