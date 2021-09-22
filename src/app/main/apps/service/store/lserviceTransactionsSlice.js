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

export const removeServiceTransaction = createAsyncThunk(
	'servicesApp/serviceTransactions/removeServiceTransaction',
	async (lserviceTransactionId, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/lservice-transactions/inactivate-records-for-customer',
			lserviceTransactionId
		);

		return lserviceTransactionId;
	}
);

export const removeServiceTransactions = createAsyncThunk(
	'servicesApp/serviceTransactions/removeServiceTransactions',
	async (lserviceTransactionIds, { dispatch, getState }) => {
		await axiosInstance.put(
			'/services/lgrest/api/lservice-transactions/inactivate-records-for-customer',
			lserviceTransactionIds
		);
		return lserviceTransactionIds;
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
		[getServiceTransactions.fulfilled]: serviceTransactionsAdapter.setAll,
		[removeServiceTransaction.fulfilled]: (state, action) =>
			serviceTransactionsAdapter.removeOne(state, action.payload),
		[removeServiceTransactions.fulfilled]: (state, action) =>
			serviceTransactionsAdapter.removeMany(state, action.payload)
	}
});

export const {
	openLabelForServiceTransactionDialog,
	closeLabelForServiceTransactionDialog
} = lserviceTransactionsSlice.actions;

export default lserviceTransactionsSlice.reducer;
