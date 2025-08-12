import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Opportunity {
  id: string;
  name: string;
  description?: string;
  value: number;
  stage: 'Prospecting' | 'Qualification' | 'Needs Analysis' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  companyId?: string;
  assignedTo?: string;
  source?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignedUser?: {
    firstName: string;
    lastName: string;
  };
  company?: {
    name: string;
  };
}

interface OpportunitiesState {
  opportunities: Opportunity[];
  currentOpportunity: Opportunity | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: OpportunitiesState = {
  opportunities: [],
  currentOpportunity: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  async (params: any = {}) => {
    const response = await api.get('/opportunities', { params });
    return response.data;
  }
);

export const fetchOpportunityById = createAsyncThunk(
  'opportunities/fetchOpportunityById',
  async (id: string) => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  }
);

export const createOpportunity = createAsyncThunk(
  'opportunities/createOpportunity',
  async (opportunityData: Partial<Opportunity>) => {
    const response = await api.post('/opportunities', opportunityData);
    return response.data;
  }
);

export const updateOpportunity = createAsyncThunk(
  'opportunities/updateOpportunity',
  async ({ id, data }: { id: string; data: Partial<Opportunity> }) => {
    const response = await api.put(`/opportunities/${id}`, data);
    return response.data;
  }
);

export const deleteOpportunity = createAsyncThunk(
  'opportunities/deleteOpportunity',
  async (id: string) => {
    await api.delete(`/opportunities/${id}`);
    return id;
  }
);

const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    clearCurrentOpportunity: (state) => {
      state.currentOpportunity = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.loading = false;
        state.opportunities = action.payload.opportunities;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch opportunities';
      })
      .addCase(fetchOpportunityById.fulfilled, (state, action) => {
        state.currentOpportunity = action.payload;
      })
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.opportunities.unshift(action.payload);
      })
      .addCase(updateOpportunity.fulfilled, (state, action) => {
        const index = state.opportunities.findIndex(opportunity => opportunity.id === action.payload.id);
        if (index !== -1) {
          state.opportunities[index] = action.payload;
        }
        if (state.currentOpportunity?.id === action.payload.id) {
          state.currentOpportunity = action.payload;
        }
      })
      .addCase(deleteOpportunity.fulfilled, (state, action) => {
        state.opportunities = state.opportunities.filter(opportunity => opportunity.id !== action.payload);
      });
  },
});

export const { clearCurrentOpportunity, clearError } = opportunitiesSlice.actions;
export default opportunitiesSlice.reducer;