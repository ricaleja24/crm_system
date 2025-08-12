import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'Social Media' | 'Direct Mail' | 'Event' | 'Webinar' | 'Other';
  status: 'Draft' | 'Scheduled' | 'Active' | 'Paused' | 'Completed';
  subject?: string;
  content?: string;
  targetAudience?: any;
  scheduledDate?: string;
  sentDate?: string;
  createdBy?: string;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  createdAt: string;
  updatedAt: string;
  creator?: {
    firstName: string;
    lastName: string;
  };
}

interface CampaignsState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: CampaignsState = {
  campaigns: [],
  currentCampaign: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (params: any = {}) => {
    const response = await api.get('/campaigns', { params });
    return response.data;
  }
);

export const fetchCampaignById = createAsyncThunk(
  'campaigns/fetchCampaignById',
  async (id: string) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (campaignData: Partial<Campaign>) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data;
  }
);

export const updateCampaign = createAsyncThunk(
  'campaigns/updateCampaign',
  async ({ id, data }: { id: string; data: Partial<Campaign> }) => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
  }
);

export const deleteCampaign = createAsyncThunk(
  'campaigns/deleteCampaign',
  async (id: string) => {
    await api.delete(`/campaigns/${id}`);
    return id;
  }
);

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearCurrentCampaign: (state) => {
      state.currentCampaign = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.campaigns;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.currentCampaign = action.payload;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.campaigns.unshift(action.payload);
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        const index = state.campaigns.findIndex(campaign => campaign.id === action.payload.id);
        if (index !== -1) {
          state.campaigns[index] = action.payload;
        }
        if (state.currentCampaign?.id === action.payload.id) {
          state.currentCampaign = action.payload;
        }
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter(campaign => campaign.id !== action.payload);
      });
  },
});

export const { clearCurrentCampaign, clearError } = campaignsSlice.actions;
export default campaignsSlice.reducer;