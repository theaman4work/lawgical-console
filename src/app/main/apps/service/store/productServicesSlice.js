import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getProductServices = createAsyncThunk('servicesApp/productServices/getProductServices', async () => {
	const response = await axiosInstance.get('/services/lgrest/api/product-lservices');
	const data = await response.data;

	return data;
});

const productServicesAdapter = createEntityAdapter({});

export const {
	selectAll: selectProductServices,
	selectById: selectProductServiceById
} = productServicesAdapter.getSelectors(state => state.servicesApp.productServices);

const productServicesSlice = createSlice({
	name: 'servicesApp/productServices',
	initialState: productServicesAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getProductServices.fulfilled]: productServicesAdapter.setAll
	}
});

export default productServicesSlice.reducer;
