import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getCustomerDashboardStats = createAsyncThunk(
	'projectDashboardApp/customerDashboardStats/getCustomerDashboardStats',
	async () => {
		const email = localStorage.getItem('lg_logged_in_email');
		const response = await axiosInstance.get(
			`/services/lgrest/api/lservice-stage-transactions/get-dashboard-stats-for-customer/${email}`
		);
		const data = await response.data;

		return data;
	}
);

const customerDashboardStatsAdapter = createEntityAdapter({});

export const {
	selectAll: selectCustomerDashboardStats,
	selectById: selectCustomerDashboardStatById
} = customerDashboardStatsAdapter.getSelectors(state => state.projectDashboardApp.customerDashboardStats);

const customerDashboardStatsSlice = createSlice({
	name: 'projectDashboardApp/customerDashboardStats',
	initialState: customerDashboardStatsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getCustomerDashboardStats.fulfilled]: customerDashboardStatsAdapter.setAll
	}
});

export default customerDashboardStatsSlice.reducer;
