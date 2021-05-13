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

	let showDesc = false;
	if (props.step.stageType === 'AGGREMENTS') {
		showDesc = true;
	}

	function onSubmit(model) {
		// console.log('onSubmit');
		// props.updateStepCount(props.stepCount + 1);
	}

	return (
		<div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0')}>
			{props.step.name && (
				<div>
					<div>
						<Typography className="text-16 sm:text-20 mb-16 truncate font-semibold">
							{`Step ${props.stepCount} - ${props.step.name}`}
						</Typography>
						{showDesc ? (
							<form onSubmit={handleSubmit(onSubmit)}>
								<Box p={1} borderColor="text.primary" border={1} boxShadow={3} borderRadius={12}>
									<Typography>
										Accept charges and time line accept terms & conditions complete formalities
										(fill-in questionnaire) approve charges and make payment download agreement
										upload suggestions/corrections download final draft.Accept charges and time line
										accept terms & conditions complete formalities (fill-in questionnaire) approve
										charges and make payment download agreement upload suggestions/corrections
										download final draft
									</Typography>
								</Box>
								<Controller
									name="acceptTermsConditions"
									control={control}
									render={({ field }) => (
										<FormControl className="items-center" error={!!errors.acceptTermsConditions}>
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
