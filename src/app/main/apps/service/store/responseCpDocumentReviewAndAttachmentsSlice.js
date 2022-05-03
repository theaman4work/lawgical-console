import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getResponseCpDocumentReviewAndAttachments = createAsyncThunk(
	'servicesApp/responseCpDocumentReviewAndAttachments/getResponseCpDocumentReviewAndAttachments',
	async (lserviceStageTransactionId, { dispatch }) => {
		const response = await axiosInstance.get(
			`/services/lgrest/api/document-reviews/get-all-cpr-doc-reviews-for-lservice-stage-transaction/${lserviceStageTransactionId}`
		);
		const data = await response.data;

		return data;
	}
);

const responseCpDocumentReviewAndAttachmentsAdapter = createEntityAdapter({});

export const {
	selectAll: selectResponseCpDocumentReviewAndAttachments,
	selectById: selectResponseCpDocumentReviewAndAttachmentsById
} = responseCpDocumentReviewAndAttachmentsAdapter.getSelectors(
	state => state.servicesApp.responseDocumentReviewAndAttachments
);

const responseCpDocumentReviewAndAttachmentsSlice = createSlice({
	name: 'servicesApp/responseCpDocumentReviewAndAttachments',
	initialState: responseCpDocumentReviewAndAttachmentsAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getResponseCpDocumentReviewAndAttachments.fulfilled]: responseCpDocumentReviewAndAttachmentsAdapter.setAll
	}
});

export default responseCpDocumentReviewAndAttachmentsSlice.reducer;
