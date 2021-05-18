import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getData = createAsyncThunk('servicesApp/serviceSteps/getData', async params => {
	const response = await axiosInstance.post(
		'/services/lgrest/api/lservice-stage-transactions/get-service-steps-for-user',
		{ email: localStorage.getItem('lg_logged_in_email'), lserviceId: params.lserviceId }
	);
	const data = await response.data;
	return data;
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

const serviceStepsSlice = createSlice({
	name: 'servicesApp/serviceSteps',
	initialState: null,
	reducers: {},
	extraReducers: {
		[getData.fulfilled]: (state, action) => action.payload,
		[updateData.fulfilled]: (state, action) => ({
			...state,
			...action.payload
		})
	}
});

export default serviceStepsSlice.reducer;
