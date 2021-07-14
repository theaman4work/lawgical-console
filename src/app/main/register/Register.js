import { yupResolver } from '@hookform/resolvers/yup';
import FormHelperText from '@material-ui/core/FormHelperText';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { submitRegister } from 'app/auth/store/registerSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import AlertMessage from './AlertMessage';

const useStyles = makeStyles(theme => ({
	root: {},
	leftSection: {},
	rightSection: {
		// #0494AC- rgb(4, 148, 172)
		// #274760 rgb(39, 71, 96)
		// background: `linear-gradient(to bottom left, rgb(39, 71, 96) 0%, rgb(4, 148, 172) 100%)`,
		background: `linear-gradient(to bottom left, #008096 0%, #00A2BF 100%)`,
		color: theme.palette.primary.contrastText
	},
	disabledButton: {
		backgroundColor: theme.palette.primary || 'grey'
	},
	enabledButton: {
		backgroundColor: '#00A2BF',
		color: '#FFFFFF'
	}
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter your name'),
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(4, 'Password is too short - should be 4 chars minimum.'),
	passwordConfirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
	acceptTermsConditions: yup.boolean().oneOf([true], 'The terms and conditions must be accepted.')
});

const defaultValues = {
	name: '',
	email: '',
	password: '',
	passwordConfirm: ''
	// acceptTermsConditions: false
};

function Register() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const authRegister = useSelector(({ auth }) => auth.register);

	const { control, formState, handleSubmit, reset, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const [status, setStatusBase] = useState('');
	const { isValid, errors } = formState;

	useEffect(() => {
		authRegister.errors.forEach(error => {
			if (error.type === 'custom') {
				setStatusBase({ msg: error.message, key: Math.random() });
			} else {
				setError(error.type, {
					type: 'manual',
					message: error.message
				});
			}
		});
	}, [authRegister.errors, setError]);

	function onSubmit(model) {
		dispatch(submitRegister(model));
	}

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}
		>
			{status ? <AlertMessage key={status.key} message={status.msg} /> : null}
			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				className="flex w-full max-w-400 md:max-w-3xl rounded-20 shadow-2xl overflow-hidden"
			>
				<Card
					className={clsx(
						classes.leftSection,
						'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
					)}
					square
				>
					<CardContent className="flex flex-col items-center justify-center w-full pt-72 pb-24 max-w-320">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
							<img
								className="logo-icon w-240 center pb-20"
								src="assets/images/logos/lawgical_logo_t.png"
								alt="logo"
							/>
						</motion.div>

						<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16"
										type="text"
										label="Name"
										error={!!errors.displayName}
										helperText={errors?.displayName?.message}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<Icon className="text-20" color="action">
														person
													</Icon>
												</InputAdornment>
											)
										}}
										variant="outlined"
										required
									/>
								)}
							/>

							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16"
										type="text"
										error={!!errors.email}
										helperText={errors?.email?.message}
										label="Email"
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<Icon className="text-20" color="action">
														email
													</Icon>
												</InputAdornment>
											)
										}}
										variant="outlined"
										required
									/>
								)}
							/>

							<Controller
								name="password"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16"
										type="password"
										label="Password"
										error={!!errors.password}
										helperText={errors?.password?.message}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<Icon className="text-20" color="action">
														vpn_key
													</Icon>
												</InputAdornment>
											)
										}}
										variant="outlined"
										required
									/>
								)}
							/>

							<Controller
								name="passwordConfirm"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16"
										type="password"
										label="Confirm Password"
										error={!!errors.passwordConfirm}
										helperText={errors?.passwordConfirm?.message}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<Icon className="text-20" color="action">
														vpn_key
													</Icon>
												</InputAdornment>
											)
										}}
										variant="outlined"
										required
									/>
								)}
							/>

							{/* <Controller
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
							/> */}

							<Button
								type="submit"
								variant="contained"
								className="w-full mx-auto mt-16"
								aria-label="REGISTER"
								disabled={!isValid}
								value="legacy"
								classes={{
									root: classes.enabledButton,
									disabled: classes.disabledButton
								}}
							>
								Register
							</Button>
						</form>
					</CardContent>

					<div className="flex flex-col items-center justify-center pb-72">
						<span className="font-normal">
							Already have an account?&nbsp;&nbsp;
							<Link className="font-normal" to="/login">
								Login
							</Link>
						</span>
					</div>
				</Card>

				<div className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}>
					<div className="max-w-320">
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						>
							<Typography color="inherit" className="text-32 sm:text-44 font-semibold leading-tight">
								Welcome <br />
								to the <br /> Lawgical
							</Typography>
						</motion.div>

						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
							<Typography variant="subtitle1" color="inherit" className="mt-32 font-medium">
								Your Intellectual Property <br /> our Responsibility
							</Typography>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default Register;
