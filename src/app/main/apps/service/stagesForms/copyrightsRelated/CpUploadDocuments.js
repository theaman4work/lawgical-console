import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useDeepCompareEffect } from '@fuse/hooks';
import { memo, useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
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
import storage from '../../../../firebase/index';
import {
	getResponseCustomerCopyrightDetailsAndAttachments,
	addResponseCustomerCopyrightDetailsAndAttachments,
	updateResponseCustomerCopyrightDetailsAndAttachments,
	selectResponseCustomerCopyrightDetailsAndAttachments
} from '../../store/responseCustomerCopyrightDetailsAndAttachmentsSlice';

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
	questionaire: undefined,
	copyrightwork: undefined,
	applicantSign: undefined,
	authorNOC: undefined,
	letterAuth: undefined,
	artisticWork: undefined
};

const schema = yup.object().shape({
	poa: yup.mixed().nullable(),
	questionaire: yup.mixed().nullable(),
	copyrightwork: yup.mixed().nullable(),
	applicantSign: yup.mixed().nullable(),
	authorNOC: yup.mixed().nullable(),
	letterAuth: yup.mixed().nullable(),
	artisticWork: yup.mixed().nullable()
});

const CpUploadDocuments = props => {
	const classes = useStyles();
	const dispatch = useDispatch();
	// const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);

	const responseCustomerCopyrightDetailsAndAttachments = useSelector(
		selectResponseCustomerCopyrightDetailsAndAttachments
	);

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});

	const [progress, setProgress] = useState(0);
	const [poaUpload, setPoaUpload] = useState(null);
	const [questionaire, setQuestionaire] = useState(null);
	const [copyrightwork, setCopyrightWork] = useState(null);
	const [applicantSign, setApplicantSign] = useState(null);
	const [authorNOC, setAuthorNOC] = useState(null);
	const [letterAuth, setLetterAuth] = useState(null);
	const [artisticWork, setArtisticWork] = useState(null);
	const [loading, setLoading] = useState(true);
	const [stateLserviceStageTransactionId, setStateLserviceStageTransactionId] = useState(null);
	const [stateCustomerCopyrightDetailsId, setStateCustomerCopyrightDetailsId] = useState(null);
	const [statePoaId, setStatePoaId] = useState(null);
	const [stateQuestionnaireFormId, setStateQuestionnaireFormIdId] = useState(null);
	const [stateCopyrightWorkId, setStateCopyrightWorkId] = useState(null);
	const [stateApplicantSignatureId, setStateApplicantSignatureId] = useState(null);
	const [stateAuthorNOCId, setStateAuthorNOCId] = useState(null);
	const [stateLetterOfAuthorizationId, setStateLetterOfAuthorizationId] = useState(null);
	const [stateArtisticWorkId, setStateArtisticWorkId] = useState(null);

	const { control, reset, handleSubmit, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
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
		dispatch(getResponseCustomerCopyrightDetailsAndAttachments()).then(() => setLoading(false));
	}, [dispatch]);

	// eslint-disable-next-line
	useEffect(() => {
		let data = '';
		if (props.lserviceStageTransaction !== null) {
			data = findMatchingCustomerCopyrightRecordAlongWithAttachment(
				responseCustomerCopyrightDetailsAndAttachments,
				props.lserviceStageTransaction.id
			);
		} else {
			data = findMatchingCustomerCopyrightRecordAlongWithAttachment(
				responseCustomerCopyrightDetailsAndAttachments,
				stateLserviceStageTransactionId
			);
		}

		if (data) {
			setStateCustomerCopyrightDetailsId(data.customerCopyrightDetailsDTO.id);
			if ([1, 2].includes(props.copyrightServiceUploadType)) {
				// POA
				const poaAttachment = findRecordFromArray(data.attachmentDTOs, data.customerCopyrightDetailsDTO.poaId);
				if (poaAttachment) {
					const poaData = {
						name: poaAttachment.attachmentName,
						url: poaAttachment.url
					};
					setPoaUpload(poaData);
					setStatePoaId(data.customerCopyrightDetailsDTO.poaId);
				}
			}
			if (props.copyrightServiceUploadType === 1) {
				// Questionaire
				const questionaireAttachment = findRecordFromArray(
					data.attachmentDTOs,
					data.customerCopyrightDetailsDTO.questionnaireFormId
				);
				if (questionaireAttachment) {
					const questionaireData = {
						name: questionaireAttachment.attachmentName,
						url: questionaireAttachment.url
					};
					setQuestionaire(questionaireData);
					setStateQuestionnaireFormIdId(data.customerCopyrightDetailsDTO.questionnaireFormId);
				}
				// CopyrightWork
				const copyrightWorkAttachment = findRecordFromArray(
					data.attachmentDTOs,
					data.customerCopyrightDetailsDTO.copyrightWorkId
				);
				if (copyrightWorkAttachment) {
					const copyrightWorkData = {
						name: copyrightWorkAttachment.attachmentName,
						url: copyrightWorkAttachment.url
					};
					setCopyrightWork(copyrightWorkData);
					setStateCopyrightWorkId(data.customerCopyrightDetailsDTO.copyrightWorkId);
				}
				// ApplicantSignature
				const applicantSignatureAttachment = findRecordFromArray(
					data.attachmentDTOs,
					data.customerCopyrightDetailsDTO.applicantSignatureId
				);
				if (applicantSignatureAttachment) {
					const applicantSignatureData = {
						name: applicantSignatureAttachment.attachmentName,
						url: applicantSignatureAttachment.url
					};
					setApplicantSign(applicantSignatureData);
					setStateApplicantSignatureId(data.customerCopyrightDetailsDTO.applicantSignatureId);
				}
				// Author NOC
				const authorNOCAttachment = findRecordFromArray(
					data.attachmentDTOs,
					data.customerCopyrightDetailsDTO.authorNocId
				);
				if (authorNOCAttachment) {
					const authorNOCData = {
						name: authorNOCAttachment.attachmentName,
						url: authorNOCAttachment.url
					};
					setAuthorNOC(authorNOCData);
					setStateAuthorNOCId(data.customerCopyrightDetailsDTO.authorNocId);
				}
				// Letter of Authorization
				const letterAuthAttachment = findRecordFromArray(
					data.attachmentDTOs,
					data.customerCopyrightDetailsDTO.letterOfAuthorizationId
				);
				if (letterAuthAttachment) {
					const letterAuthData = {
						name: letterAuthAttachment.attachmentName,
						url: letterAuthAttachment.url
					};
					setLetterAuth(letterAuthData);
					setStateLetterOfAuthorizationId(data.customerCopyrightDetailsDTO.letterOfAuthorizationId);
				}
			}
			// Artstic Work
			if (props.copyrightServiceUploadType === 2) {
				const artsticWorkAttachment = findRecordFromArray(
					data.attachmentDTOs,
					data.customerCopyrightDetailsDTO.artisticWorkId
				);
				if (artsticWorkAttachment) {
					const artisticWorkData = {
						name: artsticWorkAttachment.attachmentName,
						url: artsticWorkAttachment.url
					};
					setArtisticWork(artisticWorkData);
					setStateArtisticWorkId(data.customerCopyrightDetailsDTO.artisticWorkId);
				}
			}
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
		props.copyrightServiceUploadType,
		props.lserviceStageTransaction,
		responseCustomerCopyrightDetailsAndAttachments,
		stateLserviceStageTransactionId,
		reset
	]);

	function findRecordFromArray(attachmentDTOs, attachmentId) {
		return attachmentDTOs.find(element => {
			return element.id === attachmentId;
		});
	}

	const findMatchingCustomerCopyrightRecordAlongWithAttachment = (
		customerCopyrightDetailsAndAttachments,
		transactionId
	) => {
		const el = customerCopyrightDetailsAndAttachments.find(
			eltemp => eltemp.customerCopyrightDetailsDTO.lserviceStageTransactionId === transactionId
		);
		return el || null; // so check result is truthy and extract record
	};

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
		const docListForUpload = [];
		const attachmentDTOsListToBeCreated = [];

		if (props.paymentStatus !== 0) {
			message = 'Please complete the payment step first before trying to complete this step!';
			open = true;
			setProgress(0);
			setPoaUpload(null);
			setQuestionaire(null);
			setCopyrightWork(null);
			setApplicantSign(null);
			setAuthorNOC(null);
			setLetterAuth(null);
			setArtisticWork(null);
			setMessageAndLevel({
				message,
				open,
				level
			});
			return;
		}

		if (props.copyrightServiceUploadType === 1) {
			// POA
			if (poaUpload === null) {
				message = 'Please upload Power Of Authorization before proceeding further!';
				open = true;
				setProgress(0);
				// setPoaUpload(null);
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

			// Questionaire
			if (questionaire === null) {
				message = 'Please upload Questionaire Form before proceeding further!';
				open = true;
				setProgress(0);
				// setPoaUpload(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const questionaireObject = {
				fileNameForServer: 'QUESTIONFORM',
				docFile: questionaire
			};
			if (stateQuestionnaireFormId) {
				questionaireObject.id = stateQuestionnaireFormId;
			}
			docListForUpload.push(questionaireObject);

			// CopyrightWork
			if (copyrightwork === null) {
				message = 'Please upload Copyright work before proceeding further!';
				open = true;
				setProgress(0);
				// setPoaUpload(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const copyrightworkObject = {
				fileNameForServer: 'COPYRTWORK',
				docFile: copyrightwork
			};
			if (stateCopyrightWorkId) {
				copyrightworkObject.id = stateCopyrightWorkId;
			}
			docListForUpload.push(copyrightworkObject);

			// Upload Applicant Signature
			if (applicantSign === null) {
				message = 'Please upload Copyright work before proceeding further!';
				open = true;
				setProgress(0);
				// setPoaUpload(null);
				setMessageAndLevel({
					message,
					open,
					level
				});
				return;
			}
			const applicantSignObject = {
				fileNameForServer: 'UPAPPCNTSIGN',
				docFile: applicantSign
			};
			if (stateApplicantSignatureId) {
				applicantSignObject.id = stateApplicantSignatureId;
			}
			docListForUpload.push(applicantSignObject);

			// Author NOC
			if (authorNOC !== null) {
				const authorNOCObject = {
					fileNameForServer: 'AUTHORNOC',
					docFile: authorNOC
				};
				if (stateAuthorNOCId) {
					authorNOCObject.id = stateAuthorNOCId;
				}
				docListForUpload.push(authorNOCObject);
			}

			// Letter of Authorization
			if (letterAuth !== null) {
				const letterAuthObject = {
					fileNameForServer: 'LETTOFAUTH',
					docFile: letterAuth
				};
				if (stateLetterOfAuthorizationId) {
					letterAuthObject.id = stateLetterOfAuthorizationId;
				}
				docListForUpload.push(letterAuthObject);
			}
		} else if (props.copyrightServiceUploadType === 2) {
			// POA
			if (poaUpload === null) {
				message = 'Please upload Power Of Authorization before proceeding further!';
				open = true;
				setProgress(0);
				// setPoaUpload(null);
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

			// Artistic Work
			if (artisticWork !== null) {
				const artisticWorkObject = {
					fileNameForServer: 'UPARTWORK',
					docFile: artisticWork
				};
				if (stateArtisticWorkId) {
					artisticWorkObject.id = stateArtisticWorkId;
				}
				docListForUpload.push(artisticWorkObject);
			}
		}

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
				const uploadTask = storage.ref(`docsUploaded/${doc.docFile.name}`).put(doc.docFile);
				promises.push(uploadTask);
				uploadTask.on(
					'state_changed',
					snapshot => {
						// progress function ...
						const progressDone = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
						// console.log(progressDone);
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

							const customerCopyrightDetailsDTO = {
								// typeForTm: 'DOCUMENT',
								status: 'ACTIVE',
								// word: '',
								lserviceStageTransactionId: lserviceStageTransactionIdForData
							};
							if (stateCustomerCopyrightDetailsId) {
								customerCopyrightDetailsDTO.id = stateCustomerCopyrightDetailsId;
							}

							const reqData = {
								customerCopyrightDetailsDTO,
								attachmentDTOs: attachmentDTOsListToBeCreated,
								email: localStorage.getItem('lg_logged_in_email')
							};

							if (stateCustomerCopyrightDetailsId) {
								reqData.id = stateCustomerCopyrightDetailsId;
								dispatch(updateResponseCustomerCopyrightDetailsAndAttachments(reqData));
								message = 'Data updated successfully.';
							} else {
								dispatch(addResponseCustomerCopyrightDetailsAndAttachments(reqData));
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
						{[1, 2].includes(props.copyrightServiceUploadType) && (
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
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{poaUpload ? (
										<Typography className="mb-16" component="p">
											{poaUpload.url && !poaUpload.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={poaUpload.url ? poaUpload.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{poaUpload.name ? poaUpload.name : ''}
												</Link>
											) : poaUpload.name ? (
												poaUpload.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
							</>
						)}
						{props.copyrightServiceUploadType === 1 && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="questionaire"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Questionaire Form*
												<input
													accept="application/pdf"
													className="hidden"
													id="questionaire-file"
													name="questionaire"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setQuestionaire(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{questionaire ? (
										<Typography className="mb-16" component="p">
											{questionaire.url && !questionaire.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={questionaire.url ? questionaire.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{questionaire.name ? questionaire.name : ''}
												</Link>
											) : questionaire.name ? (
												questionaire.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="copyrightwork"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Copyight work*
												<input
													accept="application/pdf"
													className="hidden"
													id="copyrightwork-file"
													name="copyrightwork"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setCopyrightWork(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{copyrightwork ? (
										<Typography className="mb-16" component="p">
											{copyrightwork.url && !copyrightwork.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={copyrightwork.url ? copyrightwork.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{copyrightwork.name ? copyrightwork.name : ''}
												</Link>
											) : copyrightwork.name ? (
												copyrightwork.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="applicantSign"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Upload applicant sinature*
												<input
													accept="application/pdf"
													className="hidden"
													id="applicantSign-file"
													name="applicantSign"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setApplicantSign(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{applicantSign ? (
										<Typography className="mb-16" component="p">
											{applicantSign.url && !applicantSign.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={applicantSign.url ? applicantSign.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{applicantSign.name ? applicantSign.name : ''}
												</Link>
											) : applicantSign.name ? (
												applicantSign.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="authorNOC"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Author NOC
												<input
													accept="application/pdf"
													className="hidden"
													id="authorNOC-file"
													name="authorNOC"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setAuthorNOC(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{authorNOC ? (
										<Typography className="mb-16" component="p">
											{authorNOC.url && !authorNOC.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={authorNOC.url ? authorNOC.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{authorNOC.name ? authorNOC.name : ''}
												</Link>
											) : authorNOC.name ? (
												authorNOC.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="letterAuth"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Letter of Authorization
												<input
													accept="application/pdf"
													className="hidden"
													id="letterAuth-file"
													name="letterAuth"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setLetterAuth(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{letterAuth ? (
										<Typography className="mb-16" component="p">
											{letterAuth.url && !letterAuth.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={letterAuth.url ? letterAuth.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{letterAuth.name ? letterAuth.name : ''}
												</Link>
											) : letterAuth.name ? (
												letterAuth.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
							</>
						)}
						{props.copyrightServiceUploadType === 2 && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="artisticWork"
										control={control}
										defaultValue={[]}
										required
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												Upload Artistic Work
												<input
													accept="application/pdf"
													className="hidden"
													id="artisticWork-file"
													name="artisticWork"
													type="file"
													onChange={async e => {
														const reader = new FileReader();
														const file = e.target.files[0];

														reader.onloadend = () => {
															setArtisticWork(file);
														};
														if (file instanceof Blob) {
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										)}
									/>
								</div>
								<div className="flex justify-center items-center pt-1">
									{artisticWork ? (
										<Typography className="mb-16" component="p">
											{artisticWork.url && !artisticWork.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={artisticWork.url ? artisticWork.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{artisticWork.name ? artisticWork.name : ''}
												</Link>
											) : artisticWork.name ? (
												artisticWork.name
											) : (
												''
											)}
										</Typography>
									) : (
										''
									)}
								</div>
							</>
						)}

						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16"
							aria-label="Submit"
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

export default memo(CpUploadDocuments);
