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
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	acceptTermsConditions: yup.boolean().oneOf([true], 'Charges must be accepted.')
});

const PricingInfo = props => {
	const classes = useStyles();
	const dispatch = useDispatch();

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

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			// eslint-disable-next-line
			acceptTermsConditions: stageStaus === 1 ? true : false
		},
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

	let title = null;
	if (props.step.desc == null) {
		title = props.step.name;
	}

	const total = platformAndBaseTotal + tax;

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

		dispatch(
			updateData({
				lserviceTransactionId: 0,
				stageStatus: 'COMPLETED',
				lserviceStageId: props.step.id,
				lserviceId: props.step.lserviceId
			})
		);
		stageStaus = 1;
		message = 'Data saved successfully.';
		open = true;
		level = 'success';

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
						<Box
							className="my-20"
							p={1}
							borderColor="primary.main"
							border={1}
							boxShadow={0}
							borderRadius={12}
						>
							<Typography className="font-normal" variant="subtitle1" color="textSecondary">
								{/* {props.step.desc} */}
								<List dense className="p-0">
									{props.step.desc &&
										props.step.desc.split('---').map(item => (
											<ListItem key={item}>
												<ListItemIcon className="min-w-40">
													<Icon className="text-10">radio_button_unchecked</Icon>
												</ListItemIcon>
												<ListItemText primary={item} />
											</ListItem>
										))}
									{title && (
										<ListItem key={title}>
											<ListItemIcon className="min-w-40">
												<Icon className="text-10">radio_button_unchecked</Icon>
											</ListItemIcon>
											<ListItemText primary={title} />
										</ListItem>
									)}
								</List>
							</Typography>
						</Box>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Table className="simple mt-12">
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="textSecondary"
											>
												SERVICE CHARGES
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="textSecondary"
											>
												{formatter.format(platformAndBaseTotal)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="textSecondary"
											>
												TAX
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="textSecondary"
											>
												{formatter.format(tax)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography className="font-light" variant="h5" color="textSecondary">
												TOTAL (excluding Govt. charges)
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography className="font-light" variant="h5" color="textSecondary">
												{formatter.format(total)}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
							<Controller
								name="acceptTermsConditions"
								control={control}
								render={({ field: { onChange, onBlur, value, name, ref } }) => (
									<FormControl
										className="items-center"
										// eslint-disable-next-line
										disabled={stageStaus === 1 ? true : false}
										error={!!errors.acceptTermsConditions}
									>
										<FormControlLabel
											label="I accept charges"
											control={<Checkbox onChange={onChange} checked={value} name={name} />}
										/>
										<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
										{/* {console.log('field')}
										{console.log(field)} */}
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

export default memo(PricingInfo);
