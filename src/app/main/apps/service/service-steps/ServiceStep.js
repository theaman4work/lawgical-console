import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import SwipeableViews from 'react-swipeable-views';
import Error404 from 'app/main/errors/404/Error404';
import reducer from '../store';
import { getData } from '../store/serviceStepsSlice';
import { getApplicants, selectApplicants } from '../store/applicantSlice';
import PricingInfo from '../stagesForms/PricingInfo';
import ConfidentialityAgreement from '../stagesForms/ConfidentialityAgreement';
import ApplicantsTable from '../stagesForms/applicantDetails/ApplicantsTable';
import ApplicantDialog from '../stagesForms/applicantDetails/ApplicantDialog';
import LabelForServiceTransactionDialog from '../stagesForms/LabelForServiceTransactionDialog';
import TrademarkDetailsForTmSearch from '../stagesForms/trademarksRelated/TrademarkDetailsForTmSearch';
import TrademarkDetailsForTmFiling from '../stagesForms/trademarksRelated/TrademarkDetailsForTmFiling';
import DownloadSearchReports from '../stagesForms/trademarksRelated/DownloadSearchReports';
import TmApplicationNoAndOtherDetails from '../stagesForms/trademarksRelated/TmApplicationNoAndOtherDetails';
import UploadsForTrademarkServices from '../stagesForms/trademarksRelated/UploadsForTrademarkServices';
import { getServiceTransactions, selectServiceTransactions } from '../store/lserviceTransactionsSlice';
import CartAndPaymentTrademark from '../stagesForms/payment/CartAndPaymentTrademark';

const useStyles = makeStyles(theme => ({
	stepLabel: {
		cursor: 'pointer!important'
	},
	successFab: {
		background: `${green[500]}!important`,
		color: 'white!important'
	}
}));

function ServiceStep(props) {
	const dispatch = useDispatch();
	const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);
	const applicantsData = useSelector(selectApplicants);
	const lserviceTransactions = useSelector(selectServiceTransactions);
	const [stepCount, setStepCount] = useState(1);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(lserviceTransactions);
	const theme = useTheme();

	const routeParams = useParams();

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	let tabName = 'trademarks';
	if (routeParams.tab !== null) {
		tabName = routeParams.tab;
	}
	// eslint-disable-next-line
	const backUrl = '/services/' + tabName;
	// console.log(backUrl);

	useEffect(() => {
		// console.log(serviceSteps.currentStageCountForUser);
		setStepCount(serviceSteps.currentStageCountForUser ? serviceSteps.currentStageCountForUser : 1);
	}, [serviceSteps]);

	useDeepCompareEffect(() => {
		/**
		 * Get the ServiceStages Data
		 */
		dispatch(getData(routeParams));
		dispatch(getApplicants(routeParams));
		dispatch(getServiceTransactions()).then(() => setLoading(false));
	}, [dispatch, routeParams]);

	if (routeParams.lserviceTransactionId !== undefined && serviceSteps.lserviceTransactionDTO.id === null) {
		return <Error404 />;
	}

	function handleChangeActiveStep(index) {
		// dispatch(updateCourse({ activeStep: index + 1 }));
		setStepCount(index + 1);
	}

	function handleNext() {
		// dispatch(updateCourse({ activeStep: serviceSteps.activeStep + 1 }));
		setStepCount(stepCount + 1);
	}

	function handleBack() {
		// dispatch(updateCourse({ activeStep: serviceSteps.activeStep - 1 }));
		setStepCount(stepCount - 1);
	}

	// const activeStep = serviceSteps && serviceSteps.activeStep !== 0 ? serviceSteps.activeStep : 1;
	const activeStep = stepCount;

	const findMatchingLserviceStageTransaction = (lserviceStageTransactionData, step) => {
		const el = lserviceStageTransactionData.find(eltemp => eltemp.lserviceStageId === step.id); // Possibly returns `undefined`
		return el || null; // so check result is truthy and extract `id`
	};

	const findStageContentUsingStageId = (stagesData, stagesContentData, step) => {
		const el = stagesData.find(eltemp => eltemp.stageType === step.stageType);
		if (el != null) {
			const sc = stagesContentData.find(sctemp => sctemp.stageId === el.id);
			return sc || null; // Possibly returns `undefined`
		}
		return null;
	};

	const findMatchingStageUsingType = (stagesData, step) => {
		const el = stagesData.find(eltemp => eltemp.stageType === step.stageType);
		return el || null; // so check result is truthy and extract `id`
	};

	const convertClassficationsToDropdownList = classificationDTOs => {
		const classificationsForDropDown = [];
		for (let i = 0; i < classificationDTOs.length; i += 1) {
			const classificationLabel = `${classificationDTOs[i].name} ${classificationDTOs[i].label}`;
			classificationsForDropDown.push(classificationLabel);
		}
		return classificationsForDropDown;
	};

	const findPaymentStatus = (lserviceStageTransactionDTOs, stageDTOs) => {
		const stageDTO = stageDTOs.find(eltemp => eltemp.stageType === 'PAYMENT');
		if (stageDTO) {
			const lserviceStageTransactionDTO = lserviceStageTransactionDTOs.find(
				eltemp => eltemp.stageId === stageDTO.id
			);
			if (lserviceStageTransactionDTO) {
				if (lserviceStageTransactionDTO.stageStaus === 'COMPLETED') {
					return 0;
					// eslint-disable-next-line
				} else {
					return 1;
				}
				// eslint-disable-next-line
			} else {
				return 3;
			}
		} else {
			return 2;
		}
	};

	const findAggreementStageStatus = (lserviceStageTransactionDTOs, stageDTOs) => {
		const stageDTO = stageDTOs.find(eltemp => eltemp.stageType === 'AGREEMENTS');
		if (stageDTO) {
			const lserviceStageTransactionDTO = lserviceStageTransactionDTOs.find(
				eltemp => eltemp.stageId === stageDTO.id
			);
			if (lserviceStageTransactionDTO) {
				if (lserviceStageTransactionDTO.stageStaus === 'COMPLETED') {
					return 0;
					// eslint-disable-next-line
				} else {
					return 1;
				}
				// eslint-disable-next-line
			} else {
				return 3;
			}
		} else {
			return 2;
		}
	};

	const findAcceptChargesStatus = (lserviceStageTransactionDTOs, stageDTOs) => {
		const stageDTO = stageDTOs.find(eltemp => eltemp.stageType === 'PRICINGINFO');
		if (stageDTO) {
			const lserviceStageTransactionDTO = lserviceStageTransactionDTOs.find(
				eltemp => eltemp.stageId === stageDTO.id
			);
			if (lserviceStageTransactionDTO) {
				if (lserviceStageTransactionDTO.stageStaus === 'COMPLETED') {
					return 0;
					// eslint-disable-next-line
				} else {
					return 1;
				}
				// eslint-disable-next-line
			} else {
				return 3;
			}
		} else {
			return 2;
		}
	};

	const applicantsStatusForLserviceTransactions = (applicants, lserviceTransaction) => {
		if (applicants !== null) {
			const selectedRecords = [];
			// eslint-disable-next-line
			for ( const[key, value] of Object.entries(applicants) ) {
				// console.log('key - value');
				// console.log(`${key} - ${JSON.stringify(value.applicantsOfLserTransDTOs)}`);
				if (value.applicantsOfLserTransDTOs != null && value.applicantsOfLserTransDTOs.length > 0) {
					// eslint-disable-next-line
					for (const [key1, value1] of Object.entries(value.applicantsOfLserTransDTOs)) {
						// console.log('key1 - value1');
						// console.log(`${key1} - ${JSON.stringify(value1)}`);
						if (lserviceTransaction.id === value1.lserviceTransactionId && value1.status === 'ACTIVE') {
							selectedRecords.push(value);
						}
					}
				}
			}
			if (selectedRecords.length > 0) {
				return selectedRecords;
			}
			// no applicants selected for transaction
			return [];
		}
		// no applicants
		return [];
	};

	const applicantsTypeCheckForLserviceTransactions = (applicants, lserviceTransaction) => {
		if (applicants !== null) {
			const selectedRecords = [];
			// eslint-disable-next-line
			for ( const[key, value] of Object.entries(applicants) ) {
				// console.log('key - value');
				// console.log(`${key} - ${JSON.stringify(value.applicantsOfLserTransDTOs)}`);
				if (value.applicantsOfLserTransDTOs != null && value.applicantsOfLserTransDTOs.length > 0) {
					// eslint-disable-next-line
					for (const [key1, value1] of Object.entries(value.applicantsOfLserTransDTOs)) {
						// console.log('key1 - value1');
						// console.log(`${key1} - ${JSON.stringify(value1)}`);
						if (lserviceTransaction.id === value1.lserviceTransactionId && value1.status === 'ACTIVE') {
							if (
								value.applicantDTO.type === 'STARTUP' ||
								value.applicantDTO.type === 'SMALLENTERPRISE'
							) {
								selectedRecords.push(value);
							}
						}
					}
				}
			}
			if (selectedRecords.length > 0) {
				return 1;
			}
			// no applicants selected for transaction
			return null;
		}
		// no applicants
		return null;
	};

	const findMaximumGovtChargesToBeAppliedBasedOnApplicantType = (applicants, govtChargesWithTypesDTOs) => {
		let govtCharges = 0;
		if (applicants !== null) {
			// eslint-disable-next-line
			for ( const[key, value] of Object.entries(applicants) ) {
				// console.log('inside findMaximumGovtChargesToBeAppliedBasedOnApplicantType');
				// console.log(key);
				// console.log(value.applicantDTO.type);
				const chargesFoundForType = findGovtChargesUsingType(value.applicantDTO.type, govtChargesWithTypesDTOs);
				if (chargesFoundForType > govtCharges) {
					govtCharges = chargesFoundForType;
				}
			}
		}
		return govtCharges;
	};

	const findGovtChargesUsingType = (typeOfApplicant, govtChargesWithTypesDTOs) => {
		// console.log(typeOfApplicant);
		// console.log(govtChargesWithTypesDTOs);
		const recordOfGovtChargeWithType = govtChargesWithTypesDTOs.find(
			eltemp => eltemp.categoryForGovtChargesType === typeOfApplicant
		);
		// console.log(recordOfGovtChargeWithType);
		if (recordOfGovtChargeWithType !== null && recordOfGovtChargeWithType !== undefined) {
			if (recordOfGovtChargeWithType.charges !== null) {
				return recordOfGovtChargeWithType.charges;
			}
			return 0;
		}
		return 0;
	};

	function createServiceNameUsingData(serviceStepsData) {
		let nameOfService = 'Service Name';
		if (
			serviceStepsData.lserviceTransactionDTO.lablelByUser !== null ||
			serviceStepsData.lserviceTransactionDTO.sysGenName
		) {
			const applicationLabel =
				serviceStepsData.lserviceTransactionDTO.lablelByUser !== null
					? serviceStepsData.lserviceTransactionDTO.lablelByUser
					: serviceStepsData.lserviceTransactionDTO.sysGenName;
			nameOfService = `${serviceStepsData.lserviceDTO.name} - (${applicationLabel})`;
		} else {
			nameOfService = `${serviceStepsData.lserviceDTO.name} - (New Application)`;
		}
		return nameOfService;
	}

	function renderFormsUsingSwitchDecision(index, step) {
		switch (index) {
			case 0:
				return (
					<PricingInfo
						costDetails={serviceSteps.lserviceCostDTO}
						stepCount={1}
						step={step}
						lserviceStageTransaction={findMatchingLserviceStageTransaction(
							serviceSteps.lserviceStageTransactionDTOs,
							step
						)}
						lserviceTransaction={serviceSteps.lserviceTransactionDTO}
						// eslint-disable-next-line
						// isNewService={lserviceTransactionData === null ? true : false}
					/>
				);
			case 1:
				return (
					<ConfidentialityAgreement
						stepCount={2}
						step={step}
						stageContent={findStageContentUsingStageId(
							serviceSteps.stageDTOs,
							serviceSteps.stageLongContentDTOs,
							step
						)}
						lserviceStageTransaction={findMatchingLserviceStageTransaction(
							serviceSteps.lserviceStageTransactionDTOs,
							step
						)}
						lserviceTransaction={serviceSteps.lserviceTransactionDTO}
					/>
				);
			case 2:
				return (
					<ApplicantsTable
						stepCount={3}
						step={step}
						stageContent={findStageContentUsingStageId(
							serviceSteps.stageDTOs,
							serviceSteps.stageLongContentDTOs,
							step
						)}
						lserviceStageTransaction={findMatchingLserviceStageTransaction(
							serviceSteps.lserviceStageTransactionDTOs,
							step
						)}
						lserviceTransaction={serviceSteps.lserviceTransactionDTO}
						lservice={serviceSteps.lserviceDTO}
						aggrementStatus={findAggreementStageStatus(
							serviceSteps.lserviceStageTransactionDTOs,
							serviceSteps.stageDTOs
						)}
					/>
				);
			case 3:
				if (step.stageType === 'TMSEARCHREQ') {
					// return 4th step for TM Search
					return (
						<TrademarkDetailsForTmSearch
							costDetails={serviceSteps.lserviceCostDTO}
							stepCount={4}
							step={step}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							classifications={convertClassficationsToDropdownList(serviceSteps.classificationDTOs)}
							classificationDTOs={serviceSteps.classificationDTOs}
							applicantsStatus={applicantsStatusForLserviceTransactions(
								applicantsData,
								serviceSteps.lserviceTransactionDTO
							)}
							pricingInfoStatus={findAcceptChargesStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
						/>
					);
					// eslint-disable-next-line
				} else if (step.stageType === 'TMFILINGREQ') {
					// return 4th step for TM filing
					return (
						<TrademarkDetailsForTmFiling
							costDetails={serviceSteps.lserviceCostDTO}
							stepCount={4}
							step={step}
							stage={findMatchingStageUsingType(serviceSteps.stageDTOs, step)}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							classifications={convertClassficationsToDropdownList(serviceSteps.classificationDTOs)}
							classificationDTOs={serviceSteps.classificationDTOs}
							applicantsStatus={applicantsStatusForLserviceTransactions(
								applicantsData,
								serviceSteps.lserviceTransactionDTO
							)}
							pricingInfoStatus={findAcceptChargesStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
						/>
					);
				} else if (
					step.stageType === 'TMMONITORANDPORTVALREQ' ||
					step.stageType === 'TMRENEWALREQ' ||
					step.stageType === 'TMREPTOEXAMREPORTREQ' ||
					step.stageType === 'TMATTSHOWCAUHEARINGREQ' ||
					step.stageType === 'TMCHANGAPPDETAILSREQ' ||
					step.stageType === 'TMNOCCPRIGHTREQ' ||
					step.stageType === 'TMAMENDMENTDETAILSREQ'
				) {
					// return 4th step for TM Monitor, Legal Status and Trademark portfolio valuation (per Country)
					return (
						<TmApplicationNoAndOtherDetails
							costDetails={serviceSteps.lserviceCostDTO}
							stepCount={4}
							step={step}
							stage={findMatchingStageUsingType(serviceSteps.stageDTOs, step)}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							classifications={convertClassficationsToDropdownList(serviceSteps.classificationDTOs)}
							classificationDTOs={serviceSteps.classificationDTOs}
							trademarkNoType={step.stageType === 'TMRENEWALREQ' ? 2 : 1}
							applicantsStatus={applicantsStatusForLserviceTransactions(
								applicantsData,
								serviceSteps.lserviceTransactionDTO
							)}
							pricingInfoStatus={findAcceptChargesStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
						/>
					);
				} else if (step.stageType === 'PAYMENT') {
					// return 4th step Payment for Copyights
					return (
						<CartAndPaymentTrademark
							costDetails={serviceSteps.lserviceCostDTO}
							stepCount={4}
							step={step}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lservice={serviceSteps.lserviceDTO}
							aggrementStatus={findAggreementStageStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
							applicantsStatus={applicantsStatusForLserviceTransactions(
								applicantsData,
								serviceSteps.lserviceTransactionDTO
							)}
							govtCharges={findMaximumGovtChargesToBeAppliedBasedOnApplicantType(
								applicantsData,
								serviceSteps.govtChargesWithTypesDTOs
							)}
						/>
					);
				}
				return '';
			case 4:
				if (step.stageType === 'PAYMENT') {
					return (
						<CartAndPaymentTrademark
							costDetails={serviceSteps.lserviceCostDTO}
							stepCount={5}
							step={step}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lservice={serviceSteps.lserviceDTO}
							aggrementStatus={findAggreementStageStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
							applicantsStatus={applicantsStatusForLserviceTransactions(
								applicantsData,
								serviceSteps.lserviceTransactionDTO
							)}
							govtCharges={findMaximumGovtChargesToBeAppliedBasedOnApplicantType(
								applicantsData,
								serviceSteps.govtChargesWithTypesDTOs
							)}
							classifications={convertClassficationsToDropdownList(serviceSteps.classificationDTOs)}
							classificationDTOs={serviceSteps.classificationDTOs}
						/>
					);
				}
				return '';
			case 5:
				if (step.stageType === 'TMSEARCHSREPORT' || step.stageType === 'TMSEARCHSREPORTANDTXTUPDATES') {
					return (
						<DownloadSearchReports
							stepCount={6}
							step={step}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							tmServiceType={step.stageType === 'TMSEARCHSREPORT' ? 1 : 2}
							paymentStatus={findPaymentStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
							pricingInfoStatus={findAcceptChargesStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
						/>
					);
					// eslint-disable-next-line
				} else if (step.stageType === 'TMFILINGUPLOADSREQ' ||
					step.stageType === 'TMUPLOADPOA' ||
					step.stageType === 'TMUPLOADPOAUSERAFFANDEVDOFUSAGE' ||
					step.stageType === 'TMUPLOADPOAANDEVDOFCHANGE' ||
					step.stageType === 'TMPORTVALUATIONUPLOADS' ||
					step.stageType === 'TMARTISTICUPLOADS'
				) {
					return (
						<UploadsForTrademarkServices
							stepCount={6}
							step={step}
							stage={findMatchingStageUsingType(serviceSteps.stageDTOs, step)}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							trademarkServiceUploadType={
								step.stageType === 'TMUPLOADPOA'
									? 1
									: step.stageType === 'TMFILINGUPLOADSREQ'
									? 2
									: step.stageType === 'TMUPLOADPOAUSERAFFANDEVDOFUSAGE'
									? 3
									: step.stageType === 'TMUPLOADPOAANDEVDOFCHANGE'
									? 5
									: step.stageType === 'TMPORTVALUATIONUPLOADS'
									? 6
									: 7
							}
							paymentStatus={findPaymentStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
							pricingInfoStatus={findAcceptChargesStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
							applicantsIsOfStartUpOrMsmeType={applicantsTypeCheckForLserviceTransactions(
								applicantsData,
								serviceSteps.lserviceTransactionDTO
							)}
						/>
					);
				} else {
					return '';
				}
			case 6:
				if (
					step.stageType === 'TMDOWNLOADFILINGRECEIPT' ||
					step.stageType === 'TMTEXTUPDATES' ||
					step.stageType === 'TMDOWNLOADFILINGRECEIPTANDTEXTUPDATES'
				) {
					return (
						<DownloadSearchReports
							stepCount={7}
							step={step}
							lserviceStageTransaction={findMatchingLserviceStageTransaction(
								serviceSteps.lserviceStageTransactionDTOs,
								step
							)}
							lserviceTransaction={serviceSteps.lserviceTransactionDTO}
							tmServiceType={
								step.stageType === 'TMDOWNLOADFILINGRECEIPT'
									? 3
									: step.stageType === 'TMDOWNLOADFILINGRECEIPTANDTEXTUPDATES'
									? 4
									: 5
							}
							lservice={serviceSteps.lserviceDTO}
							paymentStatus={findPaymentStatus(
								serviceSteps.lserviceStageTransactionDTOs,
								serviceSteps.stageDTOs
							)}
						/>
					);
				}
				return '';
			default:
				return '';
		}
	}

	return (
		<>
			<FusePageSimple
				classes={{
					content: 'flex flex-col flex-auto overflow-hidden',
					header: 'h-72 min-h-72 lg:ltr:rounded-bl-20 lg:rtl:rounded-br-20',
					sidebar: 'border-0'
				}}
				header={
					<div className="flex flex-1 items-center px-16 lg:px-24">
						<Hidden lgUp>
							<IconButton
								onClick={ev => pageLayout.current.toggleLeftSidebar()}
								aria-label="open left sidebar"
							>
								<Icon>menu</Icon>
							</IconButton>
						</Hidden>
						<IconButton to={backUrl} component={Link}>
							<Icon>{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}</Icon>
						</IconButton>
						{serviceSteps && (
							<Typography className="flex-1 text-20 mx-16">
								{createServiceNameUsingData(serviceSteps)}
							</Typography>
						)}
					</div>
				}
				content={
					serviceSteps && (
						<div className="flex flex-1 relative overflow-hidden">
							<FuseScrollbars className="w-full overflow-auto">
								<SwipeableViews
									className="overflow-hidden"
									index={activeStep - 1}
									enableMouseEvents
									onChangeIndex={handleChangeActiveStep}
									disabled={true}
								>
									{serviceSteps.lserviceStageDTOs.map((step, index) => (
										<div
											className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64"
											key={step.id}
										>
											<Paper className="w-full max-w-lg rounded-20 p-16 md:p-24 shadow leading-normal">
												<div dir={theme.direction}>
													{renderFormsUsingSwitchDecision(index, step)}
												</div>
											</Paper>
										</div>
									))}
								</SwipeableViews>
							</FuseScrollbars>

							<div className="flex justify-center w-full absolute left-0 right-0 top-4 pb-4">
								<div className="flex justify-between w-full max-w-xl px-8">
									<div>
										{activeStep !== 1 && (
											<Fab className="" color="primary" onClick={handleBack}>
												<Icon>
													{theme.direction === 'ltr' ? 'chevron_left' : 'chevron_right'}
												</Icon>
											</Fab>
										)}
									</div>
									<div>
										{activeStep < serviceSteps.lserviceStageDTOs.length ? (
											<Fab className="" color="primary" onClick={handleNext}>
												<Icon>
													{theme.direction === 'ltr' ? 'chevron_right' : 'chevron_left'}
												</Icon>
											</Fab>
										) : (
											<Fab className={classes.successFab} to={backUrl} component={Link}>
												<Icon>check</Icon>
											</Fab>
										)}
									</div>
								</div>
							</div>
						</div>
					)
				}
				leftSidebarContent={
					serviceSteps && (
						<Stepper
							classes={{ root: 'bg-transparent' }}
							activeStep={activeStep - 1}
							orientation="vertical"
						>
							{serviceSteps.lserviceStageDTOs.map((step, index) => {
								return (
									<Step key={step.id} onClick={() => handleChangeActiveStep(index)}>
										<StepLabel classes={{ root: classes.stepLabel }}>{step.name}</StepLabel>
									</Step>
								);
							})}
						</Stepper>
					)
				}
				innerScroll
				ref={pageLayout}
			/>
			<ApplicantDialog />
			<LabelForServiceTransactionDialog />
		</>
	);
}

export default withReducer('servicesApp', reducer)(ServiceStep);
