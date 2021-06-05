import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { memo, useState } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from '@lodash';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { updateData } from '../store/serviceStepsSlice';

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

const defaultProps = {
	bgcolor: 'background.paper',
	borderColor: 'text.primary',
	m: 1,
	border: 1
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.')
});

const ConfidentialityAgreement = props => {
	const dispatch = useDispatch();
	const classes = useStyles();
	const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});

	let stageStaus =
		props.lserviceStageTransaction != null
			? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
				? 1
				: 0
			: 0;

	const { control, formState, handleSubmit } = useForm({
		mode: 'onChange',
		defaultValues: {
			// eslint-disable-next-line
			acceptTermsConditions: stageStaus === 1 ? true : false
		},
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const desc = props.stageContent && props.stageContent.desc != null ? props.stageContent.desc : '';

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

		if (props.lserviceTransaction.id == null) {
			message = 'Please complete the previous step before trying to complete this step!';
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
			stageStaus = 1;

			message = 'Data saved successfully.';
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
			{props.step.name && (
				<div>
					<div>
						<Typography className="text-16 sm:text-20 mb-16 truncate font-semibold">
							{`Step ${props.stepCount} - ${props.step.name}`}
						</Typography>

						{desc ? (
							<form onSubmit={handleSubmit(onSubmit)}>
								<Box p={1} borderColor="text.primary" border={1} boxShadow={3} borderRadius={12}>
									<Typography>{desc}</Typography>
								</Box>
								<Controller
									name="acceptTermsConditions"
									control={control}
									render={({ field: { onChange, onBlur, value, name, ref } }) => (
										<FormControl
											className="items-center mx-auto mt-10"
											// eslint-disable-next-line
											disabled={stageStaus === 1 ? true : false}
											error={!!errors.acceptTermsConditions}
										>
											<FormControlLabel
												label="I read and accept terms and conditions"
												control={<Checkbox onChange={onChange} checked={value} name={name} />}
											/>
											<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
										</FormControl>
									)}
								/>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									className="w-full mx-auto mt-16"
									aria-label="REGISTER"
									disabled={_.isEmpty(dirtyFields) || !isValid || stageStaus === 1}
									value="legacy"
								>
									Submit
								</Button>
							</form>
						) : (
							''
						)}
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

export default memo(ConfidentialityAgreement);
