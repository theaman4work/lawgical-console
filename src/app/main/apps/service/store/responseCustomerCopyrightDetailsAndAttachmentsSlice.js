import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getResponseCustomerCopyrightDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerCopyrightDetailsAndAttachments/getResponseCustomerCopyrightDetailsAndAttachments',
	async () => {
		const email = localStorage.getItem('lg_logged_in_email');
		const response = await axiosInstance.get(
			`/services/lgrest/api/customer-copyright-details/get-all-for-customer/${email}`
		);
		const data = await response.data;

		return data;
	}
);

export const addResponseCustomerCopyrightDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerCopyrightDetailsAndAttachments/addResponseCustomerCopyrightDetailsAndAttachments',
	async (requestCustomerCopyrightDetailsAddDTO, { dispatch }) => {
		const response = await axiosInstance.post(
			'/services/lgrest/api/customer-copyright-details/add-new-record-for-customer',
			requestCustomerCopyrightDetailsAddDTO
		);
		const data = await response.data;

		dispatch(getResponseCustomerCopyrightDetailsAndAttachments());

		return data;
	}
);

export const updateResponseCustomerCopyrightDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerCopyrightDetailsAndAttachments/updateResponseCustomerCopyrightDetailsAndAttachments',
	async (requestCustomerCopyrightDetailsAddDTO, { dispatch }) => {
		const response = await axiosInstance.put(
			'/services/lgrest/api/customer-copyright-details/update-single-record',
			requestCustomerCopyrightDetailsAddDTO
		);
		const data = await response.data;

		dispatch(getResponseCustomerCopyrightDetailsAndAttachments());

		return data;
	}
);

export const removeResponseCustomerCopyrightDetailsAndAttachment = createAsyncThunk(
	'servicesApp/responseCustomerCopyrightDetailsAndAttachments/removeResponseCustomerTrademarkDetailsAndAttachment',
	async (customerCopyrightkDetailId, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/customer-copyright-details/inactivate-records-for-customer',
			customerCopyrightkDetailId
		);

		return customerCopyrightkDetailId;
	}
);

export const removeResponseCustomerCopyrightDetailsAndAttachments = createAsyncThunk(
	'servicesApp/responseCustomerCopyrightDetailsAndAttachments/removeResponseCustomerTrademarkDetailsAndAttachment',
	async (customerCopyrightkDetailIds, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/customer-copyright-details/inactivate-records-for-customer',
			customerCopyrightkDetailIds
		);
		return customerCopyrightkDetailIds;
	}
);

const responseCustomerCopyrightDetailsAndAttachmentsAdapter = createEntityAdapter({});

export const {
	selectAll: selectResponseCustomerCopyrightDetailsAndAttachments,
	selectById: selectResponseCustomerCopyrightDetailsAndAttachmentsById
} = responseCustomerCopyrightDetailsAndAttachmentsAdapter.getSelectors(
	state => state.servicesApp.responseCustomerCopyrightDetailsAndAttachments
);

const responseCustomerCopyrightDetailsAndAttachmentsSlice = createSlice({
	name: 'servicesApp/responseCustomerCopyrightDetailsAndAttachments',
	initialState: responseCustomerCopyrightDetailsAndAttachmentsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		// [updateApplicant.fulfilled]: responseCustomerTrademarkDetailsAndAttachmentsAdapter.upsertOne,
		[addResponseCustomerCopyrightDetailsAndAttachments.fulfilled]:
			responseCustomerCopyrightDetailsAndAttachmentsAdapter.addOne,
		[removeResponseCustomerCopyrightDetailsAndAttachments.fulfilled]: (state, action) =>
			responseCustomerCopyrightDetailsAndAttachmentsAdapter.removeMany(state, action.payload),
		[removeResponseCustomerCopyrightDetailsAndAttachment.fulfilled]: (state, action) =>
			responseCustomerCopyrightDetailsAndAttachmentsAdapter.removeOne(state, action.payload),
		[updateResponseCustomerCopyrightDetailsAndAttachments.fulfilled]:
			responseCustomerCopyrightDetailsAndAttachmentsAdapter.upsertOne,
		[getResponseCustomerCopyrightDetailsAndAttachments.fulfilled]:
			responseCustomerCopyrightDetailsAndAttachmentsAdapter.setAll
	}
});

export default responseCustomerCopyrightDetailsAndAttachmentsSlice.reducer;