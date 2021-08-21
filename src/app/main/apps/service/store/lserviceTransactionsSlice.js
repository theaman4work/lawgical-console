import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';

export const getServiceTransactions = createAsyncThunk(
	'servicesApp/serviceTransactions/getServiceTransactions',
	async () => {
		const response = await axiosInstance.post('/services/lgrest/api/lservice-transactions/get-all-for-customer', {
			email: localStorage.getItem('lg_logged_in_email'),
			roleType: 'CUSTOMER'
		});
		const data = await response.data;

		return data;
	}
);

const serviceTransactionsAdapter = createEntityAdapter({});

export const {
	selectAll: selectServiceTransactions,
	selectById: selectServiceTransactionById
} = serviceTransactionsAdapter.getSelectors(state => state.servicesApp.serviceTransactions);

const lserviceTransactionsSlice = createSlice({
	name: 'servicesApp/serviceTransactions',
	initialState: serviceTransactionsAdapter.getInitialState({
		labelForServiceTransactionDialog: {
			type: 'edit',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openLabelForServiceTransactionDialog: (state, action) => {
			state.labelForServiceTransactionDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeLabelForServiceTransactionDialog: (state, action) => {
			state.labelForServiceTransactionDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[getServiceTransactions.fulfilled]: serviceTransactionsAdapter.setAll
	}
});

export const {
	openLabelForServiceTransactionDialog,
	closeLabelForServiceTransactionDialog
} = lserviceTransactionsSlice.actions;

export default lserviceTransactionsSlice.reducer;
