import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { memo } from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
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

const defaultValues = {
	acceptTermsConditions: false
};

const ConfidentialityAgreement = props => {
	const classes = useStyles();

	const { control, formState, handleSubmit } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	// console.log('ConfidentialityAgreement props');
	// console.log(props);

	const stageStaus =
		props.lserviceStageTransaction != null
			? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
				? 1
				: 0
			: 0;

	const desc = props.stageContent && props.stageContent.desc != null ? props.stageContent.desc : '';

	function onSubmit(model) {
		// console.log('onSubmit');
		// save serviceStageTransaction data
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
									render={({ field }) => (
										<FormControl
											className="items-center mt-10"
											error={!!errors.acceptTermsConditions}
										>
											<FormControlLabel
												label="I read and accept terms and conditions"
												control={<Checkbox {...field} />}
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
									disabled={_.isEmpty(dirtyFields) || !isValid}
									value="legacy"
								>
									Submit
								</Button>
							</form>
						) : (
							''
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(ConfidentialityAgreement);
