import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { memo, useState } from 'react';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateData } from '../../store/serviceStepsSlice';
import { selectResponseCustomerTrademarkDetailsAndAttachments } from '../../store/responseCustomerTrademarkDetailsAndAttachmentsSlice';

const useStyles = makeStyles({
	root: {
		'& table ': {
			'& th:first-child, & td:first-child': {
				paddingLeft: `${0}!important`
			},
			'& th:last-child, & td:last-child': {
				paddingRight: `${0}!important`
			}
		}
	}
});

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	acceptTermsConditions: yup.boolean().oneOf([true], 'Charges must be accepted.')
});

const CartAndPayment = props => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);

	const responseCustomerTrademarkDetailsAndAttachments = useSelector(
		selectResponseCustomerTrademarkDetailsAndAttachments
	);

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});

	const platformCharges = (props.costDetails.platformCharges / 100) * props.costDetails.baseAmount;
	const platformAndBaseTotal = props.costDetails.baseAmount + platformCharges;

	let tax =
		(props.costDetails.cgst / 100) * platformAndBaseTotal + (props.costDetails.sgst / 100) * platformAndBaseTotal;

	if (props.costDetails.igst !== null) {
		tax += (props.costDetails.igst / 100) * platformAndBaseTotal;
	}

	const total = platformAndBaseTotal + tax;

	const findlserviceStageTransactionUsingLserviceStage = (lserviceStageTransactionDTOs, lserviceStageId) => {
		// const el = lserviceStageTransactionDTOs.find(eltemp => eltemp.lserviceStageId === lserviceStageId);
		if (props.lserviceTransaction !== null) {
			const el = lserviceStageTransactionDTOs.find(
				eltemp =>
					eltemp.lserviceTransactionId === props.lserviceTransaction.id &&
					eltemp.lserviceStageId === lserviceStageId
			);
			return el || null;
			// eslint-disable-next-line
		} else {
			return null;
		}
		// return el || null; // so check result is truthy and extract `id`
	};

	let totaFilteredRecords = '';
	if (props.lservice.name.toLowerCase() === 'TM search'.toLowerCase()) {
		const lserviceStageDTO = serviceSteps.lserviceStageDTOs.filter(eachRec => eachRec.stageType === 'TMSEARCHREQ');

		if (lserviceStageDTO !== null) {
			const lserviceStageTransactionFound = findlserviceStageTransactionUsingLserviceStage(
				serviceSteps.lserviceStageTransactionDTOs,
				lserviceStageDTO[0].id
			);
			let interMediateFilterRecords = '';
			if (lserviceStageTransactionFound !== null) {
				interMediateFilterRecords = responseCustomerTrademarkDetailsAndAttachments.filter(
					eachRec =>
						eachRec.customerTrademarkDetailsDTO.typeForTm === 'WORD' ||
						eachRec.customerTrademarkDetailsDTO.typeForTm === 'IMAGE'
				);
				if (interMediateFilterRecords.length > 0) {
					totaFilteredRecords = interMediateFilterRecords.filter(
						eachRec =>
							eachRec.customerTrademarkDetailsDTO.lserviceStageTransactionId ===
							lserviceStageTransactionFound.id
					);
				}
			}
		}
	} else if (
		props.lservice.name.toLowerCase() === 'TM monitor'.toLowerCase() ||
		props.lservice.name.toLowerCase() === 'Legal status'.toLowerCase() ||
		props.lservice.name.toLowerCase() === 'TM Renewal'.toLowerCase() ||
		props.lservice.name.toLowerCase() === 'Change in Applicant'.toLowerCase() ||
		props.lservice.name.toLowerCase() === 'Trademark portfolio valuation (per Country)'.toLowerCase()
	) {
		if (serviceSteps.lserviceStageDTOs.length > 0) {
			const lserviceStageDTO = serviceSteps.lserviceStageDTOs.filter(
				eachRec =>
					eachRec.stageType === 'TMMONITORANDPORTVALREQ' ||
					eachRec.stageType === 'TMRENEWALREQ' ||
					eachRec.stageType === 'TMCHANGAPPDETAILSREQ'
			);

			if (lserviceStageDTO !== null) {
				const lserviceStageTransactionFound = findlserviceStageTransactionUsingLserviceStage(
					serviceSteps.lserviceStageTransactionDTOs,
					lserviceStageDTO[0].id
				);
				let interMediateFilterRecords = '';
				if (lserviceStageTransactionFound !== null) {
					interMediateFilterRecords = responseCustomerTrademarkDetailsAndAttachments.filter(
						eachRec =>
							eachRec.customerTrademarkDetailsDTO.typeForTm === 'TMAPPLNO' ||
							eachRec.customerTrademarkDetailsDTO.typeForTm === 'TMREGNO'
					);
					if (interMediateFilterRecords.length > 0) {
						totaFilteredRecords = interMediateFilterRecords.filter(
							eachRec =>
								eachRec.customerTrademarkDetailsDTO.lserviceStageTransactionId ===
								lserviceStageTransactionFound.id
						);
					}
				}
			}
		}
	} else {
		totaFilteredRecords = responseCustomerTrademarkDetailsAndAttachments;
	}

	let chargesToBePaid = total;

	if (
		chargesToBePaid === 0 ||
		props.lservice.name.toLowerCase() === 'TM search'.toLocaleLowerCase() ||
		props.lservice.name.toLowerCase() === 'TM monitor'.toLocaleLowerCase() ||
		props.lservice.name.toLowerCase() === 'Legal status'.toLocaleLowerCase() ||
		props.lservice.name.toLowerCase() === 'TM Renewal'.toLocaleLowerCase() ||
		props.lservice.name.toLowerCase() === 'Change in Applicant'.toLocaleLowerCase() ||
		props.lservice.name.toLowerCase() === 'Trademark portfolio valuation (per Country)'.toLocaleLowerCase()
	) {
		chargesToBePaid = total * (totaFilteredRecords.length > 0 ? totaFilteredRecords.length : 1);
	}

	let totalTextLabel = 'SERVICE CHARGES';
	if (props.lservice.name.toLowerCase() === 'TM search'.toLocaleLowerCase()) {
		totalTextLabel = `TOTAL NUMBER OF TRADEMARKS -(${
			totaFilteredRecords.length !== 0 ? totaFilteredRecords.length : 1
		})`;
	} else if (
		props.lservice.name.toLowerCase() === 'TM monitor'.toLowerCase() ||
		props.lservice.name.toLowerCase() === 'Legal status'.toLowerCase() ||
		props.lservice.name.toLowerCase() === 'Change in Applicant'.toLowerCase() ||
		props.lservice.name.toLowerCase() === 'Trademark portfolio valuation (per Country)'.toLowerCase()
	) {
		totalTextLabel = `TOTAL NUMBER OF TM APPLICATION NO -(${
			totaFilteredRecords.length !== 0 ? totaFilteredRecords.length : 1
		})`;
	} else if (props.lservice.name.toLowerCase() === 'TM Renewal'.toLowerCase()) {
		totalTextLabel = `TOTAL NUMBER OF REGISTERED TM NO -(${
			totaFilteredRecords.length !== 0 ? totaFilteredRecords.length : 1
		})`;
	}

	let stageStatus =
		props.lserviceStageTransaction != null
			? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
				? 1
				: 0
			: 0;

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			// eslint-disable-next-line
			// acceptTermsConditions: stageStaus === 1 ? true : false
		},
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 2
	});

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
		let message = '';
		let open = false;
		let level = 'error';

		if (props.lserviceTransaction.id == null || props.aggrementStatus !== 0 || props.applicantsStatus !== 0) {
			message = 'Please complete the previous steps before trying to complete this step!';
			open = true;
		} else if (serviceSteps != null) {
			const lserviceTransactionId =
				props.lserviceTransaction != null
					? props.lserviceTransaction.id
					: serviceSteps.lserviceTransactionDTO.id;

			dispatch(
				updateData({
					lserviceTransactionId,
					stageStatus: 'COMPLETED',
					lserviceStageId: props.step.id,
					lserviceId: props.step.lserviceId
				})
			);
			stageStatus = 1;

			message = 'Paid successfully.';
			open = true;
			level = 'success';
		} else {
			message = 'Failed to save the data, please try again later!';
			open = true;
			level = 'error';
		}
		setMessageAndLevel({
			message,
			open,
			level
		});
	}

	return (
		<div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0')}>
			{props.costDetails && (
				<div>
					<div>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{`Step ${props.stepCount} - ${props.step.name}`}
						</Typography>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Table className="simple mt-12">
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant={
													props.costDetails.isGovtChargesApplicable === true
														? 'subtitle1'
														: 'h6'
												}
												color="textSecondary"
											>
												{totalTextLabel}
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant={
													props.costDetails.isGovtChargesApplicable === true
														? 'subtitle1'
														: 'h6'
												}
												color="textSecondary"
											>
												{formatter.format(chargesToBePaid)}
											</Typography>
										</TableCell>
									</TableRow>
									{props.costDetails.isGovtChargesApplicable === true && (
										<>
											<TableRow>
												<TableCell>
													<Typography
														className="font-normal"
														variant="subtitle1"
														color="textSecondary"
													>
														GOVT. CHARGES
													</Typography>
												</TableCell>
												<TableCell align="right">
													<Typography
														className="font-normal"
														variant="subtitle1"
														color="textSecondary"
													>
														{formatter.format(props.govtCharges)}
													</Typography>
												</TableCell>
											</TableRow>

											<TableRow>
												<TableCell>
													<Typography
														className="font-light"
														variant="h5"
														color="textSecondary"
													>
														TOTAL
													</Typography>
												</TableCell>
												<TableCell align="right">
													<Typography
														className="font-light"
														variant="h5"
														color="textSecondary"
													>
														{formatter.format(chargesToBePaid + props.govtCharges)}
													</Typography>
												</TableCell>
											</TableRow>
										</>
									)}
								</TableBody>
							</Table>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								className="w-full mx-auto mt-16"
								aria-label="REGISTER"
								value="legacy"
								disabled={stageStatus === 1}
							>
								{stageStatus === 1 ? 'Payment Completed' : 'Payment'}
							</Button>
						</form>
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

export default memo(CartAndPayment);
