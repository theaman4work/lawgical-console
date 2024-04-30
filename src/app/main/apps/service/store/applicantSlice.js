import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { axiosInstance } from 'app/auth-service/axiosInstance';
import { actions } from 'react-table';

export const getApplicants = createAsyncThunk('servicesApp/applicants/getApplicants', async () => {
	const email = localStorage.getItem('lg_logged_in_email');
	const response = await axiosInstance.get(`/services/lgrest/api/applicants/get-all-for-customer/${email}`, {});
	const data = await response.data;

	return data || null;
});

export const addApplicant = createAsyncThunk(
	'servicesApp/applicants/addApplicant',
	async (applicantAndAddressDTO, { dispatch }) => {
		const response = await axiosInstance.post(
			'/services/lgrest/api/applicants/add-new-applicant-for-customer',
			applicantAndAddressDTO
		);
		const data = await response.data;

		dispatch(getApplicants());

		return data;
	}
);

export const updateApplicant = createAsyncThunk(
	'servicesApp/applicants/updateApplicant',
	async (applicantAndAddressDTO, { dispatch }) => {
		const response = await axiosInstance.put(
			'/services/lgrest/api/applicants/update-applicant-for-customer',
			applicantAndAddressDTO
		);
		const data = await response.data;
		console.log(data);
		dispatch(getApplicants());

		return data;
		
	}
);


export const removeApplicant = createAsyncThunk(
	'servicesApp/applicants/removeApplicant',
	async (applicantId, { dispatch, getState }) => {
		await axiosInstance.put('/services/lgrest/api/applicants/inactivate-applicants-for-customer', applicantId);
		return applicantId;
	}
);

export const removeApplicants = createAsyncThunk(
	'servicesApp/applicants/removeApplicants',
	async (applicantIds, { dispatch, getState }) => {
		await axiosInstance.put('/services/lgrest/api/applicants/inactivate-applicants-for-customer', applicantIds);
		return applicantIds;
	}
);

export const setApplicantsForLserviceTransaction = createAsyncThunk(
	'servicesApp/applicants/setApplicantsForLserviceTransaction',
	async (applicantsSelectedForLserviceTransactionRequestDTO, { dispatch }) => {
		const response = await axiosInstance.post(
			'/services/lgrest/api/applicants/save-applicants-for-lserviceTransaction',
			applicantsSelectedForLserviceTransactionRequestDTO
		);
		const dataTemp = await response.data;

		const data = await dispatch(getApplicants());

		return data;
	}
);

const applicantsAdapter = createEntityAdapter({});
console.log(applicantsAdapter);

export const { selectAll: selectApplicants, selectById: selectApplicantsById } = applicantsAdapter.getSelectors(
	state => state.servicesApp.applicants
);

const applicantsSlice = createSlice({
	name: 'servicesApp/applicants',
	initialState: applicantsAdapter.getInitialState({
		applicantDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewApplicantDialog: (state, action) => {
			state.applicantDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewApplicantDialog: (state, action) => {
			state.applicantDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditApplicantDialog: (state, action) => {
			state.applicantDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditApplicantDialog: (state, action) => {
			state.applicantDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		[updateApplicant.fulfilled]: applicantsAdapter.upsertOne,
		[addApplicant.fulfilled]: applicantsAdapter.addOne,
		[removeApplicants.fulfilled]: (state, action) => applicantsAdapter.removeMany(state, action.payload),
		[removeApplicant.fulfilled]: (state, action) => applicantsAdapter.removeOne(state, action.payload),
		[getApplicants.fulfilled]: applicantsAdapter.setAll
	}
});

export const {
	openNewApplicantDialog,
	closeNewApplicantDialog,
	openEditApplicantDialog,
	closeEditApplicantDialog
} = applicantsSlice.actions;

console.log(applicantsSlice.actions)
export default applicantsSlice.reducer;
