import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { memo, useState, useMemo, forwardRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import JSEncrypt from 'jsencrypt';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateData } from '../../store/serviceStepsSlice';
import { selectResponseCustomerCopyrightDetailsAndAttachments } from '../../store/responseCustomerCopyrightDetailsAndAttachmentsSlice';
import { applicantTypesList } from '../applicantTypeList';
import axios from 'axios';
import Razorpay from 'razorpay';

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

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	acceptTermsConditions: yup.boolean().oneOf([true], 'Charges must be accepted.')
});

const CartAndPayment = props => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [map, setMap] = useState('applicantDetails');
	const [razorpayOrderId, setRazorpayOrderId] = useState('');
	useEffect(() => {
        // Load Razorpay library dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup: Remove the script when the component unmounts
            document.body.removeChild(script);
        };
    }, []);
	const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);

	const responseCustomerCopyrightDetailsAndAttachments = useSelector(
		selectResponseCustomerCopyrightDetailsAndAttachments
	);

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});

	const [dialog, setDialog] = useState({
		open: false,
		applicantsData: null,
		tradeMarksData: null
	});

	const platformCharges = (props.costDetails.platformCharges / 100) * props.costDetails.baseAmount;
	const platformAndBaseTotal = props.costDetails.baseAmount + platformCharges;

	let tax =
		(props.costDetails.cgst / 100) * platformAndBaseTotal + (props.costDetails.sgst / 100) * platformAndBaseTotal;

	if (props.costDetails.igst !== null) {
		tax += (props.costDetails.igst / 100) * platformAndBaseTotal;
	}

	const total = platformAndBaseTotal + tax;

	const chargesToBePaid = total;

	let stageStatus =
		props.lserviceStageTransaction != null
			? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
				? 1
				: 0
			: 0;

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			// eslint-disable-next-line
			// acceptTermsConditions: stageStaus === 1 ? true : false
		},
		resolver: yupResolver(schema)
	});

	const paymentHandler = async () => {
		const allFinalAmountToBePaid = formatter.format(chargesToBePaid + props.govtCharges);
		console.log('final amount to be paid', allFinalAmountToBePaid);

		// Convert to number
		const amountNumber = parseFloat(allFinalAmountToBePaid.replace(/[^0-9.-]+/g,""));
		console.log('amountNumber', amountNumber);

		// Extract the whole number part
		const wholeNumber = Math.floor(amountNumber);
		console.log('wholeNumber', wholeNumber);

		// Convert the decimal part to paisa
		const decimalPart = Math.round((amountNumber % 1) * 100);
		console.log('decimalPart', decimalPart);

		// Combine whole number and paisa
		const amountInPaisa = wholeNumber * 100 + decimalPart;

		console.log('final amountInPaisa', amountInPaisa);


		try {
            // Step 1: Create Razorpay order
            //const response = await axios.post('YOUR_PHP_SERVER_URL/razorpay.php');
            const { id } = 123;
            setRazorpayOrderId(id);

            // Step 2: Set up Razorpay options
            const options = {
                key: 'rzp_test_sC6p5nCMQEu05y',
                amount: amountInPaisa, // Amount in paisa
                currency: 'INR',
                name: 'Your Company Name',
                description: 'Payment for your order',
                order_id: id,
				handler: function (response) {
                    // Step 4: Handle successful payment on the client side
                    handlePaymentSuccess(response);
                },
                prefill: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    contact: '9876543210',
                },
            };

            // Step 4: Open Razorpay modal
            let razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error creating order:', error);
        }
	};

	const handlePaymentSuccess = async (response) => {
        try {
            // Simulate server-side payment verification (Replace with your actual logic)
            const verifyResponse = await verifyPaymentOnServer({
                payment_id: response.razorpay_payment_id,
                order_id: razorpayOrderId,
            });
			console.log('responseresponse',response);
            // Step 7: Redirect to Thank You page if payment is successful
            if (verifyResponse.success) {
                console.log('Payment successful! Redirecting to Thank You page.');
                // window.location.href = '/thankyou';
            } else {
                console.log('Payment verification failed.');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
        }
    };

	const verifyPaymentOnServer = (data) => {
        // Simulate server-side payment verification (Replace with your actual logic)
        return Promise.resolve({
            success: true,
        });
    };

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

		if (props.lserviceTransaction.id == null && props.aggrementStatus !== 0 && props.applicantsStatus.length <= 0) {
			message = 'Please complete the previous steps before trying to complete this step!';
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
			stageStatus = 1;

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

	function submitCCavenueForm(encryptedRequest, accessCode, merchantId, orderId, amount, redirectUrl, cancelUrl) {
		const form = document.createElement('form');
		// form.action = 'https://apitest.ccavenue.com/apis/servlet/DoWebTrans';
		form.action = 'https://secure.ccavenue.com/transaction/initTrans';
		form.method = 'POST';

		const addField = (name, value) => {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = value;
			form.appendChild(input);
		};

		addField('merchant_param2', 'test');
		addField('billing_name', 'Temp111');
		addField('billing_email', 'jaydeep@vedanshis.com');
		addField('billing_tel', '9876543210');
		addField('order_id', orderId);
		addField('access_code', accessCode);
		addField('merchant_id', merchantId);
		addField('amount', amount);
		addField('currency', 'INR');
		addField('redirect_url', redirectUrl);
		addField('cancel_url', cancelUrl);
		addField('language', 'EN');
		addField('merchant_param3', 'test');
		addField('billing_country', 'India');
		addField('billing_city', 'Bangalore');
		addField('billing_state', 'Karnataka');
		addField('billing_zip', '560001');
		addField('request_type', 'XML');
		addField('response_type', 'JSON');
		addField('version', '1.1');
		addField('command', 'confirmOrder');
		addField('language', 'EN');
		addField('enc_request', encryptedRequest);
		// addField('enc_request', encryptedRequest);
		document.body.appendChild(form);
		form.submit();
	}

	function encryptRSA(data, publicKey) {
		const encrypt = new JSEncrypt();
		encrypt.setPublicKey(publicKey);
		const encryptedData = encrypt.encrypt(data);
		return encryptedData;
	}

	function handleOpenDialog(applicants) {
		setDialog({
			open: true,
			applicantsData: applicants
		});
	}

	const findClassname = (classificationDTOs, idreq) => {
		const el = classificationDTOs.find(eltemp => eltemp.id === idreq); // Possibly returns `undefined`
		return `${el.name}` || null; // so check result is truthy and extract `id`
	};

	const findClassificationDescUsingId = (classificationDTOs, classificationId) => {
		if (classificationDTOs.length > 0) {
			for (let i = 0; i < classificationDTOs.length; i += 1) {
				if (classificationDTOs[i].id === parseInt(classificationId, 10)) {
					return classificationDTOs[i].info;
				}
			}
		}
		return 'Class Description';
	};

	return (
		<>
			<div>
				{useMemo(() => {
					function handleCloseDialog() {
						setDialog({
							...dialog,
							open: false
						});
					}

					const findApplicantTypeLabel = enumVal => {
						const el = applicantTypesList.find(eltemp => eltemp.code === enumVal);
						if (el) {
							return el.label;
						}
						return 'Other';
					};

					return (
						<Dialog
							classes={{
								paper: 'm-24'
							}}
							open={dialog.open}
							onClose={handleCloseDialog}
							aria-labelledby="service-applications-list"
							TransitionComponent={Transition}
							fullWidth
							maxWidth="sm"
						>
							<AppBar position="static" elevation={0} className="items-center">
								<Typography variant="h6" color="inherit" className="p-16 items-center">
									{serviceSteps.lserviceDTO.name} -(
									{serviceSteps.lserviceTransactionDTO.lablelByUser != null
										? serviceSteps.lserviceTransactionDTO.lablelByUser
										: serviceSteps.lserviceTransactionDTO.sysGenName}
									)
								</Typography>
							</AppBar>
							<DialogContent className="w-auto justify-center">
								{props.applicantsStatus && (
									<Accordion
										className="border-0 shadow-0 overflow-hidden"
										expanded={map === `applicantDetails`}
										key={props.step.stageType}
										onChange={() => setMap(map !== `applicantDetails` ? `applicantDetails` : false)}
									>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											classes={{ root: 'border border-solid rounded-16 mb-16' }}
										>
											<Typography className="font-semibold">Applicant Details</Typography>
										</AccordionSummary>
										<AccordionDetails className="flex flex-col md:flex-col -mx-8">
											{props.applicantsStatus.map((applicantData, index) => {
												return (
													<Table
														key={applicantData.applicantDTO.id - 3}
														className="mb-16"
														sx={{ border: 1 }}
													>
														<TableBody>
															<TableRow key={applicantData.applicantDTO.id - 1}>
																<TableCell colSpan={2}>
																	<Typography variant="subtitle2" className="italic">
																		Applicant #{index + 1}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id}>
																<TableCell>
																	<Typography>Name</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.name}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 1}>
																<TableCell>
																	<Typography>Address</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{
																			// strings appended for address
																		}
																		{`${applicantData.addressDTO.addressLine1}, ${
																			applicantData.addressDTO.addressLine2 !==
																			null
																				? `${applicantData.addressDTO.addressLine2}, `
																				: ''
																		} ${applicantData.addressDTO.city}, 
																		${applicantData.addressDTO.pincode}, ${applicantData.addressDTO.state}, 
																		${applicantData.addressDTO.country}`}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 2}>
																<TableCell>
																	<Typography>Nationality</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.nationality}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 3}>
																<TableCell>
																	<Typography>Contact No</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.contactPhoneNo}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 4}>
																<TableCell>
																	<Typography>Email</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{applicantData.applicantDTO.contactEmail}
																	</Typography>
																</TableCell>
															</TableRow>
															<TableRow key={applicantData.applicantDTO.id + 5}>
																<TableCell>
																	<Typography>Nature Of Applicant</Typography>
																</TableCell>
																<TableCell className="px-16">
																	<Typography color="textSecondary">
																		{findApplicantTypeLabel(
																			applicantData.applicantDTO.type
																		)}
																	</Typography>
																</TableCell>
															</TableRow>
															{applicantData.applicantDTO.partnersName !== null && (
																<TableRow key={applicantData.applicantDTO.id + 5}>
																	<TableCell>
																		<Typography>Partners Name</Typography>
																	</TableCell>
																	<TableCell className="px-16">
																		<Typography color="textSecondary">
																			{applicantData.applicantDTO.partnersName}
																		</Typography>
																	</TableCell>
																</TableRow>
															)}
														</TableBody>
													</Table>
												);
											})}
										</AccordionDetails>
									</Accordion>
								)}
							</DialogContent>
							<DialogActions className="justify-center">
								<Button
									onClick={handleCloseDialog}
									color="primary"
									variant="contained"
									size="medium"
									aria-label="closePopup"
								>
									Close
								</Button>
							</DialogActions>
						</Dialog>
					);
				}, [
					dialog,
					map,
					props.applicantsStatus,
					props.step.stageType,
					serviceSteps.lserviceDTO.name,
					serviceSteps.lserviceTransactionDTO.lablelByUser,
					serviceSteps.lserviceTransactionDTO.sysGenName
				])}
			</div>
			<div className={clsx(classes.root, 'flex-grow flex-shrink-0 p-0')}>
				{props.costDetails && (
					<div>
						<div>
							<div className="flex items-center justify-between pb-10">
								<Typography className="text-16 sm:text-20 truncate font-semibold">
									{`Step ${props.stepCount} - ${props.step.name}`}
								</Typography>
								{
									// eslint-disable-next-line
									(props.applicantsStatus.length > 0 ) && (
										<Button
											variant="contained"
											color="primary"
											size="medium"
											aria-label="addnew"
											onClick={() => handleOpenDialog(props.applicantsStatus)}
										>
											Preview
										</Button>
									)
								}
							</div>

							<form onSubmit={handleSubmit(onSubmit)}>
								<Table className="simple mt-12">
									<TableBody>
										<TableRow>
											<TableCell>
												<Typography
													className="font-normal"
													variant={
														props.costDetails.isGovtChargesApplicable === true
															? 'subtitle1'
															: 'h6'
													}
													color="textSecondary"
												/>
											</TableCell>
											<TableCell align="right">
												<Typography
													className="font-normal"
													variant={
														props.costDetails.isGovtChargesApplicable === true
															? 'subtitle1'
															: 'h6'
													}
													color="textSecondary"
												>
													{formatter.format(chargesToBePaid)}
												</Typography>
											</TableCell>
										</TableRow>
										{props.costDetails.isGovtChargesApplicable === true && (
											<>
												<TableRow>
													<TableCell>
														<Typography
															className="font-normal"
															variant="subtitle1"
															color="textSecondary"
														>
															GOVT. CHARGES
														</Typography>
													</TableCell>
													<TableCell align="right">
														<Typography
															className="font-normal"
															variant="subtitle1"
															color="textSecondary"
														>
															{formatter.format(props.govtCharges)}
														</Typography>
													</TableCell>
												</TableRow>

												<TableRow>
													<TableCell>
														<Typography
															className="font-light"
															variant="h5"
															color="textSecondary"
														>
															TOTAL
														</Typography>
													</TableCell>
													<TableCell align="right">
														<Typography
															className="font-light"
															variant="h5"
															color="textSecondary"
														>
															{formatter.format(chargesToBePaid + props.govtCharges)}
														</Typography>
													</TableCell>
												</TableRow>
											</>
										)}
									</TableBody>
								</Table>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									className="w-full mx-auto mt-16"
									aria-label="REGISTER"
									value="legacy"
									disabled={stageStatus === 1}
									onClick={paymentHandler}
								>
									{stageStatus === 1 ? 'Payment Completed' : 'Payment'}
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
		</>
	);
};

export default memo(CartAndPayment);
