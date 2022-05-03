import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getResponseDocumentReviewAndAttachments = createAsyncThunk(
	'servicesApp/responseDocumentReviewAndAttachments/getResponseDocumentReviewAndAttachments',
	async (lserviceStageTransactionId, { dispatch }) => {
		const response = await axiosInstance.get(
			// `/services/lgrest/api/document-reviews/get-all-for-lservice-stage-transaction/${lserviceStageTransactionId}`
			`/services/lgrest/api/document-reviews/get-all-tm-doc-reviews-for-lservice-stage-transaction/${lserviceStageTransactionId}`
		);
		const data = await response.data;

		return data;
	}
);

const responseDocumentReviewAndAttachmentsAdapter = createEntityAdapter({});

export const {
	selectAll: selectResponseDocumentReviewAndAttachments,
	selectById: selectResponseDocumentReviewAndAttachmentsById
} = responseDocumentReviewAndAttachmentsAdapter.getSelectors(
	state => state.servicesApp.responseDocumentReviewAndAttachments
);

const responseDocumentReviewAndAttachmentsSlice = createSlice({
	name: 'servicesApp/responseDocumentReviewAndAttachments',
	initialState: responseDocumentReviewAndAttachmentsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getResponseDocumentReviewAndAttachments.fulfilled]: responseDocumentReviewAndAttachmentsAdapter.setAll
	}
});

export default responseDocumentReviewAndAttachmentsSlice.reducer;
