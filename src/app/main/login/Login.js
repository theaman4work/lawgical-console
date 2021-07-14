import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { submitLogin } from 'app/auth/store/loginSlice';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import AlertMessage from '../register/AlertMessage';

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
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(4, 'Password is too short - should be 4 chars minimum.')
});

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function Login() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);
	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const [status, setStatusBase] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		login.errors.forEach(error => {
			if (error.type === 'custom') {
				setStatusBase({ msg: error.message, key: Math.random() });
			} else {
				setError(error.type, {
					type: 'manual',
					message: error.message
				});
			}
		});
	}, [login.errors, setError]);

	function onSubmit(model) {
		// reset(defaultValues);
		dispatch(submitLogin(model));
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
										label="Password"
										type="password"
										error={!!errors.password}
										helperText={errors?.password?.message}
										variant="outlined"
										InputProps={{
											className: 'pr-2',
											type: showPassword ? 'text' : 'password',
											endAdornment: (
												<InputAdornment position="end">
													<IconButton onClick={() => setShowPassword(!showPassword)}>
														<Icon className="text-20" color="action">
															{showPassword ? 'visibility' : 'visibility_off'}
														</Icon>
													</IconButton>
												</InputAdornment>
											)
										}}
										required
									/>
								)}
							/>

							<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
								<Link className="font-normal" to="/pages/auth/forgot-password-2">
									Forgot Password?
								</Link>
							</div>

							<Button
								variant="contained"
								color="primary"
								className="w-full mx-auto mt-16"
								aria-label="LOG IN"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								classes={{
									root: classes.enabledButton,
									disabled: classes.disabledButton
								}}
								type="submit"
							>
								Login
							</Button>
						</form>

						<div className="my-24 flex flex-col items-center justify-center pb-32">
							<span className="font-normal">
								Don't have an account?&nbsp;&nbsp;
								<Link className="font-normal" to="/register">
									Sign Up
								</Link>
							</span>
							{/* <Link className="font-normal" to="/dashboard">
								Back to Dashboard
							</Link> */}
						</div>
					</CardContent>
				</Card>
				<div className={clsx(classes.rightSection, 'hidden md:flex flex-1 items-center justify-center p-64')}>
					<div className="max-w-320">
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
						>
							<Typography color="inherit" className="text-32 sm:text-44 font-semibold leading-tight">
								Welcome <br /> to the <br />
								Lawgical
							</Typography>
						</motion.div>

						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
							<Typography variant="subtitle1" color="inherit" className="mt-32 font-medium">
								Your Intellectual Property <br />
								our Responsibility.
							</Typography>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

export default Login;
