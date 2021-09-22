import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { useDeepCompareEffect } from '@fuse/hooks';
import { memo, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
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
	poa: undefined,
	msmeCert: undefined,
	userAff: undefined,
	evdOfUse: undefined
};

/**
 * Form Validation Schema
 */
const FILE_SIZE = 8 * 8;
const SUPPORTED_FORMATS = ['application/pdf'];

const schema = yup.object().shape({
	poa: yup.mixed().nullable(),
	msmeCert: yup.mixed().nullable(),
	userAff: yup.mixed().nullable(),
	evdOfUse: yup.mixed().nullable(),
	salesFigure: yup.mixed().nullable(),
	marketingDetail: yup.mixed().nullable(),
	otherDoc: yup.mixed().nullable()
});

const UploadsForTrademarkServices = props => {
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

	const [progress, setProgress] = useState(0);
	const [poaUpload, setPoaUpload] = useState(null);
	const [msmeCert, setMsmeCert] = useState(null);
	const [userAffi, setUserAffi] = useState(null);
	const [evdOfUsePdf, setEvdOfUsePdf] = useState(null);
	const [salesFigure, setSalesFigure] = useState(null);
	const [marketingDetail, setMarketingDetail] = useState(null);
	const [otherDoc, setOtherDoc] = useState(null);
	const [artWork, setArtWork] = useState(null);
	const [loading, setLoading] = useState(true);
	const [stateLserviceStageTransactionId, setStateLserviceStageTransactionId] = useState(null);
	const [stateCustomerTrademarkDetailsId, setStateCustomerTrademarkDetailsId] = useState(null);
	const [statePoaId, setStatePoaId] = useState(null);
	const [stateMsmeCertId, setStateMsmeCertId] = useState(null);
	const [stateUserAffiId, setStateUserAffiId] = useState(null);
	const [stateEvdOfUsePdfId, setStateEvdOfUsePdfId] = useState(null);
	const [stateSalesFigureId, setStateSalesFigureId] = useState(null);
	const [stateMarketingDetailId, setStateMarketingDetailId] = useState(null);
	const [stateOtherDocId, setStateOtherDocId] = useState(null);
	const [stateArtWorkId, setStateArtWorkId] = useState(null);

	// let stageStaus =
	// 	props.lserviceStageTransaction != null
	// 		? props.lserviceStageTransaction.stageStaus === 'COMPLETED'
	// 			? 1
	// 			: 0
	// 		: 0;

	const { control, reset, handleSubmit, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

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
			// console.log(data);
			setStateCustomerTrademarkDetailsId(data.customerTrademarkDetailsDTO.id);

			if (data.customerTrademarkDetailsDTO.typeForTm === 'DOCUMENT') {
				if (props.trademarkServiceUploadType !== 6) {
					const poaAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.poaId
					);
					if (poaAttachment) {
						const poaData = {
							name: poaAttachment.attachmentName
						};
						setPoaUpload(poaData);
						setStatePoaId(data.customerTrademarkDetailsDTO.poaId);
					}
				}
				if (props.trademarkServiceUploadType === 2) {
					const msmeAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.msmeCertId
					);
					if (msmeAttachment) {
						const msmeData = {
							name: msmeAttachment.attachmentName
						};
						setMsmeCert(msmeData);
						setStateMsmeCertId(data.customerTrademarkDetailsDTO.msmeCertId);
					}
				}
				if ([2, 3, 4].includes(props.trademarkServiceUploadType)) {
					const userAffiAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.userAffId
					);
					if (userAffiAttachment) {
						const userAffiData = {
							name: userAffiAttachment.attachmentName
						};
						setUserAffi(userAffiData);
						setStateUserAffiId(data.customerTrademarkDetailsDTO.userAffId);
					}
				}
				if ([2, 3, 4, 5].includes(props.trademarkServiceUploadType)) {
					const evdOfUseAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.evdOfUseOrChangeId
					);
					if (evdOfUseAttachment) {
						const evdOfUseData = {
							name: evdOfUseAttachment.attachmentName
						};
						setEvdOfUsePdf(evdOfUseData);
						setStateEvdOfUsePdfId(data.customerTrademarkDetailsDTO.evdOfUseOrChangeId);
					}
				}
				if (props.trademarkServiceUploadType === 6) {
					const salesFigureAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.salesFigureId
					);
					if (salesFigureAttachment) {
						const salesFigureData = {
							name: salesFigureAttachment.attachmentName
						};
						setSalesFigure(salesFigureData);
						setStateSalesFigureId(data.customerTrademarkDetailsDTO.salesFigureId);
					}

					const marketingDetailsAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.marketingDetailsId
					);
					if (marketingDetailsAttachment) {
						const marketingDetailData = {
							name: marketingDetailsAttachment.attachmentName
						};
						setMarketingDetail(marketingDetailData);
						setStateMarketingDetailId(data.customerTrademarkDetailsDTO.marketingDetailsId);
					}

					const otherDocAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.otherDoc1Id
					);
					if (otherDocAttachment) {
						const otherDocData = {
							name: otherDocAttachment.attachmentName
						};
						setStateOtherDocId(otherDocData);
						setStateOtherDocId(data.customerTrademarkDetailsDTO.otherDoc1Id);
					}
				}
				if (props.trademarkServiceUploadType === 7) {
					const artOfWorkAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.artWorkId
					);
					if (artOfWorkAttachment) {
						const artOfWorkData = {
							name: artOfWorkAttachment.attachmentName
						};
						setArtWork(artOfWorkData);
						setStateArtWorkId(data.customerTrademarkDetailsDTO.artWorkId);
					}
				}
			}

			// reset({
			// 	poa: '',
			// });
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
		props.trademarkServiceUploadType,
		props.lserviceStageTransaction,
		responseCustomerTrademarkDetailsAndAttachments,
		stateLserviceStageTransactionId,
		reset
	]);

	function findRecordFromArray(attachmentDTOs, attachmentId) {
		return attachmentDTOs.find(element => {
			return element.id === attachmentId;
		});
	}

	const findMatchingCustomerTradeMarkRecordAlongWithAttachment = (
		customerTrademarkDetailsAndAttachments,
		transactionId
	) => {
		const el = customerTrademarkDetailsAndAttachments.find(
			eltemp => eltemp.customerTrademarkDetailsDTO.lserviceStageTransactionId === transactionId
		);
		return el || null; // so check result is truthy and extract record
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
		// console.log(props);
		let message = '';
		let open = false;
		let level = 'error';
		const docListForUpload = [];
		const attachmentDTOsListToBeCreated = [];

		if (props.paymentStatus !== 0) {
			message = 'Please complete the payment step first before trying to complete this step!';
			open = true;
			setProgress(0);
			setPoaUpload(null);
			setMsmeCert(null);
			setEvdOfUsePdf(null);
			setMarketingDetail(null);
			setSalesFigure(null);
			setOtherDoc(null);
			setArtWork(null);
			setUserAffi(null);
			setMessageAndLevel({
				message,
				open,
				level
			});
			return;
		}

		// Validate POA is uploaded or not except TM Portfolio Valuation service
		if (props.trademarkServiceUploadType !== 6) {
			if (poaUpload === null) {
				message = 'Please upload Power Of Authorization before proceeding further!';
				open = true;
				setProgress(0);
				setPoaUpload(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const poaObject = {
				fileNameForServer: 'POA',
				docFile: poaUpload
			};
			if (statePoaId) {
				poaObject.id = statePoaId;
			}
			docListForUpload.push(poaObject);
		}

		if (props.trademarkServiceUploadType === 2) {
			// Validate TM Filing uploads
			let fileNameForErrorMessage = '';
			let displayError = 0;
			if (msmeCert === null) {
				fileNameForErrorMessage = 'SME/MSME/Start-up Registration Certificate';
				displayError = 1;
			}
			if (userAffi === null) {
				fileNameForErrorMessage = 'User Affidavit';
				displayError = 1;
			}
			if (evdOfUsePdf === null) {
				fileNameForErrorMessage = 'Evidence of Use';
				displayError = 1;
			}
			if (displayError !== 0) {
				message = `Please upload ${fileNameForErrorMessage} before proceeding further!`;
				open = true;
				setProgress(0);
				setPoaUpload(null);
				setUserAffi(null);
				setMsmeCert(null);
				setEvdOfUsePdf(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const msmeCertObject = {
				fileNameForServer: 'MSMECERT',
				docFile: msmeCert
			};
			if (stateMsmeCertId) {
				msmeCertObject.id = stateMsmeCertId;
			}
			docListForUpload.push(msmeCertObject);
			const userAffiObject = {
				fileNameForServer: 'USERAFFI',
				docFile: userAffi
			};
			if (stateUserAffiId) {
				userAffiObject.id = stateUserAffiId;
			}
			docListForUpload.push(userAffiObject);
			const evdOfUsePdfObject = {
				fileNameForServer: 'EVDOFUSE',
				docFile: evdOfUsePdf
			};
			if (stateEvdOfUsePdfId) {
				evdOfUsePdfObject.id = stateEvdOfUsePdfId;
			}
			docListForUpload.push(evdOfUsePdfObject);
		} else if (props.trademarkServiceUploadType === 3) {
			if (userAffi !== null) {
				const userAffiObject = {
					fileNameForServer: 'USERAFFI',
					docFile: userAffi
				};
				if (stateUserAffiId) {
					userAffiObject.id = stateUserAffiId;
				}
				docListForUpload.push(userAffiObject);
			}
			if (evdOfUsePdf !== null) {
				const evdOfUsePdfObject = {
					fileNameForServer: 'EVDOFUSE',
					docFile: evdOfUsePdf
				};
				if (stateEvdOfUsePdfId) {
					evdOfUsePdfObject.id = stateEvdOfUsePdfId;
				}
				docListForUpload.push(evdOfUsePdfObject);
			}
		} else if (props.trademarkServiceUploadType === 5) {
			if (evdOfUsePdf === null) {
				message =
					'Please upload Evidence of change (Assignment Deed/ Certificate of Incorporation) before proceeding further!';
				open = true;
				setProgress(0);
				setPoaUpload(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const evdOfUsePdfObject = {
				fileNameForServer: 'EVDOFUSE',
				docFile: evdOfUsePdf
			};
			if (stateEvdOfUsePdfId) {
				evdOfUsePdfObject.id = stateEvdOfUsePdfId;
			}
			docListForUpload.push(evdOfUsePdfObject);
		} else if (props.trademarkServiceUploadType === 6) {
			// console.log('Uploading valuation related documents');
			// Validate TM Portfolio Valuation uploads
			let fileNameForErrorMessage = '';
			let displayError = 0;
			if (salesFigure === null) {
				fileNameForErrorMessage = 'Sale Figure';
				displayError = 1;
			}
			if (marketingDetail === null) {
				fileNameForErrorMessage = 'Marketing Details';
				displayError = 1;
			}
			if (otherDoc !== null) {
				const otherDoc1Object = {
					fileNameForServer: 'OtherDoc1',
					docFile: otherDoc
				};
				if (stateOtherDocId) {
					otherDoc1Object.id = stateOtherDocId;
				}
				docListForUpload.push(otherDoc1Object);
			}
			if (displayError !== 0) {
				message = `Please upload ${fileNameForErrorMessage} before proceeding further!`;
				open = true;
				setProgress(0);
				setSalesFigure(null);
				setMarketingDetail(null);
				setOtherDoc(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const salesFigureObject = {
				fileNameForServer: 'SALEFIGURES',
				docFile: salesFigure
			};
			if (stateSalesFigureId) {
				salesFigureObject.id = stateSalesFigureId;
			}
			docListForUpload.push(salesFigureObject);
			const marketingDetailObject = {
				fileNameForServer: 'MARKETINGDETAILS',
				docFile: marketingDetail
			};
			if (stateMarketingDetailId) {
				marketingDetailObject.id = stateMarketingDetailId;
			}
			docListForUpload.push(marketingDetailObject);
			// console.log(salesFigureObject);
			// console.log(marketingDetailObject);
		} else if (props.trademarkServiceUploadType === 7) {
			if (artWork === null) {
				message = 'Please upload Artistic Work before proceeding further!';
				open = true;
				setProgress(0);
				setArtWork(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const artWorkObject = {
				fileNameForServer: 'ARTWORK',
				docFile: artWork
			};
			if (stateArtWorkId) {
				artWorkObject.id = stateArtWorkId;
			}
			docListForUpload.push(artWorkObject);
		}

		// docListForUpload.forEach(doc => {
		// 	console.log('iterating through the files');
		// 	console.log(doc);
		// });

		if (props.lserviceTransaction.id == null) {
			message = 'Please complete the previous step before trying to complete this step!';
			setPoaUpload(null);
			open = true;
		} else {
			// Upload image if type is image
			// eslint-disable-next-line
			// eslint-disable-next-line
			const promises = [];

			docListForUpload.forEach(doc => {
				// console.log(doc);
				const uploadTask = storage.ref(`docsUploaded/${doc.docFile.name}`).put(doc.docFile);
				promises.push(uploadTask);
				uploadTask.on(
					'state_changed',
					snapshot => {
						// progress function ...
						const progressDone = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
						console.log(progressDone);
						if (!Number.isNaN(progressDone)) {
							setProgress(progressDone);
						}
					},
					error => {
						// Error function ...
						message = 'Failed to upload document on server, please try again after some time!';
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

						const attachmentDTO = {
							attachmentName: doc.docFile.name,
							url: downloadURL,
							attachmentType: 'DOCUMENT',
							attachmentHash: doc.fileNameForServer
						};
						if (doc.id) {
							attachmentDTO.id = doc.id;
						}
						attachmentDTOsListToBeCreated.push(attachmentDTO);

						if (attachmentDTOsListToBeCreated.length === docListForUpload.length) {
							let lserviceStageTransactionIdForData = null;
							if (props.lserviceStageTransaction == null) {
								lserviceStageTransactionIdForData = stateLserviceStageTransactionId;
							} else {
								lserviceStageTransactionIdForData = props.lserviceStageTransaction.id;
							}

							const customerTrademarkDetailsDTO = {
								typeForTm: 'DOCUMENT',
								status: 'ACTIVE',
								word: '',
								lserviceStageTransactionId: lserviceStageTransactionIdForData
							};
							if (stateCustomerTrademarkDetailsId) {
								customerTrademarkDetailsDTO.id = stateCustomerTrademarkDetailsId;
							}

							const reqData = {
								customerTrademarkDetailsDTO,
								attachmentDTOs: attachmentDTOsListToBeCreated,
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
							open = true;
							level = 'success';
							setProgress(0);
							setMessageAndLevel({
								message,
								open,
								level
							});
						}
					}
				);
			});
			// image name check (if) ends here

			Promise.allSettled(promises)
				.then(() => {
					// console.log('Checkpoint #1');
					// if (attachmentDTOsListToBeCreated.length !== docListForUpload.length) {
					// 	message = `Failed to upload all documents on server, please try again after some time- 101`;
					// 	open = true;
					// 	setPoaUpload(null);
					// 	setUserAffi(null);
					// 	setMsmeCert(null);
					// 	setEvdOfUsePdf(null);
					// 	setSalesFigure(null);
					// 	setMarketingDetail(null);
					// 	setArtWork(null);
					// 	setOtherDoc(null);
					// 	setProgress(0);
					// 	setMessageAndLevel({
					// 		message,
					// 		open,
					// 		level
					// 	});
					// }
				})
				.catch(err => {
					// console.log(err.code);
					message = `Failed to upload all documents on server, please try again after some time- ${err.code}`;
					open = true;
					setPoaUpload(null);
					setProgress(0);
					setMessageAndLevel({
						message,
						open,
						level
					});
				});
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

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<div className="flex-grow flex-shrink-0 p-0">
			<div>
				<div>
					<Typography className="text-16 sm:text-20 truncate font-semibold">
						{`Step ${props.stepCount} - ${props.step.name}`}
					</Typography>
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
					<form className="justify-items-center mb-20 mt-20" onSubmit={handleSubmit(onSubmit)}>
						{props.trademarkServiceUploadType !== 6 && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="poa"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="poa"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Power Of Authorization*
												<input
													accept="application/pdf"
													className="hidden"
													id="poa-file"
													name="poa"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setPoaUpload(file);
															// console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.poa?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{poaUpload ? poaUpload.name : ''}
								</div>
							</>
						)}

						{props.trademarkServiceUploadType === 2 && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="msmeCert"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="poa"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												SME/MSME/Start-up Registration Certificate*
												<input
													accept="application/pdf"
													className="hidden"
													id="msmeCert-file"
													name="msmeCert"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setMsmeCert(file);
															// console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.poa?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{msmeCert ? msmeCert.name : ''}
								</div>
							</>
						)}

						{[2, 3, 4].includes(props.trademarkServiceUploadType) && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="userAffi"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="userAffi"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												{props.trademarkServiceUploadType === 2
													? 'User Affidavit*'
													: 'User Affidavit'}
												<input
													accept="application/pdf"
													className="hidden"
													id="userAffi-file"
													name="userAffi"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setUserAffi(file);
															// console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.userAffi?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{userAffi ? userAffi.name : ''}
								</div>
							</>
						)}
						{[2, 3, 4, 5].includes(props.trademarkServiceUploadType) && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="evdOfUsePdf"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="evdOfUsePdf"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												{props.trademarkServiceUploadType === 2
													? 'Evidence of Use*'
													: props.trademarkServiceUploadType === 5
													? 'Evidence of change (Assignment Deed/ Certificate of Incorporation)*'
													: 'Evidence of Use'}
												<input
													accept="application/pdf"
													className="hidden"
													id="evdOfUsePdf-file"
													name="evdOfUsePdf"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setEvdOfUsePdf(file);
															// console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.evdOfUsePdf?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{evdOfUsePdf ? evdOfUsePdf.name : ''}
								</div>
							</>
						)}
						{props.trademarkServiceUploadType === 6 && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="salesFigure"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="salesFigure"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Sale Figures*
												<input
													accept="application/pdf"
													className="hidden"
													id="salesFigure-file"
													name="salesFigure"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setSalesFigure(file);
															// console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.salesFigure?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{salesFigure ? salesFigure.name : ''}
								</div>

								<div className="flex justify-center items-center pt-20">
									<Controller
										name="marketingDetail"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="marketingDetail"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Marketing Details*
												<input
													accept="application/pdf"
													className="hidden"
													id="marketingDetail-file"
													name="marketingDetail"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setMarketingDetail(file);
															// console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.marketingDetail?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{marketingDetail ? marketingDetail.name : ''}
								</div>

								<div className="flex justify-center items-center pt-20">
									<Controller
										name="otherDoc"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="otherDoc"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Other Document
												<input
													accept="application/pdf"
													className="hidden"
													id="otherDoc-file"
													name="otherDoc"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setOtherDoc(file);
															console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.otherDoc?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{otherDoc ? otherDoc.name : ''}
								</div>
							</>
						)}
						{props.trademarkServiceUploadType === 7 && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="artWork"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												// name="artWork"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Artistic Work*
												<input
													accept="application/pdf"
													className="hidden"
													id="artWork-file"
													name="artWork"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setArtWork(file);
															console.log(file);
															// setImageUrl(reader.result);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
														// setShowImageSelected(true);
													}}
												/>
											</Button>
										)}
									/>
									{/* <span>{errors.otherDoc?.message}</span> */}
								</div>
								<div className="flex justify-center items-center pt-1">
									{artWork ? artWork.name : ''}
								</div>
							</>
						)}
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16"
							aria-label="Submit"
							// disabled={!isValid || poaUpload !== null}
							value="legacy"
						>
							Submit
						</Button>
					</form>
					{progress !== 0 && <LinearProgressWithLabel value={progress} />}
				</div>
			</div>
		</div>
	);
};

export default memo(UploadsForTrademarkServices);
