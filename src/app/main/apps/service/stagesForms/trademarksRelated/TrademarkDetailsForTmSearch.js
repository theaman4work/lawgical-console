import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import { memo, useState } from 'react';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addCustomerTrademarkDetails } from '../../store/customerTrademarkDetailsSlice';
import SearchRecordsTable from './SearchRecordsTable';

const defaultValues = {
	classification: 'Class 1 (Chemicals)',
	word: '',
	image: '',
	switchForImageAndWord: 'word'
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	classification: yup.string().required('You must enter a Classification').nullable(),
	word: yup.string().max(250, 'Word must be less than or equal to 250 characters').required('You must enter a word')
});

const TrademarkDetailsForTmSearch = props => {
	const dispatch = useDispatch();

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});
	const [showUploadOrText, setShowUploadOrText] = useState(2);

	// let stageStaus =
	// 	props.lserviceStageTransaction != null
	// 		? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
	// 			? 1
	// 			: 0
	// 		: 0;

	const { control, handleSubmit, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const platformCharges = (props.costDetails.platformCharges / 100) * props.costDetails.baseAmount;
	const platformAndBaseTotal = props.costDetails.baseAmount + platformCharges;

	let tax =
		(props.costDetails.cgst / 100) * platformAndBaseTotal + (props.costDetails.sgst / 100) * platformAndBaseTotal;

	if (props.costDetails.igst !== null) {
		tax += (props.costDetails.igst / 100) * platformAndBaseTotal;
	}

	const total = platformAndBaseTotal + tax;

	const [provisionalCost, setProvisionalCost] = useState(total);
	const [totalCost, setTotalCost] = useState(total);

	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 2
	});

	function setProvisionCostAfterItemAdd(count) {
		if (count !== 0) {
			setProvisionalCost(totalCost * count);
		} else {
			setProvisionalCost(totalCost);
		}
	}

	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		const message = '';
		const open = false;
		const level = messageAndLevel.level === 'success' ? 'success' : 'error';
		setMessageAndLevel({
			message,
			open,
			level
		});
	}

	function onSubmit(model) {
		console.log(model);
		let message = '';
		let open = false;
		let level = 'error';

		const classficationId = model.classification.replace(/^\D+|\D+$/g, '');
		if (props.lserviceTransaction.id == null) {
			message = 'Please complete the previous step before trying to complete this step!';
			open = true;
		} else {
			const customerTrademarkDetailsDTO = {
				classficationId,
				typeForTm: model.switchForImageAndWord === 'word' ? 'WORD' : 'IMAGE',
				status: 'ACTIVE',
				word: model.word
			};
			const reqData = {
				customerTrademarkDetailsDTO,
				email: localStorage.getItem('lg_logged_in_email')
			};

			dispatch(addCustomerTrademarkDetails(reqData));
			// stageStaus = 1;
			message = 'Data saved successfully.';
			open = true;
			level = 'success';

			setMessageAndLevel({
				message,
				open,
				level
			});
		}
	}

	return (
		<div className="flex-grow flex-shrink-0 p-0">
			{props.costDetails && (
				<div>
					<div>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{`Step ${props.stepCount} - ${props.step.name}`}
						</Typography>
						<div className="w-full flex items-center justify-end py-20">
							<Typography className="text-12 sm:text-15">
								{`Provisional cost: ${formatter.format(provisionalCost)}`}
							</Typography>
						</div>
						<form className="justify-items-center mb-20" onSubmit={handleSubmit(onSubmit)}>
							<div className="flex">
								<Controller
									name="classification"
									control={control}
									render={({ field: { onChange, value } }) => (
										<Autocomplete
											className="mt-8 mb-12 w-full"
											options={props.classifications}
											value={value}
											onChange={(event, newValue) => {
												onChange(newValue);
											}}
											renderInput={params => (
												<TextField
													{...params}
													label="Choose a classification"
													variant="outlined"
													InputLabelProps={{
														shrink: true
													}}
													error={!!errors.classification}
													helperText={errors?.classification?.message}
													required
												/>
											)}
											required
										/>
									)}
								/>
							</div>

							<div className="flex">
								<Controller
									name="switchForImageAndWord"
									control={control}
									render={({ field }) => (
										<FormControl component="fieldset" className="mt-8 mb-12 w-full">
											<RadioGroup
												{...field}
												aria-label="TM Search Type"
												className="justify-center"
												row
												onChange={(event, newValue) => {
													field.onChange(newValue);
													if (event.target.value === 'image') {
														// show image upload button
														setShowUploadOrText(1);
													} else {
														// show text field for word
														setShowUploadOrText(2);
													}
												}}
											>
												<FormControlLabel
													className="text-8"
													key="image"
													value="image"
													control={<Radio />}
													label="Image"
												/>
												<FormControlLabel
													className="text-8"
													key="word"
													value="word"
													control={<Radio />}
													label="Word"
												/>
											</RadioGroup>
										</FormControl>
									)}
								/>
							</div>

							{showUploadOrText === 2 && (
								<div className="flex">
									<Controller
										control={control}
										name="word"
										render={({ field }) => (
											<TextField
												{...field}
												className="mb-12 w-full"
												label="Word"
												id="word"
												error={!!errors.word}
												helperText={errors?.word?.message}
												variant="outlined"
												required
											/>
										)}
									/>
								</div>
							)}

							{showUploadOrText === 1 && (
								<div className="flex">
									<Button
										className="mb-12 w-full"
										variant="contained"
										color="secondary"
										disabled
										// className={classes.button}
										startIcon={<CloudUploadIcon />}
									>
										Upload
									</Button>
								</div>
							)}

							<Button
								type="submit"
								variant="contained"
								color="primary"
								className="w-full mx-auto mt-16"
								aria-label="Add"
								disabled={_.isEmpty(dirtyFields) || !isValid || showUploadOrText !== 2}
								value="legacy"
							>
								Add
							</Button>
						</form>
						<Divider className="mt-20" />
						<div className="mt-20 w-full flex items-center justify-center">
							<SearchRecordsTable
								classificationDTOs={props.classificationDTOs}
								onRecordAdditionOrRemoval={setProvisionCostAfterItemAdd}
							/>
						</div>
					</div>
					<Collapse in={messageAndLevel.open}>
						<Alert
							severity={messageAndLevel.level}
							variant="outlined"
							className="mt-10"
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={event => handleClose(event)}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
						>
							{messageAndLevel.message}
						</Alert>
					</Collapse>
				</div>
			)}
		</div>
	);
};

export default memo(TrademarkDetailsForTmSearch);
