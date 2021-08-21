import { yupResolver } from '@hookform/resolvers/yup';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import _ from '@lodash';
import * as yup from 'yup';

import { closeLabelForServiceTransactionDialog } from '../store/lserviceTransactionsSlice';
import { updateLserviceTransactionData } from '../store/serviceStepsSlice';

const defaultValues = {
	label: ''
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	label: yup
		.string()
		.max(50, 'Application Name should not exceed 50 characters')
		.required('You must enter a Application Name')
});

function LabelForServiceTransactionDialog(props) {
	const dispatch = useDispatch();
	const labelForServiceTransactionDialog = useSelector(
		({ servicesApp }) => servicesApp.serviceTransactions.labelForServiceTransactionDialog
	);

	const { control, reset, handleSubmit, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (labelForServiceTransactionDialog.type === 'edit' && labelForServiceTransactionDialog.data) {
			console.log(labelForServiceTransactionDialog);
			let labelFromData = '';
			if (labelForServiceTransactionDialog.data.lablelByUser !== null) {
				labelFromData = labelForServiceTransactionDialog.data.lablelByUser;
			}
			reset({ label: labelFromData });
		}
	}, [labelForServiceTransactionDialog, reset]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (labelForServiceTransactionDialog.props.open) {
			initDialog();
		}
	}, [labelForServiceTransactionDialog, initDialog]);

	/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return dispatch(closeLabelForServiceTransactionDialog());
	}

	/**
	 * Form Submit
	 */
	function onSubmit(data) {
		// console.log(data);
		const reqData = {
			id: labelForServiceTransactionDialog.data.id,
			lablelByUser: data.label,
			customerId: labelForServiceTransactionDialog.data.customerId,
			servicesId: labelForServiceTransactionDialog.data.servicesId,
			status: 'ACTIVE'
		};
		console.log(reqData);
		dispatch(updateLserviceTransactionData(reqData));
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24'
			}}
			{...labelForServiceTransactionDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" elevation={0}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{labelForServiceTransactionDialog.data &&
						labelForServiceTransactionDialog.data.lablelByUser === null
							? 'Set Application Name'
							: 'Change Application Name'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:overflow-hidden">
				<DialogContent>
					<div className="flex">
						<Controller
							control={control}
							name="label"
							render={({ field }) => (
								<TextField
									{...field}
									label="Application Name"
									id="label"
									error={!!errors.label}
									helperText={errors?.label?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
				</DialogContent>

				<DialogActions className="justify-center">
					<div>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Save
						</Button>
					</div>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default LabelForServiceTransactionDialog;
