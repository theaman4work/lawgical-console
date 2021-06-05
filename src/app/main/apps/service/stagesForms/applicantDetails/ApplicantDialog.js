import FuseUtils from '@fuse/utils/FuseUtils';
import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import {
	removeApplicant,
	updateApplicant,
	addApplicant,
	closeNewApplicantDialog,
	closeEditApplicantDialog
} from '../../store/applicantSlice';
import { countriesList, statesList } from '../countriesAndStatesList';

const defaultValues = {
	id: '',
	name: '',
	contactPhoneNo: '',
	contactEmail: '',
	avatar: 'assets/images/avatars/profile.jpg',
	nationality: '',
	type: '',
	addressId: '',
	addressLine1: '',
	addressLine2: '',
	pincode: '',
	city: '',
	state: '',
	country: '',
	createdOn: '',
	addressCreatedOn: ''
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().max(50, 'Name should not exceed 50 characters').required('You must enter a Name'),
	contactPhoneNo: yup
		.string()
		.matches(phoneRegExp, 'You must enter a valid Phone number')
		.max(15, 'Phone number must be less than or equal to 15 digits')
		.required('You must enter a Phone number'),
	contactEmail: yup
		.string()
		.email('You must enter a valid email')
		.max(250, 'Email must be less than or equal to 250 characters')
		.required('You must enter a email'),
	addressLine1: yup.string().required('You must enter a Address Line1'),
	pincode: yup
		.string()
		.matches(/^[0-9]+$/, 'Pincode must contain digits only')
		.test('len', 'Pincode must be exactly 6 digits', val => val.length === 6)
		.required('You must enter a Pincode'),
	city: yup.string().max(200, 'City must be less than or equal to 200 characters').required('You must enter a City'),
	nationality: yup.string().required('You must enter a Nationality'),
	country: yup.string().required('You must enter a Country').nullable(),
	state: yup
		.string()
		.when('country', { is: 'India', then: yup.string().required('You must enter a State').nullable() })
});

function ApplicantDialog(props) {
	const countriesListForCountryDropDown = countriesList;
	const statesListForStatesDropDown = statesList;

	const [showState, setShowState] = useState(false);
	const dispatch = useDispatch();
	const applicantDialog = useSelector(({ servicesApp }) => servicesApp.applicants.applicantDialog);

	const { control, watch, reset, handleSubmit, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const id = watch('id');
	const name = watch('name');
	const avatar = watch('avatar');

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (applicantDialog.type === 'edit' && applicantDialog.data) {
			if (applicantDialog.data.country !== null) {
				if (applicantDialog.data.country === 'India') {
					setShowState(true);
				} else {
					setShowState(false);
				}
			}
			reset({ ...applicantDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (applicantDialog.type === 'new') {
			reset({
				...defaultValues,
				...applicantDialog.data,
				id: FuseUtils.generateGUID()
			});
		}
	}, [applicantDialog.data, applicantDialog.type, reset, setShowState]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (applicantDialog.props.open) {
			initDialog();
		}
	}, [applicantDialog.props.open, initDialog]);

	/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return applicantDialog.type === 'edit'
			? dispatch(closeEditApplicantDialog())
			: dispatch(closeNewApplicantDialog());
	}

	/**
	 * Form Submit
	 */
	function onSubmit(data) {
		const applicantDTO = {
			contactEmail: data.contactEmail,
			contactPhoneNo: data.contactPhoneNo,
			// gSTNo: data.gSTNo,
			name: data.name,
			nationality: data.nationality,
			// pANNo: data.pANNo,
			status: 'ACTIVE'
			// website: data.website
		};
		if (data.type !== null || data.type !== '') {
			applicantDTO[`'type'`] = data.type;
		}
		const addressDTO = {
			addressLine1: data.addressLine1,
			addressLine2: data.addressLine2,
			city: data.city,
			country: data.country,
			// landmark: data.landmark,
			pincode: data.pincode,
			state: data.state,
			status: 'ACTIVE'
		};

		if (applicantDialog.type === 'new') {
			const reqData = {
				applicantDTO,
				addressDTO,
				email: localStorage.getItem('lg_logged_in_email')
			};

			dispatch(addApplicant(reqData));
		} else {
			// edit applicant
			// console.log('edit applicant- data');
			// console.log(data);
			// console.log('edit applicant- applicantDialogdata');
			// console.log(applicantDialog.data);
			applicantDTO.id = data.id;
			applicantDTO.createdOn = data.createdOn;

			addressDTO.id = data.addressId;
			addressDTO.createdOn = data.addressCreatedOn;

			const reqData = {
				applicantDTO,
				addressDTO,
				email: localStorage.getItem('lg_logged_in_email'),
				id: data.id
			};
			// console.log('udpateApplicant- applicantDialog.data');
			// console.log(applicantDialog.data);
			// console.log('udpateApplicant- data');
			// console.log(data);
			dispatch(updateApplicant(reqData));
		}
		closeComposeDialog();
	}

	/**
	 * Remove Applicant
	 */
	function handleRemove() {
		const removeIds = [id];
		dispatch(removeApplicant(removeIds));
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			{...applicantDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			{/* {console.log('applicantDialog.props')}
			{console.log(applicantDialog.props)}
			{console.log(name)}
			{console.log(avatar)} */}
			<AppBar position="static" elevation={0}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{applicantDialog.type === 'new' ? 'New Applicant' : 'Edit Applicant'}
					</Typography>
				</Toolbar>
				<div className="flex flex-col items-center justify-center pb-24">
					<Avatar className="w-96 h-96" alt="applicant avatar" src={avatar} />
					{applicantDialog.type === 'edit' && (
						<Typography variant="h6" color="inherit" className="p-8">
							{name}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">account_circle</Icon>
						</div>
						<Controller
							control={control}
							name="name"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Name"
									id="name"
									error={!!errors.name}
									helperText={errors?.name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">phone</Icon>
						</div>
						<Controller
							control={control}
							name="contactPhoneNo"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Phone"
									id="contactPhoneNo"
									error={!!errors.contactPhoneNo}
									helperText={errors?.contactPhoneNo?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20">
							<Icon color="action">email</Icon>
						</div>
						<Controller
							control={control}
							name="contactEmail"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Email"
									id="contactEmail"
									error={!!errors.contactEmail}
									helperText={errors?.contactEmail?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20" />
						<Controller
							control={control}
							name="nationality"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Nationality"
									id="nationality"
									name="nationality"
									error={!!errors.nationality}
									helperText={errors?.nationality?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20" />
						<Controller
							control={control}
							name="type"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Type"
									id="type"
									name="type"
									error={!!errors.type}
									helperText={errors?.type?.message}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20" />
						<Controller
							name="country"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									className="mt-8 mb-24"
									options={countriesListForCountryDropDown}
									value={value}
									onChange={(event, newValue) => {
										onChange(newValue);
										if (newValue === 'India') {
											setShowState(true);
										} else {
											setShowState(false);
										}
									}}
									renderInput={params => (
										<TextField
											{...params}
											label="Choose a country"
											variant="outlined"
											InputLabelProps={{
												shrink: true
											}}
											error={!!errors.country}
											helperText={errors?.country?.message}
											required
										/>
									)}
									fullWidth
									required
								/>
							)}
						/>
					</div>

					{showState && (
						<div className="flex">
							<div className="min-w-48 pt-20" />
							<Controller
								name="state"
								control={control}
								render={({ field: { onChange, value } }) => (
									<Autocomplete
										className="mt-8 mb-24"
										options={statesListForStatesDropDown}
										defaultValue={statesListForStatesDropDown[0]}
										value={value}
										onChange={(event, newValue) => {
											onChange(newValue);
										}}
										renderInput={params => (
											<TextField
												{...params}
												label="Choose a state"
												variant="outlined"
												InputLabelProps={{
													shrink: true
												}}
												error={!!errors.state}
												helperText={errors?.state?.message}
												required
											/>
										)}
										fullWidth
									/>
								)}
							/>
						</div>
					)}

					<div className="flex">
						<div className="min-w-48 pt-20" />
						<Controller
							control={control}
							name="addressLine1"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Address Line1"
									id="addressLine1"
									error={!!errors.addressLine1}
									helperText={errors?.addressLine1?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20" />
						<Controller
							control={control}
							name="addressLine2"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Address Line2"
									id="addressLine2"
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20" />
						<Controller
							control={control}
							name="pincode"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Pincode"
									id="pincode"
									error={!!errors.pincode}
									helperText={errors?.pincode?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>

					<div className="flex">
						<div className="min-w-48 pt-20" />
						<Controller
							control={control}
							name="city"
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="City"
									id="city"
									error={!!errors.city}
									helperText={errors?.city?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
				</DialogContent>

				{applicantDialog.type === 'new' ? (
					<DialogActions className="justify-between p-4 pb-16">
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={_.isEmpty(dirtyFields) || !isValid}
							>
								Add
							</Button>
						</div>
					</DialogActions>
				) : (
					<DialogActions className="justify-between p-4 pb-16">
						<div className="px-16">
							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={_.isEmpty(dirtyFields) || !isValid}
							>
								Save
							</Button>
						</div>
						<IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default ApplicantDialog;
