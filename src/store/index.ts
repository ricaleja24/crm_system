import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import leadsSlice from './slices/leadsSlice';
import contactsSlice from './slices/contactsSlice';
import companiesSlice from './slices/companiesSlice';
import opportunitiesSlice from './slices/opportunitiesSlice';
import tasksSlice from './slices/tasksSlice';
import activitiesSlice from './slices/activitiesSlice';
import campaignsSlice from './slices/campaignsSlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    leads: leadsSlice,
    contacts: contactsSlice,
    companies: companiesSlice,
    opportunities: opportunitiesSlice,
    tasks: tasksSlice,
    activities: activitiesSlice,
    campaigns: campaignsSlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;