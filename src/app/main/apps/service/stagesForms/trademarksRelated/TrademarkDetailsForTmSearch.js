import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { memo, useState, useEffect, useMemo, forwardRef } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FuseLoading from '@fuse/core/FuseLoading';
import { axiosInstance } from 'app/auth-service/axiosInstance';
import { addResponseCustomerTrademarkDetailsAndAttachments } from '../../store/responseCustomerTrademarkDetailsAndAttachmentsSlice';
import SearchRecordsTable from './SearchRecordsTable';
import storage from '../../../../firebase/index';

const useStyles = makeStyles(theme => ({
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	}
}));

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
	classification: 'Class 1 (Chemicals)',
	word: '',
	image: '',
	switchForImageAndWord: 'word'
};

/**
 * Form Validation Schema
 */
const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

const schema = yup.object().shape({
	classification: yup.string().required('You must enter a Classification').nullable(),
	switchForImageAndWord: yup.string().required('Upload type is required')
	// word: yup.string().when('switchForImageAndWord', {
	// 	is: 'word',
	// 	then: yup
	// 		.string()
	// 		.max(250, 'Word must be less than or equal to 250 characters')
	// 		.required('You must enter a word'),
	// 	otherwise: yup.mixed().notRequired()
	// }),
	// image: yup.string().when('switchForImageAndWord', {
	// 	is: 'image',
	// 	then: yup
	// 		.object()
	// 		.required('An Image is required')
	// 		.test('fileSize', 'File too large', value => value && value.size <= FILE_SIZE)
	// 		.test('fileFormat', 'Unsupported Format', value => value && SUPPORTED_FORMATS.includes(value.type)),
	// 	otherwise: yup.mixed().notRequired()
	// })
});

const TrademarkDetailsForTmSearch = props => {
	const classes = useStyles(props);
	const dispatch = useDispatch();

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});
	const [showUploadOrText, setShowUploadOrText] = useState(2);
	const [showImageSelected, setShowImageSelected] = useState(false);
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [loading, setLoading] = useState(true);
	const [stateLserviceStageTransactionId, setStateLserviceStageTransactionId] = useState(null);
	const [dialog, setDialog] = useState({
		open: false,
		imageUrl: null,
		imageName: null
	});

	// let stageStaus =
	// 	props.lserviceStageTransaction != null
	// 		? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
	// 			? 1
	// 			: 0
	// 		: 0;

	const { control, handleSubmit, formState, watch } = useForm({
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

	const [provisionalCost, setProvisionalCost] = useState(total);
	const [totalCost, setTotalCost] = useState(total);

	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 2
	});

	useEffect(() => {
		if (props.pricingInfoStatus === 0 && props.lserviceTransaction && props.lserviceTransaction.id !== null) {
			if (props.lserviceStageTransaction == null) {
				const data = {
					lserviceTransactionId: props.lserviceTransaction.id,
					stageStatus: 'INPROGRESS',
					lserviceStageId: props.step.id,
					lserviceId: props.step.lserviceId
				};

				axiosInstance
					.post('/services/lgrest/api/lservice-stage-transactions/create-transaction-for-customer', {
						email: localStorage.getItem('lg_logged_in_email'),
						...data
					})
					.then(res => {
						setLoading(false);
						setStateLserviceStageTransactionId(res.data.lserviceStageTransactionDTO.id);
					});
			} else {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	}, [
		props.step.id,
		props.step.lserviceId,
		props.lserviceStageTransaction,
		props.lserviceTransaction,
		props.pricingInfoStatus
	]);

	// eslint-disable-next-line
	useEffect(() => {
		if (progress !== 0) {
			const timer = setInterval(() => {
				setProgress(oldProgress => {
					if (oldProgress === 100) {
						return 0;
					}
					return Math.min(oldProgress + 15, 100);
				});
			}, 500);
			return () => {
				clearInterval(timer);
			};
		}
	}, [progress]);

	function setProvisionCostAfterItemAdd(count) {
		if (count !== 0) {
			setProvisionalCost(totalCost * count);
		} else {
			setProvisionalCost(totalCost);
		}
	}

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
		let urlOfImage = '';
		let open = false;
		let level = 'error';

		console.log(props.applicantsStatus);
		const classficationId = model.classification.replace(/^\D+|\D+$/g, '');
		if (props.lserviceTransaction.id == null || props.applicantsStatus.length <= 0) {
			message = 'Please complete the previous step before trying to complete this step!';
			open = true;
		} else {
			// Upload image if type is image
			// eslint-disable-next-line
			if (model.switchForImageAndWord === 'image') {
				if (image == null) {
					message = 'Failed to upload image on server, it is empty!';
					open = true;
					setProgress(0);
					setMessageAndLevel({
						message,
						open,
						level
					});
				} else {
					const { imageForUpload } = image;
					const promises = [];
					if (image.name != null) {
						const uploadTask = storage.ref(`images/${image.name}`).put(image);
						promises.push(uploadTask);
						uploadTask.on(
							'state_changed',
							snapshot => {
								// progress function ...
								const progressDone = Math.round(
									(snapshot.bytesTransferred / snapshot.totalBytes) * 100
								);
								console.log(progressDone);
								if (!Number.isNaN(progressDone)) {
									setProgress(progressDone);
								}
							},
							error => {
								// Error function ...
								message = 'Failed to upload image on server, please try again after some time!';
								open = true;
								setProgress(0);
								setMessageAndLevel({
									message,
									open,
									level
								});
							},
							async () => {
								// complete function ...
								const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
								urlOfImage = downloadURL;

								let lserviceStageTransactionIdForData = null;
								if (props.lserviceStageTransaction == null) {
									lserviceStageTransactionIdForData = stateLserviceStageTransactionId;
								} else {
									lserviceStageTransactionIdForData = props.lserviceStageTransaction.id;
								}

								const customerTrademarkDetailsDTO = {
									classficationId,
									typeForTm: model.switchForImageAndWord === 'word' ? 'WORD' : 'IMAGE',
									status: 'ACTIVE',
									word: '',
									lserviceStageTransactionId: lserviceStageTransactionIdForData
								};
								const attachmentDTO = {
									attachmentName: image.name,
									url: downloadURL,
									attachmentType: 'IMAGE'
								};
								const attachmentDTOs = [attachmentDTO];
								const reqData = {
									customerTrademarkDetailsDTO,
									attachmentDTOs,
									email: localStorage.getItem('lg_logged_in_email')
								};

								dispatch(addResponseCustomerTrademarkDetailsAndAttachments(reqData));
								// stageStaus = 1;
								message = 'Data saved successfully.';
								open = true;
								level = 'success';
								setProgress(0);
								setImage(null);
							}
						);
					}
					// image name check condition ends here

					Promise.allSettled(promises).catch(err => {
						console.log(err.code);
						message = `Failed to upload image on server, please try again after some time- ${err.code}`;
						open = true;
						setProgress(0);
						setMessageAndLevel({
							message,
							open,
							level
						});
					});
				}
			} else {
				let lserviceStageTransactionIdForData = null;
				if (props.lserviceStageTransaction == null) {
					lserviceStageTransactionIdForData = stateLserviceStageTransactionId;
				} else {
					lserviceStageTransactionIdForData = props.lserviceStageTransaction.id;
				}

				const customerTrademarkDetailsDTO = {
					classficationId,
					typeForTm: model.switchForImageAndWord === 'word' ? 'WORD' : 'IMAGE',
					status: 'ACTIVE',
					word: model.word,
					lserviceStageTransactionId: lserviceStageTransactionIdForData
				};
				const reqData = {
					customerTrademarkDetailsDTO,
					email: localStorage.getItem('lg_logged_in_email')
				};

				dispatch(addResponseCustomerTrademarkDetailsAndAttachments(reqData));
				// stageStaus = 1;
				message = 'Data saved successfully.';
				open = true;
				level = 'success';
			}
		}
		setMessageAndLevel({
			message,
			open,
			level
		});
	}

	function handleOpenDialog(url, name) {
		setDialog({
			open: true,
			imageUrl: url,
			imageName: name
		});
	}

	function LinearProgressWithLabel(propsTemp) {
		return (
			<Box display="flex" alignItems="center">
				<Box width="100%" mr={1}>
					<LinearProgress variant="determinate" {...propsTemp} />
				</Box>
				<Box minWidth={35}>
					<Typography variant="body2" color="textSecondary">{`${Math.round(propsTemp.value)}%`}</Typography>
				</Box>
			</Box>
		);
	}

	// if (loading) {
	// 	return <FuseLoading />;
	// }

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

					return (
						<Dialog
							classes={{
								paper: 'm-24'
							}}
							open={dialog.open}
							onClose={handleCloseDialog}
							aria-labelledby="service-applications-list"
							TransitionComponent={Transition}
							style={{ maxWidth: '100%', maxHeight: '100%' }}
						>
							<AppBar position="static" elevation={0} className="items-center">
								<Typography variant="h6" color="inherit" className="p-16 items-center">
									{dialog.title}
								</Typography>
							</AppBar>
							<DialogContent className="w-auto justify-center">
								<img
									style={{ width: 'auto', height: '100%' }}
									src={dialog.imageUrl}
									alt={dialog.imageName}
								/>
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
				}, [dialog])}
			</div>
			{loading ? (
				<FuseLoading />
			) : (
				<div className="flex-grow flex-shrink-0 p-0">
					{props.costDetails && (
						<div>
							<div>
								<Typography className="text-16 sm:text-20 truncate font-semibold">
									{`Step ${props.stepCount} - ${props.step.name}`}
								</Typography>
								<div className="w-full flex items-center justify-end py-20">
									<Typography className="text-12 sm:text-15">
										{`Provisional cost: ${formatter.format(provisionalCost)}`}
									</Typography>
								</div>
								<form className="justify-items-center mb-20" onSubmit={handleSubmit(onSubmit)}>
									<div className="flex">
										<Controller
											name="classification"
											control={control}
											render={({ field: { onChange, value } }) => (
												<Autocomplete
													className="mt-8 mb-12 w-full"
													options={props.classifications}
													value={value}
													onChange={(event, newValue) => {
														onChange(newValue);
													}}
													renderInput={params => (
														<TextField
															{...params}
															label="Choose a classification"
															variant="outlined"
															InputLabelProps={{
																shrink: true
															}}
															error={!!errors.classification}
															helperText={errors?.classification?.message}
															required
														/>
													)}
													required
												/>
											)}
										/>
									</div>

									<div className="flex">
										<Controller
											name="switchForImageAndWord"
											control={control}
											render={({ field }) => (
												<FormControl component="fieldset" className="mt-8 mb-12 w-full">
													<RadioGroup
														{...field}
														aria-label="TM Search Type"
														className="justify-center"
														row
														onChange={(event, newValue) => {
															field.onChange(newValue);
															if (event.target.value === 'image') {
																// show image upload button
																setShowUploadOrText(1);
															} else {
																// show text field for word
																setShowUploadOrText(2);
															}
														}}
													>
														<FormControlLabel
															className="text-8"
															key="image"
															value="image"
															control={<Radio />}
															label="Image"
														/>
														<FormControlLabel
															className="text-8"
															key="word"
															value="word"
															control={<Radio />}
															label="Word"
														/>
													</RadioGroup>
												</FormControl>
											)}
										/>
									</div>

									{showUploadOrText === 2 && (
										<div className="flex">
											<Controller
												control={control}
												name="word"
												render={({ field }) => (
													<TextField
														{...field}
														className="mb-12 w-full"
														label="Word"
														id="word"
														error={!!errors.word}
														helperText={errors?.word?.message}
														variant="outlined"
														required
													/>
												)}
											/>
										</div>
									)}

									{showUploadOrText === 1 && (
										<div className="flex justify-center">
											<Controller
												name="image"
												control={control}
												defaultValue={[]}
												render={({ field: { onChange, value } }) => (
													<label
														htmlFor="button-file"
														className={clsx(
															classes.productImageUpload,
															'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg'
														)}
													>
														<input
															accept="image/*"
															className="hidden"
															id="button-file"
															type="file"
															onChange={async e => {
																const reader = new FileReader();
																const file = e.target.files[0];

																reader.onloadend = () => {
																	setImage(file);
																	setImageUrl(reader.result);
																};
																reader.readAsDataURL(file);
																setShowImageSelected(true);
															}}
														/>
														<Icon fontSize="large" color="action">
															cloud_upload
														</Icon>
													</label>
												)}
											/>
											{image && (
												<Controller
													name="selectedImage"
													required
													control={control}
													defaultValue=""
													render={({ field: { onChange } }) => (
														// eslint-disable-next-line
														<div
															role="button"
															tabIndex={0}
															className={clsx(
																classes.productImageItem,
																'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
															)}
															onClick={() => handleOpenDialog(imageUrl, image.name)}
															key={image.name}
														>
															<img
																className="max-w-none w-auto h-full"
																src={imageUrl}
																alt={image.name}
															/>
														</div>
													)}
												/>
											)}
										</div>
									)}

									<Button
										type="submit"
										variant="contained"
										color="primary"
										className="w-full mx-auto mt-16"
										aria-label="Add"
										disabled={_.isEmpty(dirtyFields) || !isValid}
										value="legacy"
									>
										Add
									</Button>
								</form>
								{progress !== 0 && <LinearProgressWithLabel value={progress} />}
								<Divider className="mt-20" />
								<div className="mt-20 w-full flex items-center justify-center">
									<SearchRecordsTable
										classificationDTOs={props.classificationDTOs}
										onRecordAdditionOrRemoval={setProvisionCostAfterItemAdd}
										lserviceStageTransactionId={
											props.lserviceStageTransaction !== null
												? props.lserviceStageTransaction.id
												: stateLserviceStageTransactionId
										}
									/>
								</div>
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
			)}
		</>
	);
};

export default memo(TrademarkDetailsForTmSearch);
