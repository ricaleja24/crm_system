import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note' | 'Task' | 'Deal Update' | 'Status Change';
  subject: string;
  description?: string;
  duration?: number;
  outcome?: string;
  createdBy?: string;
  contactId?: string;
  leadId?: string;
  opportunityId?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    firstName: string;
    lastName: string;
  };
  contact?: {
    firstName: string;
    lastName: string;
  };
  lead?: {
    firstName: string;
    lastName: string;
  };
  opportunity?: {
    name: string;
  };
}

interface ActivitiesState {
  activities: Activity[];
  currentActivity: Activity | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: ActivitiesState = {
  activities: [],
  currentActivity: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (params: any = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
  }
);

export const fetchActivityById = createAsyncThunk(
  'activities/fetchActivityById',
  async (id: string) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  }
);

export const createActivity = createAsyncThunk(
  'activities/createActivity',
  async (activityData: Partial<Activity>) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  }
);

export const updateActivity = createAsyncThunk(
  'activities/updateActivity',
  async ({ id, data }: { id: string; data: Partial<Activity> }) => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
  }
);

export const deleteActivity = createAsyncThunk(
  'activities/deleteActivity',
  async (id: string) => {
    await api.delete(`/activities/${id}`);
    return id;
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    clearCurrentActivity: (state) => {
      state.currentActivity = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.activities;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.currentActivity = action.payload;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.activities.findIndex(activity => activity.id === action.payload.id);
        if (index !== -1) {
          state.activities[index] = action.payload;
        }
        if (state.currentActivity?.id === action.payload.id) {
          state.currentActivity = action.payload;
        }
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter(activity => activity.id !== action.payload);
      });
  },
});

export const { clearCurrentActivity, clearError } = activitiesSlice.actions;
export default activitiesSlice.reducer;