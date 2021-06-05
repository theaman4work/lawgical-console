import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getCustomerTrademarkDetails = createAsyncThunk(
	'servicesApp/customerTrademarkDetails/getCustomerTrademarkDetails',
	async () => {
		const email = localStorage.getItem('lg_logged_in_email');
		const response = await axiosInstance.get(
			`/services/lgrest/api/customer-trademark-details/get-all-for-customer/${email}`
		);
		const data = await response.data;

		return data || null;
	}
);

export const addCustomerTrademarkDetails = createAsyncThunk(
	'servicesApp/customerTrademarkDetails/addCustomerTrademarkDetails',
	async (requestCustomerTrademarkDetailsAddDTO, { dispatch }) => {
		const response = await axiosInstance.post(
			'/services/lgrest/api/customer-trademark-details/add-new-record-for-customer',
			requestCustomerTrademarkDetailsAddDTO
		);
		const data = await response.data;

		dispatch(getCustomerTrademarkDetails());

		return data;
	}
);

export const removeCustomerTrademarkDetail = createAsyncThunk(
	'servicesApp/customerTrademarkDetails/removeCustomerTrademarkDetail',
	async (customerTrademarkDetailId, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/customer-trademark-details/inactivate-records-for-customer',
			customerTrademarkDetailId
		);

		return customerTrademarkDetailId;
	}
);

export const removeCustomerTrademarkDetails = createAsyncThunk(
	'servicesApp/customerTrademarkDetails/removeCustomerTrademarkDetail',
	async (customerTrademarkDetailIds, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/customer-trademark-details/inactivate-records-for-customer',
			customerTrademarkDetailIds
		);
		return customerTrademarkDetailIds;
	}
);

const customerTrademarkDetailsAdapter = createEntityAdapter({});

export const {
	selectAll: selectCustomerTrademarkDetails,
	selectById: selectCustomerTrademarkDetailsById
} = customerTrademarkDetailsAdapter.getSelectors(state => state.servicesApp.customerTrademarkDetails);

const customerTrademarkDetailsSlice = createSlice({
	name: 'servicesApp/customerTrademarkDetails',
	initialState: customerTrademarkDetailsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		// [updateApplicant.fulfilled]: customerTrademarkDetailsAdapter.upsertOne,
		[addCustomerTrademarkDetails.fulfilled]: customerTrademarkDetailsAdapter.addOne,
		[removeCustomerTrademarkDetails.fulfilled]: (state, action) =>
			customerTrademarkDetailsAdapter.removeMany(state, action.payload),
		[removeCustomerTrademarkDetail.fulfilled]: (state, action) =>
			customerTrademarkDetailsAdapter.removeOne(state, action.payload),
		[getCustomerTrademarkDetails.fulfilled]: customerTrademarkDetailsAdapter.setAll
	}
});

export default customerTrademarkDetailsSlice.reducer;
