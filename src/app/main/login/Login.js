import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';

const useStyles = makeStyles(theme => ({
	root: {},
	leftSection: {},
	rightSection: {
		// background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
		// 	theme.palette.primary.dark,
		// 	0.5
		// )} 100%)`,
		background: `linear-gradient(to right, #0494AC 0%, ${darken('#274760', 0.5)} 100%)`,
		color: theme.palette.primary.contrastText
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
		.min(5, 'Password is too short - should be 5 chars minimum.')
});

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function Login() {
	const classes = useStyles();

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}
		>
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

						<form
							name="loginForm"
							noValidate
							className="flex flex-col justify-center w-full"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Controller
								name="email"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16"
										label="Email"
										autoFocus
										type="email"
										error={!!errors.email}
										helperText={errors?.email?.message}
										variant="outlined"
										required
										fullWidth
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
										required
										fullWidth
									/>
								)}
							/>

							<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
								<Controller
									name="remember"
									control={control}
									render={({ field }) => (
										<FormControl>
											<FormControlLabel label="Remember Me" control={<Checkbox {...field} />} />
										</FormControl>
									)}
								/>

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
								type="submit"
							>
								Login
							</Button>
						</form>

						<div className="my-24 flex flex-col items-center justify-center pb-32">
							<span className="font-normal">Don't have an account?</span>
							<Link className="font-normal" to="/register">
								Create an account
							</Link>
							<Link className="font-normal" to="/dashboard">
								Back to Dashboard
							</Link>
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
