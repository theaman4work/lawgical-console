import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getProducts = createAsyncThunk('projectDashboardApp/products/getProducts', async () => {
	const response = await axiosInstance.get('/services/lgrest/api/products');
	const data = await response.data;

	return data;
});

const productsAdapter = createEntityAdapter({});

export const { selectEntities: selectProducts, selectById: selectProductById } = productsAdapter.getSelectors(
	state => state.projectDashboardApp.products
);

const productsSlice = createSlice({
	name: 'projectDashboardApp/products',
	initialState: productsAdapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getProducts.fulfilled]: productsAdapter.setAll
	}
});

export default productsSlice.reducer;
