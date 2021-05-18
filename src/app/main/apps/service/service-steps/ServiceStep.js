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
import reducer from '../store';
import { getData } from '../store/serviceStepsSlice';
import PricingInfo from '../stagesForms/PricingInfo';
import ConfidentialityAgreement from '../stagesForms/ConfidentialityAgreement';

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
	const [stepCount, setStepCount] = useState(1);
	const theme = useTheme();

	const routeParams = useParams();
	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useDeepCompareEffect(() => {
		/**
		 * Get the ServiceStages Data
		 */
		dispatch(getData(routeParams));
	}, [dispatch, routeParams]);

	// useEffect(() => {
	// 	/**
	// 	 * If the course is opened for the first time
	// 	 * Change ActiveStep to 1
	// 	 */
	// 	if (serviceSteps && serviceSteps.activeStep === 0) {
	// 		dispatch(updateData({ activeStep: 1 }));
	// 	}
	// }, [dispatch, serviceSteps]);

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
					/>
				);
			default:
				return '';
		}
	}

	return (
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
					<IconButton to="/services" component={Link}>
						<Icon>{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}</Icon>
					</IconButton>
					{serviceSteps && (
						<Typography className="flex-1 text-20 mx-16">{serviceSteps.lserviceDTO.name}</Typography>
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

						<div className="flex justify-center w-full absolute left-0 right-0 bottom-0 pb-16 md:pb-32">
							<div className="flex justify-between w-full max-w-xl px-8">
								<div>
									{activeStep !== 1 && (
										<Fab className="" color="secondary" onClick={handleBack}>
											<Icon>{theme.direction === 'ltr' ? 'chevron_left' : 'chevron_right'}</Icon>
										</Fab>
									)}
								</div>
								<div>
									{activeStep < serviceSteps.lserviceStageDTOs.length ? (
										<Fab className="" color="secondary" onClick={handleNext}>
											<Icon>{theme.direction === 'ltr' ? 'chevron_right' : 'chevron_left'}</Icon>
										</Fab>
									) : (
										<Fab className={classes.successFab} to="/services" component={Link}>
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
					<Stepper classes={{ root: 'bg-transparent' }} activeStep={activeStep - 1} orientation="vertical">
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
	);
}

export default withReducer('servicesApp', reducer)(ServiceStep);
