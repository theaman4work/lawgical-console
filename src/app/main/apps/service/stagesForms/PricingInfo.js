import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { memo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from '@lodash';

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

const defaultValues = {
	acceptTermsConditions: false
};

const PricingInfo = props => {
	const classes = useStyles();

	const { control, formState, handleSubmit } = useForm({
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

	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 2
	});

	function onSubmit(model) {
		// console.log('onSubmit');
		// props.updateStepCount(props.stepCount + 1);
	}

	return (
		<div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0')}>
			{props.costDetails && (
				<div>
					<div>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{`Step ${props.stepCount} - ${props.name}`}
						</Typography>
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
												TOTAL
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
								render={({ field }) => (
									<FormControl className="items-center" error={!!errors.acceptTermsConditions}>
										<FormControlLabel label="I accept charges" control={<Checkbox {...field} />} />
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
								disabled={_.isEmpty(dirtyFields) || !isValid}
								value="legacy"
							>
								Submit
							</Button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(PricingInfo);
