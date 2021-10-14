import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { useDeepCompareEffect } from '@fuse/hooks';
import { memo, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { GetApp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FuseLoading from '@fuse/core/FuseLoading';
import { axiosInstance } from 'app/auth-service/axiosInstance';
import { updateData } from '../../store/serviceStepsSlice';
import {
	addResponseCustomerTrademarkDetailsAndAttachments,
	selectResponseCustomerTrademarkDetailsAndAttachments,
	getResponseCustomerTrademarkDetailsAndAttachments,
	updateResponseCustomerTrademarkDetailsAndAttachments
} from '../../store/responseCustomerTrademarkDetailsAndAttachmentsSlice';
import TmAppNoAndRegTmNoTable from './TmAppNoAndRegTmNoTable';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

const defaultValues = {
	tmApplicationNo: ''
};

const schema = yup.object().shape({
	tmApplicationNo: yup
		.string()
		.matches(/^[0-9]+$/, 'TM Application no must contain digits only')
		.min(5, 'TM Application no must be greater than or equal to 5 digits')
		.max(8, 'TM Application no must be less than or equal to 8 digits')
		.required('You must enter a TM Application no')
});

const schemaRegTmNo = yup.object().shape({
	tmApplicationNo: yup
		.string()
		.matches(/^[0-9]+$/, 'Registered TM no must contain digits only')
		.min(5, 'Registered TM no must be greater than or equal to 5 digits')
		.max(8, 'Registered TM no must be less than or equal to 8 digits')
		.required('You must enter a Registered TM no')
});

const schemaForAmmendments = yup.object().shape({
	tmApplicationNo: yup
		.string()
		.matches(/^[0-9]+$/, 'TM Application no must contain digits only')
		.min(5, 'TM Application no must be greater than or equal to 5 digits')
		.max(8, 'TM Application no must be less than or equal to 8 digits')
		.required('You must enter a TM Application no'),
	proposedAmendments: yup
		.string()
		.min(5, 'Proposed Amendments must be greater than or equal to 5 charcters')
		.max(150, 'Proposed Amendments must be less than or equal to 150 charactes')
		.required('You must enter a Proposed Amendments')
});

const TmApplicationNoAndOtherDetails = props => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const responseCustomerTrademarkDetailsAndAttachments = useSelector(
		selectResponseCustomerTrademarkDetailsAndAttachments
	);

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});
	const [loading, setLoading] = useState(true);
	const [stateLserviceStageTransactionId, setStateLserviceStageTransactionId] = useState(null);
	const [stateCustomerTrademarkDetailsId, setStateCustomerTrademarkDetailsId] = useState(null);

	// let stageStaus =
	// 	props.lserviceStageTransaction != null
	// 		? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
	// 			? 1
	// 			: 0
	// 		: 0;

	const { control, reset, handleSubmit, formState, watch } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(
			props.trademarkNoType === 2
				? schemaRegTmNo
				: props.step.stageType === 'TMAMENDMENTDETAILSREQ'
				? schemaForAmmendments
				: schema
		)
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

	let showDownloadsTable = false;
	if (
		props.stage.isAffidavitDraftDownloadAllowed ||
		props.stage.isNocDraftDownloadAllowed ||
		props.stage.isPoaDownloadAllowed
	) {
		showDownloadsTable = true;
	}

	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 2
	});

	let textFieldlabel = 'TM Application No.';
	if (props.trademarkNoType === 2) {
		textFieldlabel = 'Registered TM No.';
	}

	useEffect(() => {
		if (props.pricingInfoStatus === 0 && props.lserviceTransaction.id !== null) {
			if (props.lserviceStageTransaction == null) {
				const data = {
					lserviceTransactionId: props.lserviceTransaction.id,
					stageStatus: 'INPROGRESS',
					lserviceStageId: props.step.id,
					lserviceId: props.step.lserviceId
				};

				axiosInstance
					.post('/services/lgrest/api/lservice-stage-transactions/create-transaction-for-customer', {
						email: localStorage.getItem('lg_logged_in_email'),
						...data
					})
					.then(res => {
						setStateLserviceStageTransactionId(res.data.lserviceStageTransactionDTO.id);
					});
			}
		}
	}, [
		props.step.id,
		props.step.lserviceId,
		props.lserviceStageTransaction,
		props.lserviceTransaction,
		props.pricingInfoStatus
	]);

	useDeepCompareEffect(() => {
		dispatch(getResponseCustomerTrademarkDetailsAndAttachments()).then(() => setLoading(false));
	}, [dispatch]);

	// eslint-disable-next-line
	useEffect(() => {
		let data = '';
		if (props.lserviceStageTransaction !== null) {
			data = findMatchingCustomerTradeMarkRecordAlongWithAttachment(
				responseCustomerTrademarkDetailsAndAttachments,
				props.lserviceStageTransaction.id
			);
		} else {
			data = findMatchingCustomerTradeMarkRecordAlongWithAttachment(
				responseCustomerTrademarkDetailsAndAttachments,
				stateLserviceStageTransactionId
			);
		}

		if (data) {
			const tmApplicationNo =
				data.customerTrademarkDetailsDTO.applicationTmNo !== ''
					? data.customerTrademarkDetailsDTO.applicationTmNo
					: '';
			setStateCustomerTrademarkDetailsId(data.customerTrademarkDetailsDTO.id);
			if (!props.stage.addMoreAllowed) {
				if (props.step.stageType === 'TMAMENDMENTDETAILSREQ') {
					reset({
						tmApplicationNo,
						proposedAmendments: data.customerTrademarkDetailsDTO.desc
					});
				} else {
					reset({
						tmApplicationNo
					});
				}
			} else {
				reset({
					tmApplicationNo: ''
				});
			}
		}
	}, [
		props.lserviceStageTransaction,
		responseCustomerTrademarkDetailsAndAttachments,
		stateLserviceStageTransactionId,
		props.stage.addMoreAllowed,
		props.step.stageType,
		reset
	]);

	const findMatchingCustomerTradeMarkRecordAlongWithAttachment = (
		customerTrademarkDetailsAndAttachments,
		transactionId
	) => {
		const el = customerTrademarkDetailsAndAttachments.find(
			eltemp => eltemp.customerTrademarkDetailsDTO.lserviceStageTransactionId === transactionId
		);
		return el || null; // so check result is truthy and extract record
	};

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
		let message = '';
		let open = false;
		let level = 'error';

		if (props.lserviceTransaction.id == null || props.applicantsStatus.length <= 0) {
			message = 'Please complete the previous step before trying to complete this step!';
			open = true;
		} else {
			const tmApplicationNoForData = model.tmApplicationNo;
			let lserviceStageTransactionIdForData = null;
			if (props.lserviceStageTransaction == null) {
				lserviceStageTransactionIdForData = stateLserviceStageTransactionId;
			} else {
				lserviceStageTransactionIdForData = props.lserviceStageTransaction.id;
			}

			const customerTrademarkDetailsDTO = {
				typeForTm: props.trademarkNoType === 1 ? 'TMAPPLNO' : 'TMREGNO',
				status: 'ACTIVE',
				applicationTmNo: tmApplicationNoForData,
				lserviceStageTransactionId: lserviceStageTransactionIdForData
			};
			if (props.trademarkNoType === 2) {
				customerTrademarkDetailsDTO.registeredTmNo = tmApplicationNoForData;
				customerTrademarkDetailsDTO.applicationTmNo = '';
			}
			if (stateCustomerTrademarkDetailsId && !props.stage.addMoreAllowed) {
				customerTrademarkDetailsDTO.id = stateCustomerTrademarkDetailsId;
			}
			if (props.stage.isProposeAmendmentsAllowed) {
				customerTrademarkDetailsDTO.desc = model.proposedAmendments;
			}

			const reqData = {
				customerTrademarkDetailsDTO,
				email: localStorage.getItem('lg_logged_in_email')
			};

			if (stateCustomerTrademarkDetailsId && !props.stage.addMoreAllowed) {
				reqData.id = stateCustomerTrademarkDetailsId;
				dispatch(updateResponseCustomerTrademarkDetailsAndAttachments(reqData));
				message = 'Data updated successfully.';
			} else {
				dispatch(addResponseCustomerTrademarkDetailsAndAttachments(reqData));
				message = 'Data saved successfully.';
			}
			// stageStaus = 1;
			open = true;
			level = 'success';

			if (props.lserviceStageTransaction === null) {
				const lserviceTransactionId = props.lserviceTransaction.id;
				dispatch(
					updateData({
						lserviceTransactionId,
						lserviceStageTransactionId: stateLserviceStageTransactionId,
						stageStatus: 'COMPLETED',
						lserviceStageId: props.step.id,
						lserviceId: props.step.lserviceId
					})
				);
			}
		}
		setMessageAndLevel({
			message,
			open,
			level
		});
	}

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<div className="flex-grow flex-shrink-0 p-0">
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
					{(props.stage.isTmApplicantionNoAllowed || props.stage.isRegisteredTmNoAllowed) && (
						<>
							<form className="justify-items-center mb-20 mt-20" onSubmit={handleSubmit(onSubmit)}>
								<div className="flex">
									<Controller
										control={control}
										name="tmApplicationNo"
										render={({ field }) => (
											<TextField
												{...field}
												className="mb-24"
												label={textFieldlabel}
												id="tmApplicationNo"
												error={!!errors.tmApplicationNo}
												helperText={errors?.tmApplicationNo?.message}
												variant="outlined"
												required
												fullWidth
											/>
										)}
									/>
								</div>

								{props.stage.isProposeAmendmentsAllowed && (
									<div className="flex">
										<Controller
											name="proposedAmendments"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													className="mt-8 mb-16"
													id="proposedAmendments"
													label="Proposed Amendments"
													type="text"
													multiline
													rows={2}
													variant="outlined"
													error={!!errors.proposedAmendments}
													helperText={errors?.proposedAmendments?.message}
													fullWidth
													required
												/>
											)}
										/>
									</div>
								)}

								<Button
									type="submit"
									variant="contained"
									color="primary"
									className="w-full mx-auto mt-16"
									aria-label="Submit"
									disabled={_.isEmpty(dirtyFields) || !isValid}
									value="legacy"
								>
									{props.stage.addMoreAllowed ? 'Add' : 'Submit'}
								</Button>
							</form>
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
						</>
					)}
					{props.stage.addMoreAllowed && (
						<>
							<Divider className="mt-20" />
							<div className="mt-20 w-full flex items-center justify-center">
								<TmAppNoAndRegTmNoTable
									onRecordAdditionOrRemoval={setProvisionCostAfterItemAdd}
									lserviceStageTransactionId={
										props.lserviceStageTransaction !== null
											? props.lserviceStageTransaction.id
											: stateLserviceStageTransactionId
									}
									trademarkNoType={props.stage.isTmApplicantionNoAllowed ? 1 : 2}
								/>
							</div>
						</>
					)}
					{showDownloadsTable && (
						<>
							{props.stage.isTmApplicantionNoAllowed && <Divider className="mt-20" />}
							<div className="mt-20 w-full flex items-center justify-center">
								<FuseScrollbars className="flex-grow overflow-x-auto">
									<Table
										stickyHeader
										className={classes.table}
										size="small"
										aria-labelledby="tableTitle"
									>
										<TableHead>
											<TableRow>
												<TableCell>Document</TableCell>
												<TableCell>Link</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{props.stage.poaDraftUrl && (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.poaDraftUrl.substr(
														props.stage.poaDraftUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														POA Draft
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.poaDraftUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											)}
											{props.stage.affidavitDraftUrl && (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.affidavitDraftUrl.substr(
														props.stage.affidavitDraftUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														User Affidavit Draft
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.affidavitDraftUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											)}
											{props.stage.nocDraftUrl ? (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.nocDraftUrl.substr(
														props.stage.nocDraftUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														NOC Draft
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.nocDraftUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											) : null}
										</TableBody>
									</Table>
								</FuseScrollbars>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(TmApplicationNoAndOtherDetails);
