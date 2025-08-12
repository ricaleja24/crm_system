import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  companyId?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  source?: string;
  assignedTo?: string;
  score: number;
  estimatedValue?: number;
  expectedCloseDate?: string;
  tags: string[];
  notes?: string;
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

interface LeadsState {
  leads: Lead[];
  currentLead: Lead | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: LeadsState = {
  leads: [],
  currentLead: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (params: any = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  }
);

export const fetchLeadById = createAsyncThunk(
  'leads/fetchLeadById',
  async (id: string) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData: Partial<Lead>) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, data }: { id: string; data: Partial<Lead> }) => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id: string) => {
    await api.delete(`/leads/${id}`);
    return id;
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch leads';
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.currentLead = action.payload;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload;
        }
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter(lead => lead.id !== action.payload);
      });
  },
});

export const { clearCurrentLead, clearError } = leadsSlice.actions;
export default leadsSlice.reducer;