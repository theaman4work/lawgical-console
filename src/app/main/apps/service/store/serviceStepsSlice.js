import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getData = createAsyncThunk('servicesApp/serviceSteps/getData', async params => {
	const response = await axiosInstance.post(
		'/services/lgrest/api/lservice-stage-transactions/get-service-steps-for-user',
		{
			email: localStorage.getItem('lg_logged_in_email'),
			lserviceId: params.lserviceId,
			lserviceTransactionId: params.lserviceTransactionId ? params.lserviceTransactionId : 0
		}
	);
	const data = await response.data;
	return data || null;
});

export const updateData = createAsyncThunk('servicesApp/serviceSteps/updateData', async (_data, { dispatch }) => {
	const response = await axiosInstance.post(
		'/services/lgrest/api/lservice-stage-transactions/create-transaction-for-customer',
		{ email: localStorage.getItem('lg_logged_in_email'), ..._data }
	);
	const data = await response.data;

	dispatch(showMessage({ message: 'Step data Saved' }));

	return data;
});

export const updateLserviceTransactionData = createAsyncThunk(
	'servicesApp/serviceSteps/updateLserviceTransactionData',
	async _data => {
		const response = await axiosInstance.put(
			'/services/lgrest/api/lservice-transactions/set-change-label-for-user',
			{ ..._data }
		);
		const data = await response.data;
		return data;
	}
);

const serviceStepsSlice = createSlice({
	name: 'servicesApp/serviceSteps',
	initialState: {
		currentStageCountForUser: 1,
		customerDTO: {},
		errorCode: 0,
		errorMessage: '',
		lserviceCostDTO: {},
		lserviceDTO: {},
		lserviceStageDTOs: [],
		lserviceStageTransactionDTOs: [],
		lserviceTransactionDTO: {},
		stageDTOs: [],
		stageLongContentDTOs: [],
		govtChargesForLserviceDTO: {},
		govtChargesWithTypesDTOs: []
	},
	reducers: {},
	extraReducers: {
		[getData.fulfilled]: (state, action) => action.payload,
		[updateData.fulfilled]: (state, action) => {
			if (action.payload.lserviceTransactionDTO !== null) {
				state.lserviceTransactionDTO = action.payload.lserviceTransactionDTO;
			}
			state.lserviceStageTransactionDTOs.push(action.payload.lserviceStageTransactionDTO);
			state.labelForServiceTransactionDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		[updateLserviceTransactionData.fulfilled]: (state, action) => {
			if (action.payload.lserviceTransactionDTO !== null) {
				state.lserviceTransactionDTO = action.payload;
			}
			// if (action.payload.currentStageCountForUser !== null) {
			// 	state.currentStageCountForUser = action.payload.currentStageCountForUser;
			// }
			state.labelForServiceTransactionDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	}
});

export const {
	openLabelForServiceTransactionDialog,
	closeLabelForServiceTransactionDialog
} = serviceStepsSlice.actions;

export default serviceStepsSlice.reducer;
