import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getServices = createAsyncThunk('servicesApp/productServices/getServices', async () => {
	const response = await axiosInstance.get('/services/lgrest/api/lservices');
	const data = await response.data;

	return data;
});

const servicesAdapter = createEntityAdapter({});

export const { selectAll: selectServices, selectById: selectServiceById } = servicesAdapter.getSelectors(
	state => state.servicesApp.services
);

const servicesSlice = createSlice({
	name: 'servicesApp/productServices',
	initialState: servicesAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getServices.fulfilled]: servicesAdapter.setAll
	}
});

export default servicesSlice.reducer;
