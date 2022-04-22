import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getResponseCustomerCopyrightDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerTrademarkDetailsAndAttachments/getResponseCustomerTrademarkDetailsAndAttachments',
	async () => {
		const email = localStorage.getItem('lg_logged_in_email');
		const response = await axiosInstance.get(
			`/services/lgrest/api/customer-trademark-details/get-all-for-customer/${email}`
		);
		const data = await response.data;

		return data;
	}
);

export const addResponseCustomerTrademarkDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerTrademarkDetailsAndAttachments/addResponseCustomerTrademarkDetailsAndAttachments',
	async (requestCustomerTrademarkDetailsAddDTO, { dispatch }) => {
		const response = await axiosInstance.post(
			'/services/lgrest/api/customer-trademark-details/add-new-record-for-customer',
			requestCustomerTrademarkDetailsAddDTO
		);
		const data = await response.data;

		dispatch(getResponseCustomerTrademarkDetailsAndAttachments());

		return data;
	}
);

export const updateResponseCustomerTrademarkDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerTrademarkDetailsAndAttachments/updateResponseCustomerTrademarkDetailsAndAttachments',
	async (requestCustomerTrademarkDetailsAddDTO, { dispatch }) => {
		const response = await axiosInstance.put(
			'/services/lgrest/api/customer-trademark-details/update-single-record',
			requestCustomerTrademarkDetailsAddDTO
		);
		const data = await response.data;

		dispatch(getResponseCustomerTrademarkDetailsAndAttachments());

		return data;
	}
);

export const removeResponseCustomerTrademarkDetailsAndAttachment = createAsyncThunk(
	'servicesApp/responseCustomerTrademarkDetailsAndAttachments/removeResponseCustomerTrademarkDetailsAndAttachment',
	async (customerTrademarkDetailId, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/customer-trademark-details/inactivate-records-for-customer',
			customerTrademarkDetailId
		);

		return customerTrademarkDetailId;
	}
);

export const removeResponseCustomerTrademarkDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerTrademarkDetailsAndAttachments/removeResponseCustomerTrademarkDetailsAndAttachment',
	async (customerTrademarkDetailIds, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/customer-trademark-details/inactivate-records-for-customer',
			customerTrademarkDetailIds
		);
		return customerTrademarkDetailIds;
	}
);

const responseCustomerTrademarkDetailsAndAttachmentsAdapter = createEntityAdapter({});

export const {
	selectAll: selectResponseCustomerTrademarkDetailsAndAttachments,
	selectById: selectResponseCustomerTrademarkDetailsAndAttachmentsById
} = responseCustomerTrademarkDetailsAndAttachmentsAdapter.getSelectors(
	state => state.servicesApp.responseCustomerTrademarkDetailsAndAttachments
);

const responseCustomerCopyrightDetailsAndAttachmentsSlice = createSlice({
	name: 'servicesApp/responseCustomerTrademarkDetailsAndAttachments',
	initialState: responseCustomerTrademarkDetailsAndAttachmentsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		// [updateApplicant.fulfilled]: responseCustomerTrademarkDetailsAndAttachmentsAdapter.upsertOne,
		[addResponseCustomerTrademarkDetailsAndAttachments.fulfilled]:
			responseCustomerTrademarkDetailsAndAttachmentsAdapter.addOne,
		[removeResponseCustomerTrademarkDetailsAndAttachments.fulfilled]: (state, action) =>
			responseCustomerTrademarkDetailsAndAttachmentsAdapter.removeMany(state, action.payload),
		[removeResponseCustomerTrademarkDetailsAndAttachment.fulfilled]: (state, action) =>
			responseCustomerTrademarkDetailsAndAttachmentsAdapter.removeOne(state, action.payload),
		[updateResponseCustomerTrademarkDetailsAndAttachments.fulfilled]:
			responseCustomerTrademarkDetailsAndAttachmentsAdapter.upsertOne,
		[getResponseCustomerTrademarkDetailsAndAttachments.fulfilled]:
			responseCustomerTrademarkDetailsAndAttachmentsAdapter.setAll
	}
});

export default responseCustomerCopyrightDetailsAndAttachmentsSlice.reducer;