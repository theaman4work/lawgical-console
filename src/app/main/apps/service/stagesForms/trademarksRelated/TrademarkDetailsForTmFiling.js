import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDeepCompareEffect } from '@fuse/hooks';
import { memo, useState, useEffect, useMemo, forwardRef } from 'react';
import format from 'date-fns/format';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import WbIncandescentIcon from '@material-ui/icons/WbIncandescent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip';
import { GetApp } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FuseLoading from '@fuse/core/FuseLoading';
import { axiosInstance } from 'app/auth-service/axiosInstance';
import {
	addResponseCustomerTrademarkDetailsAndAttachments,
	selectResponseCustomerTrademarkDetailsAndAttachments,
	getResponseCustomerTrademarkDetailsAndAttachments,
	updateResponseCustomerTrademarkDetailsAndAttachments
} from '../../store/responseCustomerTrademarkDetailsAndAttachmentsSlice';
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

const defaultValues = {
	classification: 'Class 1 (Chemicals)',
	word: '',
	image: '',
	switchForImageAndWord: 'word',
	startDateOfUsage: '',
	switchForDateAndCheckbox: 'dateOfUsage',
	isProposeToBeUsed: false,
	description: ''
};

/**
 * Form Validation Schema
 */
const FILE_SIZE = 8 * 8;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg'];

const schema = yup.object().shape({
	classification: yup.string().required('You must enter a Classification').nullable(),
	switchForImageAndWord: yup.string().required('Upload type is required'),
	word: yup.string().when('switchForImageAndWord', {
		is: 'word',
		then: yup
			.string()
			.max(200, 'Word must be less than or equal to 200 characters')
			.required('You must enter a Word')
			.nullable()
	}),
	// selectedImage: yup.string().when('switchForImageAndWord', {
	// 	is: 'image',
	// 	then: yup
	// 		.object()
	// 		.required('An Image is required')
	// 		.test('fileSize', 'File too large', value => value && value.size <= FILE_SIZE)
	// 		.test('fileFormat', 'Unsupported Format', value => value && SUPPORTED_FORMATS.includes(value.type)),
	// 	otherwise: yup.mixed().notRequired()
	// }),
	description: yup
		.string()
		.max(200, 'Description must be less than or equal to 200 characters')
		.required('You must enter a Description'),
	switchForDateAndCheckbox: yup.string().required('Date type is required'),
	startDateOfUsage: yup.string().when('switchForDateAndCheckbox', {
		is: 'dateOfUsage',
		then: yup.string().required('You must provide a Date').nullable()
	}),
	isProposeToBeUsed: yup.boolean().when('switchForDateAndCheckbox', {
		is: 'proposeToBeUsed',
		then: yup.boolean().oneOf([true], 'Propose To be used must be selected.').nullable()
	})
});

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const TrademarkDetailsForTmFiling = props => {
	const classes = useStyles(props);
	const dispatch = useDispatch();

	const responseCustomerTrademarkDetailsAndAttachments = useSelector(
		selectResponseCustomerTrademarkDetailsAndAttachments
	);

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
	const [stateCustomerTrademarkDetailsId, setStateCustomerTrademarkDetailsId] = useState(null);
	const [stateAttachmentId, setStateAttachmentId] = useState(null);
	const [dialog, setDialog] = useState({
		open: false,
		imageUrl: null,
		imageName: null
	});
	const [showDateOrCheckBox, setShowDateOrCheckBox] = useState(1);

	// let stageStaus =
	// 	props.lserviceStageTransaction != null
	// 		? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
	// 			? 1
	// 			: 0
	// 		: 0;

	const { control, reset, handleSubmit, formState, watch } = useForm({
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

	const [classificationDesc, setClassificationDesc] = useState(
		props.classificationDTOs[0].info ? props.classificationDTOs[0].info : 'Class Description'
	);

	const formatter = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 2
	});

	useEffect(() => {
		if (props.pricingInfoStatus === 0 && props.lserviceTransaction.id !== null) {
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
						setStateLserviceStageTransactionId(res.data.lserviceStageTransactionDTO.id);
					});
			}
		}
	}, [
		props.step.id,
		props.step.lserviceId,
		props.lserviceStageTransaction,
		props.lserviceTransaction,
		props.pricingInfoStatus
	]);

	useDeepCompareEffect(() => {
		dispatch(getResponseCustomerTrademarkDetailsAndAttachments()).then(() => setLoading(false));
	}, [dispatch]);

	// eslint-disable-next-line
	useEffect(() => {
		let data = '';
		if (props.lserviceStageTransaction !== null) {
			data = findMatchingCustomerTradeMarkRecordAlongWithAttachment(
				responseCustomerTrademarkDetailsAndAttachments,
				props.lserviceStageTransaction.id
			);
		} else {
			data = findMatchingCustomerTradeMarkRecordAlongWithAttachment(
				responseCustomerTrademarkDetailsAndAttachments,
				stateLserviceStageTransactionId
			);
		}

		if (data) {
			const word = data.customerTrademarkDetailsDTO.word !== '' ? data.customerTrademarkDetailsDTO.word : '';
			const typeOfUpload = data.customerTrademarkDetailsDTO.typeForTm === 'WORD' ? 'word' : 'image';
			const desc = data.customerTrademarkDetailsDTO.desc ? data.customerTrademarkDetailsDTO.desc : '';

			const classfication = findClassificationTxtUsingId(
				props.classificationDTOs,
				data.customerTrademarkDetailsDTO.classficationId
			);
			const typeOfUsage = data.customerTrademarkDetailsDTO.isProposeToBeUsed ? 'proposeToBeUsed' : 'dateOfUsage';
			// eslint-disable-next-line
			const isProposeToBeUsed = data.customerTrademarkDetailsDTO.isProposeToBeUsed;

			setStateCustomerTrademarkDetailsId(data.customerTrademarkDetailsDTO.id);
			if (data.attachmentDTO) {
				if (data.attachmentDTO.id) {
					setStateAttachmentId(data.attachmentDTO.id);
				}
			}
			if (typeOfUpload === 'image') {
				if (data.attachmentDTOs) {
					if (data.attachmentDTOs[0].id) {
						const imageData = {
							name: data.attachmentDTOs[0].attachmentName
						};
						setImage(imageData);
						setImageUrl(data.attachmentDTOs[0].url);
						setShowUploadOrText(1);
					}
				}
			}

			let startDateOfUsage = '';
			if (typeOfUsage === 'dateOfUsage') {
				startDateOfUsage = data.customerTrademarkDetailsDTO.startDateOfUsage
					? data.customerTrademarkDetailsDTO.startDateOfUsage.replace(/T.*$/g, '')
					: '';
				setShowDateOrCheckBox(1);
			} else {
				setShowDateOrCheckBox(2);
			}

			if (data.customerTrademarkDetailsDTO.classficationId != null) {
				if (props.classificationDTOs.length > 0) {
					for (let i = 0; i < props.classificationDTOs.length; i += 1) {
						if (
							props.classificationDTOs[i].id ===
							parseInt(data.customerTrademarkDetailsDTO.classficationId, 10)
						) {
							setClassificationDesc(props.classificationDTOs[i].info);
						}
					}
				} else {
					setClassificationDesc('Class Description');
				}
			}

			reset({
				classification: classfication,
				word,
				// image: '',
				switchForImageAndWord: typeOfUpload,
				description: desc,
				startDateOfUsage,
				switchForDateAndCheckbox: typeOfUsage,
				isProposeToBeUsed
			});
		}

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
	}, [
		progress,
		props.lserviceStageTransaction,
		responseCustomerTrademarkDetailsAndAttachments,
		stateLserviceStageTransactionId,
		reset,
		props.classificationDTOs
	]);

	function setProvisionCostAfterItemAdd(count) {
		if (count !== 0) {
			setProvisionalCost(totalCost * count);
		} else {
			setProvisionalCost(totalCost);
		}
	}

	const findClassificationTxtUsingId = (classificationDTOs, classficationId) => {
		const el = classificationDTOs.find(eltemp => eltemp.id === classficationId);
		return `${el.name} ${el.label}` || null; // so check result is truthy
	};

	const findMatchingCustomerTradeMarkRecordAlongWithAttachment = (
		customerTrademarkDetailsAndAttachments,
		transactionId
	) => {
		const el = customerTrademarkDetailsAndAttachments.find(
			eltemp => eltemp.customerTrademarkDetailsDTO.lserviceStageTransactionId === transactionId
		);
		return el || null; // so check result is truthy and extract record
	};

	const findClassificationDescUsingId = classificationId => {
		if (props.classificationDTOs.length > 0) {
			for (let i = 0; i < props.classificationDTOs.length; i += 1) {
				if (props.classificationDTOs[i].id === parseInt(classificationId, 10)) {
					return props.classificationDTOs[i].info;
				}
			}
		}
		return 'Class Description';
	};

	function getCurrentDate() {
		const currentDate = new Date();
		const date = currentDate.getDate();
		const month = currentDate.getMonth() + 1;
		const year = currentDate.getFullYear();

		return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date}`;
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

		if (props.lserviceTransaction.id == null || props.applicantsStatus.length <= 0) {
			message = 'Please complete the previous step before trying to complete this step!';
			open = true;
		} else {
			// Upload image if type is image
			// eslint-disable-next-line
			let dateArray = [];
			let startDateOfUsage = '';
			let startDateOfUsageToBeSent = '';
			if (model.switchForDateAndCheckbox === 'dateOfUsage') {
				dateArray = model.startDateOfUsage.split('-');
				startDateOfUsage = format(new Date(dateArray[0], dateArray[1] - 1, dateArray[2]), 'yyyy-MM-dd');
				startDateOfUsageToBeSent = `${startDateOfUsage}T00:00:00Z`;
			}

			const classficationId = model.classification.replace(/^\D+|\D+$/g, '');

			if (model.switchForImageAndWord === 'image') {
				if (image == null) {
					message = 'Failed to upload image on server, it is empty, please upload it again!';
					open = true;
					setProgress(0);
					setMessageAndLevel({
						message,
						open,
						level
					});
				} else {
					const { imageForUpload } = image;
					// eslint-disable-next-line
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
								// console.log(progressDone);
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
									startDateOfUsage:
										model.switchForDateAndCheckbox === 'dateOfUsage'
											? startDateOfUsageToBeSent
											: null,
									desc: model.description,
									isProposeToBeUsed: model.switchForDateAndCheckbox === 'dateOfUsage' ? null : true,
									lserviceStageTransactionId: lserviceStageTransactionIdForData
								};
								if (stateCustomerTrademarkDetailsId) {
									customerTrademarkDetailsDTO.id = stateCustomerTrademarkDetailsId;
								}
								const attachmentDTO = {
									attachmentName: image.name,
									url: downloadURL,
									attachmentType: 'IMAGE'
								};
								if (stateAttachmentId) {
									attachmentDTO.id = stateAttachmentId;
								}
								const attachmentDTOs = [attachmentDTO];
								const reqData = {
									customerTrademarkDetailsDTO,
									attachmentDTOs,
									email: localStorage.getItem('lg_logged_in_email')
								};

								if (stateCustomerTrademarkDetailsId) {
									reqData.id = stateCustomerTrademarkDetailsId;
									dispatch(updateResponseCustomerTrademarkDetailsAndAttachments(reqData));
									message = 'Data updated successfully.';
								} else {
									dispatch(addResponseCustomerTrademarkDetailsAndAttachments(reqData));
									message = 'Data saved successfully.';
								}
								// stageStaus = 1;
								open = true;
								level = 'success';
								setProgress(0);
								// console.log(message);
								// setImage(null);
								setMessageAndLevel({
									message,
									open,
									level
								});
							}
						);
					}
					// image name check (if) ends here

					Promise.allSettled(promises)
						// .then(() => console.log('All images successfully uploaded'))
						.catch(err => {
							// console.log(err.code);
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
					startDateOfUsage: model.switchForDateAndCheckbox === 'dateOfUsage' ? startDateOfUsageToBeSent : '',
					desc: model.description,
					isProposeToBeUsed: model.switchForDateAndCheckbox === 'dateOfUsage' ? null : true,
					lserviceStageTransactionId: lserviceStageTransactionIdForData
				};
				if (stateCustomerTrademarkDetailsId) {
					customerTrademarkDetailsDTO.id = stateCustomerTrademarkDetailsId;
				}
				const reqData = {
					customerTrademarkDetailsDTO,
					email: localStorage.getItem('lg_logged_in_email')
				};

				if (stateCustomerTrademarkDetailsId) {
					reqData.id = stateCustomerTrademarkDetailsId;
					dispatch(updateResponseCustomerTrademarkDetailsAndAttachments(reqData));
					message = 'Data updated successfully.';
				} else {
					dispatch(addResponseCustomerTrademarkDetailsAndAttachments(reqData));
					message = 'Data saved successfully.';
				}
				// stageStaus = 1;
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

	function handleOpenDialog(url, name) {
		setDialog({
			open: true,
			imageUrl: url,
			imageName: name
		});
	}

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
					<div>
						<div>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{`Step ${props.stepCount} - ${props.step.name}`}
							</Typography>
							<form className="justify-items-center mb-20 mt-20" onSubmit={handleSubmit(onSubmit)}>
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
													const classficationId = newValue.replace(/^\D+|\D+$/g, '');
													onChange(newValue);
													setClassificationDesc(
														findClassificationDescUsingId(classficationId)
													);
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

									<div>
										<Tooltip className="h-full" title={classificationDesc}>
											<IconButton>
												<WbIncandescentIcon />
											</IconButton>
										</Tooltip>
									</div>
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
											render={({ field: { onChange } }) => (
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
												control={control}
												defaultValue=""
												required
												render={({ field: { onChange } }) => (
													// eslint-disable-next-line
													<div
														role="button"
														onClick={() => handleOpenDialog(imageUrl, image.name)}
														name="selectedImage"
														id="selectedImage"
														tabIndex={0}
														className={clsx(
															classes.productImageItem,
															'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg'
														)}
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

								<div className="flex">
									<Controller
										name="description"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												className="mt-8 mb-16"
												id="description"
												label="Description of goods/services"
												type="text"
												multiline
												rows={2}
												variant="outlined"
												error={!!errors.description}
												helperText={errors?.description?.message}
												fullWidth
												required
											/>
										)}
									/>
								</div>

								<div className="flex">
									<Controller
										name="switchForDateAndCheckbox"
										control={control}
										render={({ field }) => (
											<FormControl component="fieldset" className="mt-8 mb-12 w-full">
												<RadioGroup
													{...field}
													aria-label="TM Filing Date Type"
													className="justify-center"
													row
													onChange={(event, newValue) => {
														field.onChange(newValue);
														if (event.target.value === 'dateOfUsage') {
															// show date of usage
															setShowDateOrCheckBox(1);
														} else {
															// show checkbox
															setShowDateOrCheckBox(2);
														}
													}}
												>
													<FormControlLabel
														className="text-8"
														key="dateOfUsage"
														value="dateOfUsage"
														control={<Radio />}
														label="Date Of Usage"
													/>
													<FormControlLabel
														className="text-8"
														key="proposeToBeUsed"
														value="proposeToBeUsed"
														control={<Radio />}
														label="Propose To Be Used"
													/>
												</RadioGroup>
											</FormControl>
										)}
									/>
								</div>

								{showDateOrCheckBox === 1 && (
									<div className="flex">
										<Controller
											control={control}
											name="startDateOfUsage"
											render={({ field }) => (
												<TextField
													{...field}
													className="mb-24"
													id="startDateOfUsage"
													label="Start Date Of Trademark Usage"
													type="date"
													InputProps={{ inputProps: { max: getCurrentDate() } }}
													InputLabelProps={{
														shrink: true
													}}
													variant="outlined"
													fullWidth
													required
												/>
											)}
										/>
									</div>
								)}

								{showDateOrCheckBox === 2 && (
									<div className="flex justify-center">
										<Controller
											name="isProposeToBeUsed"
											control={control}
											required
											render={({ field: { onChange, onBlur, value, name, ref } }) => (
												<FormControl
													className="items-center"
													// eslint-disable-next-line
													// disabled={stageStaus === 1 ? true : false}
													error={!!errors.isProposeToBeUsed}
												>
													<FormControlLabel
														label="Propose To Be Used"
														control={
															<Checkbox onChange={onChange} checked={value} name={name} />
														}
													/>
													<FormHelperText>
														{errors?.isProposeToBeUsed?.message}
													</FormHelperText>
												</FormControl>
											)}
										/>
									</div>
								)}

								<Button
									type="submit"
									variant="contained"
									color="primary"
									className="w-full mx-auto mt-16"
									aria-label="Submit"
									disabled={_.isEmpty(dirtyFields) || !isValid}
									value="legacy"
								>
									Submit
								</Button>
							</form>
							{progress !== 0 && <LinearProgressWithLabel value={progress} />}
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
							<Divider className="mt-20" />
							<div className="mt-20 w-full flex items-center justify-center">
								<FuseScrollbars className="flex-grow overflow-x-auto">
									<Table
										stickyHeader
										className={classes.table}
										size="small"
										aria-labelledby="tableTitle"
									>
										<TableHead>
											<TableRow>
												<TableCell>Document</TableCell>
												<TableCell>Link</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{props.stage.poaDraftUrl && (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.poaDraftUrl.substr(
														props.stage.poaDraftUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														POA
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.poaDraftUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											)}
											{props.stage.affidavitDraftUrl && (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={props.stage.affidavitDraftUrl.substr(
														props.stage.affidavitDraftUrl.length - 4
													)}
												>
													<TableCell component="th" scope="row">
														User Affidavit
													</TableCell>
													<TableCell
														align="center"
														className="w-52 px-4 md:px-0"
														padding="none"
														component="th"
														scope="row"
													>
														<GetApp
															color="primary"
															className={classes.largeIcon}
															onClick={() =>
																window.open(props.stage.affidavitDraftUrl, '_self')
															}
														/>
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</FuseScrollbars>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(TrademarkDetailsForTmFiling);
