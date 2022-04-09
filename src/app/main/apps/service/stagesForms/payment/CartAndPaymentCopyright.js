import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { memo, useState, useMemo, forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateData } from '../../store/serviceStepsSlice';
import { selectResponseCustomerTrademarkDetailsAndAttachments } from '../../store/responseCustomerTrademarkDetailsAndAttachmentsSlice';
import { applicantTypesList } from '../applicantTypeList';

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

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
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
	const [map, setMap] = useState('applicantDetails');
	const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);

	// const responseCustomerTrademarkDetailsAndAttachments = useSelector(
	// 	selectResponseCustomerTrademarkDetailsAndAttachments
	// );

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});

	const [dialog, setDialog] = useState({
		open: false,
		applicantsData: null,
		tradeMarksData: null
	});

	const platformCharges = (props.costDetails.platformCharges / 100) * props.costDetails.baseAmount;
	const platformAndBaseTotal = props.costDetails.baseAmount + platformCharges;

	let tax =
		(props.costDetails.cgst / 100) * platformAndBaseTotal + (props.costDetails.sgst / 100) * platformAndBaseTotal;

	if (props.costDetails.igst !== null) {
		tax += (props.costDetails.igst / 100) * platformAndBaseTotal;
	}

	const total = platformAndBaseTotal + tax;

	let chargesToBePaid = total;

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

		if (props.lserviceTransaction.id == null || props.aggrementStatus !== 0 || props.applicantsStatus.length <= 0) {
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

	function handleOpenDialog(applicants, trademarks) {
		setDialog({
			open: true,
			applicantsData: applicants,
			tradeMarksData: trademarks
		});
	}

	const findClassname = (classificationDTOs, idreq) => {
		const el = classificationDTOs.find(eltemp => eltemp.id === idreq); // Possibly returns `undefined`
		return `${el.name}` || null; // so check result is truthy and extract `id`
	};

	const findClassificationDescUsingId = (classificationDTOs, classificationId) => {
		if (classificationDTOs.length > 0) {
			for (let i = 0; i < classificationDTOs.length; i += 1) {
				if (classificationDTOs[i].id === parseInt(classificationId, 10)) {
					return classificationDTOs[i].info;
				}
			}
		}
		return 'Class Description';
	};

	return (
		<>
			<div>
				{useMemo(() => {
					function handleCloseDialog() {
						setDialog({
							...dialog,
							open: false
						});
					}

					const findApplicantTypeLabel = enumVal => {
						const el = applicantTypesList.find(eltemp => eltemp.code === enumVal);
						if (el) {
							return el.label;
						}
						return 'Other';
					};

					return (
						<Dialog
							classes={{
								paper: 'm-24'
							}}
							open={dialog.open}
							onClose={handleCloseDialog}
							aria-labelledby="service-applications-list"
							TransitionComponent={Transition}
							fullWidth
							maxWidth="sm"
						>
							<AppBar position="static" elevation={0} className="items-center">
								<Typography variant="h6" color="inherit" className="p-16 items-center">
									Preview
								</Typography>
							</AppBar>
							<DialogContent className="w-auto justify-center">
								{props.applicantsStatus && (
									<Accordion
										className="border-0 shadow-0 overflow-hidden"
										expanded={map === `applicantDetails`}
										key={props.step.stageType}
										onChange={() => setMap(map !== `applicantDetails` ? `applicantDetails` : false)}
									>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											classes={{ root: 'border border-solid rounded-16 mb-16' }}
										>
											<Typography className="font-semibold">Applicant Details</Typography>
										</AccordionSummary>
										<AccordionDetails className="flex flex-col md:flex-col -mx-8">
											{props.applicantsStatus.map((applicantData, index) => {
												return (
													<Table
														key={applicantData.applicantDTO.id - 3}
														className="mb-16"
														sx={{ border: 1 }}
													>
														<TableBody>
															<TableRow key={applicantData.applicantDTO.id - 1}>
																<TableCell colSpan={2}>
																	<Typography variant="subtitle2" className="italic">
																		Applicant #{index + 1}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id}>
																<TableCell>
																	<Typography>Name</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.name}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 1}>
																<TableCell>
																	<Typography>Address</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{
																			// strings appended for address
																		}
																		{`${applicantData.addressDTO.addressLine1}, ${
																			applicantData.addressDTO.addressLine2 !==
																			null
																				? `${applicantData.addressDTO.addressLine2}, `
																				: ''
																		} ${applicantData.addressDTO.city}, 
																		${applicantData.addressDTO.pincode}, ${applicantData.addressDTO.state}, 
																		${applicantData.addressDTO.country}`}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 2}>
																<TableCell>
																	<Typography>Nationality</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.nationality}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 3}>
																<TableCell>
																	<Typography>Contact No</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.contactPhoneNo}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 4}>
																<TableCell>
																	<Typography>Email</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.contactEmail}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 5}>
																<TableCell>
																	<Typography>Nature Of Applicant</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{findApplicantTypeLabel(
																			applicantData.applicantDTO.type
																		)}
																	</Typography>
																</TableCell>
															</TableRow>
															{applicantData.applicantDTO.partnersName !== null && (
																<TableRow key={applicantData.applicantDTO.id + 5}>
																	<TableCell>
																		<Typography>Partners Name</Typography>
																	</TableCell>
																	<TableCell className="px-16">
																		<Typography color="textSecondary">
																			{applicantData.applicantDTO.partnersName}
																		</Typography>
																	</TableCell>
																</TableRow>
															)}
														</TableBody>
													</Table>
												);
											})}
										</AccordionDetails>
									</Accordion>
								)}
							</DialogContent>
							<DialogActions className="justify-center">
								<Button
									onClick={handleCloseDialog}
									color="primary"
									variant="contained"
									size="medium"
									aria-label="closePopup"
								>
									Close
								</Button>
							</DialogActions>
						</Dialog>
					);
				}, [
					dialog,
					map,
					props.applicantsStatus,
					totaFilteredRecords,
					props.classificationDTOs,
					props.step.stageType
				])}
			</div>
			<div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0')}>
				{props.costDetails && (
					<div>
						<div>
							<div className="flex items-center justify-between pb-10">
								<Typography className="text-16 sm:text-20 truncate font-semibold">
									{`Step ${props.stepCount} - ${props.step.name}`}
								</Typography>

								{
									// eslint-disable-next-line
									(props.applicantsStatus.length > 0 && totaFilteredRecords.length > 0) && (
										<Button
											variant="contained"
											color="primary"
											size="medium"
											aria-label="addnew"
											onClick={() =>
												handleOpenDialog(props.applicantsStatus, totaFilteredRecords)
											}
										>
											Preview
										</Button>
									)
								}
							</div>

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
		</>
	);
};

export default memo(CartAndPayment);
