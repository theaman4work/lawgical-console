import _ from '@lodash';
import * as yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { useDeepCompareEffect } from '@fuse/hooks';
import { memo, useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
	const serviceSteps = useSelector(({ servicesApp }) => servicesApp.serviceSteps);

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

	let title = null;
	if (props.step.desc == null) {
		title = props.step.name;
	}

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
			setStateCustomerTrademarkDetailsId(data.customerTrademarkDetailsDTO.id);

			if (data.customerTrademarkDetailsDTO.typeForTm === 'DOCUMENT') {
				if (props.trademarkServiceUploadType !== 6) {
					const poaAttachment = findRecordFromArray(
						data.attachmentDTOs,
						data.customerTrademarkDetailsDTO.poaId
					);
					if (poaAttachment) {
						const poaData = {
							name: poaAttachment.attachmentName,
							url: poaAttachment.url
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
							name: msmeAttachment.attachmentName,
							url: msmeAttachment.url
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
							name: userAffiAttachment.attachmentName,
							url: userAffiAttachment.url
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
							name: evdOfUseAttachment.attachmentName,
							url: evdOfUseAttachment.url
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
							name: salesFigureAttachment.attachmentName,
							url: salesFigureAttachment.url
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
							name: marketingDetailsAttachment.attachmentName,
							url: marketingDetailsAttachment.url
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
							name: otherDocAttachment.attachmentName,
							url: otherDocAttachment.url
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
							name: artOfWorkAttachment.attachmentName,
							url: artOfWorkAttachment.url
						};
						setArtWork(artOfWorkData);
						setStateArtWorkId(data.customerTrademarkDetailsDTO.artWorkId);
					}
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
		props.trademarkServiceUploadType,
		props.lserviceStageTransaction,
		responseCustomerTrademarkDetailsAndAttachments,
		stateLserviceStageTransactionId,
		reset
	]);

	const findlserviceStageTransactionUsingLserviceStage = (lserviceStageTransactionDTOs, lserviceStageId) => {
		// const el = lserviceStageTransactionDTOs.find(eltemp => eltemp.lserviceStageId === lserviceStageId);
		if (props.lserviceTransaction !== null) {
			const el = lserviceStageTransactionDTOs.find(
				eltemp =>
					eltemp.lserviceTransactionId === props.lserviceTransaction.id &&
					eltemp.lserviceStageId === lserviceStageId
			);
			return el || null;
			// eslint-disable-next-line
		} else {
			return null;
		}
		// return el || null; // so check result is truthy and extract `id`
	};

	// if service is TM Filing, then change documents uploads to compulsory
	let compulsoryMsmeCertButtonIfServiceIsTmFiling = false;
	let compulsoryEvdOfUsageAndUserAff = false;

	if (props.trademarkServiceUploadType === 2) {
		if (props.applicantsIsOfStartUpOrMsmeType === 1) {
			compulsoryMsmeCertButtonIfServiceIsTmFiling = true;
		}

		let totaFilteredRecords = '';
		if (serviceSteps.lserviceStageDTOs.length > 0) {
			const lserviceStageDTO = serviceSteps.lserviceStageDTOs.filter(
				eachRec => eachRec.stageType === 'TMFILINGREQ'
			);
			if (lserviceStageDTO !== null) {
				const lserviceStageTransactionFound = findlserviceStageTransactionUsingLserviceStage(
					serviceSteps.lserviceStageTransactionDTOs,
					lserviceStageDTO[0].id
				);
				let interMediateFilterRecords = '';
				if (lserviceStageTransactionFound !== null) {
					interMediateFilterRecords = responseCustomerTrademarkDetailsAndAttachments.filter(
						eachRec =>
							eachRec.customerTrademarkDetailsDTO.typeForTm === 'WORD' ||
							eachRec.customerTrademarkDetailsDTO.typeForTm === 'IMAGE'
					);
					if (interMediateFilterRecords.length > 0) {
						totaFilteredRecords = interMediateFilterRecords.filter(
							eachRec =>
								eachRec.customerTrademarkDetailsDTO.lserviceStageTransactionId ===
								lserviceStageTransactionFound.id
						);
					}
				}
			}
		}

		// check size of totalFilteredRecords
		if (totaFilteredRecords.length === 1) {
			// console.log(totaFilteredRecords);
			if (totaFilteredRecords[0].customerTrademarkDetailsDTO.startDateOfUsage !== null) {
				compulsoryEvdOfUsageAndUserAff = true;
			}
		}
	}

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

		// Validate POA is uploaded or service name is not equal to TM Portfolio Valuation service
		if (props.trademarkServiceUploadType !== 6) {
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
		}

		if (props.trademarkServiceUploadType === 2) {
			// Validate TM Filing uploads
			let fileNameForErrorMessage = '';
			let displayError = 0;
			if (compulsoryMsmeCertButtonIfServiceIsTmFiling && msmeCert === null) {
				fileNameForErrorMessage = 'SME/MSME/Start-up Registration Certificate';
				displayError = 1;
			}
			if (compulsoryEvdOfUsageAndUserAff && userAffi === null) {
				fileNameForErrorMessage = 'User Affidavit';
				displayError = 1;
			}
			if (compulsoryEvdOfUsageAndUserAff && evdOfUsePdf === null) {
				fileNameForErrorMessage = 'Evidence of Use';
				displayError = 1;
			}
			if (displayError !== 0) {
				message = `Please upload ${fileNameForErrorMessage} before proceeding further!`;
				open = true;
				setProgress(0);
				// setPoaUpload(null);
				// setUserAffi(null);
				// setMsmeCert(null);
				// setEvdOfUsePdf(null);
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
			if (compulsoryMsmeCertButtonIfServiceIsTmFiling) {
				docListForUpload.push(msmeCertObject);
			}
			const userAffiObject = {
				fileNameForServer: 'USERAFFI',
				docFile: userAffi
			};
			if (stateUserAffiId) {
				userAffiObject.id = stateUserAffiId;
			}
			if (compulsoryEvdOfUsageAndUserAff) {
				docListForUpload.push(userAffiObject);
			}
			const evdOfUsePdfObject = {
				fileNameForServer: 'EVDOFUSE',
				docFile: evdOfUsePdf
			};
			if (stateEvdOfUsePdfId) {
				evdOfUsePdfObject.id = stateEvdOfUsePdfId;
			}
			if (compulsoryEvdOfUsageAndUserAff) {
				docListForUpload.push(evdOfUsePdfObject);
			}
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
				// setPoaUpload(null);
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
				// setSalesFigure(null);
				// setMarketingDetail(null);
				// setOtherDoc(null);
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
		} else if (props.trademarkServiceUploadType === 7) {
			if (artWork === null) {
				message = 'Please upload Artistic Work before proceeding further!';
				open = true;
				setProgress(0);
				// setArtWork(null);
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
					<Box className="my-20" p={1} borderColor="primary.main" border={1} boxShadow={0} borderRadius={12}>
						<Typography className="font-normal" variant="subtitle1" color="textSecondary">
							{/* {props.step.desc} */}
							<List dense className="p-0">
								{props.step.desc &&
									props.step.desc.split('---').map(item => (
										<ListItem key={item}>
											<ListItemIcon className="min-w-40">
												<Icon className="text-10">radio_button_unchecked</Icon>
											</ListItemIcon>
											<ListItemText primary={item} />
										</ListItem>
									))}
								{title && (
									<ListItem key={title}>
										<ListItemIcon className="min-w-40">
											<Icon className="text-10">radio_button_unchecked</Icon>
										</ListItemIcon>
										<ListItemText primary={title} />
									</ListItem>
								)}
							</List>
						</Typography>
					</Box>
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

						{props.trademarkServiceUploadType === 2 && (
							<>
								<div className="flex justify-center items-center pt-20">
									<Controller
										name="msmeCert"
										control={control}
										defaultValue={[]}
										// eslint-disable-next-line
										required={compulsoryMsmeCertButtonIfServiceIsTmFiling ? true : false}
										render={({ field: { name, onChange } }) => (
											<Button
												variant="contained"
												className="w-1/2"
												component="label"
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												{`${
													compulsoryMsmeCertButtonIfServiceIsTmFiling
														? 'SME/MSME/Start-up Registration Certificate*'
														: 'SME/MSME/Start-up Registration Certificate'
												}`}
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
									{msmeCert ? (
										<Typography className="mb-16" component="p">
											{msmeCert.url && !msmeCert.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={msmeCert.url ? msmeCert.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{msmeCert.name ? msmeCert.name : ''}
												</Link>
											) : msmeCert.name ? (
												msmeCert.name
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
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												{props.trademarkServiceUploadType === 2
													? compulsoryEvdOfUsageAndUserAff
														? 'User Affidavit*'
														: 'User Affidavit'
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
									{userAffi ? (
										<Typography className="mb-16" component="p">
											{userAffi.url && !userAffi.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={userAffi.url ? userAffi.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{userAffi.name ? userAffi.name : ''}
												</Link>
											) : userAffi.name ? (
												userAffi.name
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
												color="primary"
												startIcon={<CloudUploadIcon />}
											>
												{props.trademarkServiceUploadType === 2
													? compulsoryEvdOfUsageAndUserAff
														? 'Evidence of Use*'
														: 'Evidence of Use'
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
									{evdOfUsePdf ? (
										<Typography className="mb-16" component="p">
											{evdOfUsePdf.url && !evdOfUsePdf.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={evdOfUsePdf.url ? evdOfUsePdf.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{evdOfUsePdf.name ? evdOfUsePdf.name : ''}
												</Link>
											) : evdOfUsePdf.name ? (
												evdOfUsePdf.name
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
									{salesFigure ? (
										<Typography className="mb-16" component="p">
											{salesFigure.url && !salesFigure.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={salesFigure.url ? salesFigure.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{salesFigure.name ? salesFigure.name : ''}
												</Link>
											) : salesFigure.name ? (
												salesFigure.name
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
										name="marketingDetail"
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
									{marketingDetail ? (
										<Typography className="mb-16" component="p">
											{marketingDetail.url &&
											!marketingDetail.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={marketingDetail.url ? marketingDetail.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{marketingDetail.name ? marketingDetail.name : ''}
												</Link>
											) : marketingDetail.name ? (
												marketingDetail.name
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
										name="otherDoc"
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
									{otherDoc ? (
										<Typography className="mb-16" component="p">
											{otherDoc.url && !otherDoc.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={otherDoc.url ? otherDoc.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{otherDoc.name ? otherDoc.name : ''}
												</Link>
											) : otherDoc.name ? (
												otherDoc.name
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
									{artWork ? (
										<Typography className="mb-16" component="p">
											{artWork.url && !artWork.url.includes('data:application') ? (
												<Link
													color="primary"
													underline="always"
													target="_blank"
													href={artWork.url ? artWork.url : '#'}
													style={{ textDecoration: 'none' }}
												>
													{artWork.name ? artWork.name : ''}
												</Link>
											) : artWork.name ? (
												artWork.name
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

export default memo(UploadsForTrademarkServices);
