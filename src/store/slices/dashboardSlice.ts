import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface DashboardMetrics {
  leads: {
    total: number;
    new: number;
    qualified: number;
    converted: number;
    conversionRate: string;
  };
  opportunities: {
    total: number;
    active: number;
    pipelineValue: number;
    wonThisMonth: number;
  };
  tasks: {
    pending: number;
    overdue: number;
  };
}

interface ChartData {
  pipelineByStage: Array<{
    stage: string;
    count: number;
    value: number;
  }>;
  leadsByStatus: Array<{
    status: string;
    count: number;
  }>;
}

interface Activity {
  id: string;
  type: string;
  subject: string;
  description: string;
  createdAt: string;
  creator: {
    firstName: string;
    lastName: string;
  };
}

interface DashboardState {
  metrics: DashboardMetrics | null;
  charts: ChartData | null;
  recentActivities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  charts: null,
  recentActivities: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics;
        state.charts = action.payload.charts;
        state.recentActivities = action.payload.recentActivities;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;