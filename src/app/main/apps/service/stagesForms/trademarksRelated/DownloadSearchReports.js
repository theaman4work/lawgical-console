import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Slide } from '@material-ui/core';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { GetApp } from '@material-ui/icons';
import { axiosInstance } from 'app/auth-service/axiosInstance';
import {
	selectResponseDocumentReviewAndAttachments,
	getResponseDocumentReviewAndAttachments
} from '../../store/responseDocumentReviewAndAttachmentsSlice';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	},
	largeIcon: {
		width: 32,
		height: 32,
		padding: 1
	}
});

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function DownloadSearchReports(props) {
	const dispatch = useDispatch();
	const classes = useStyles();

	const responseDocumentReviewsAndAttachments = useSelector(selectResponseDocumentReviewAndAttachments);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(responseDocumentReviewsAndAttachments);
	const [updatesData, setUpdatesData] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [stateLserviceStageTransactionId, setStateLserviceStageTransactionId] = useState(
		props.lserviceStageTransaction !== null ? props.lserviceStageTransaction.id : null
	);
	const [dialog, setDialog] = useState({
		open: false,
		imageUrl: null,
		imageName: null
	});

	useEffect(() => {
		if (
			props.pricingInfoStatus === 0 &&
			props.lserviceTransaction &&
			props.lserviceTransaction.id !== null &&
			stateLserviceStageTransactionId == null
		) {
			if (props.lserviceStageTransaction == null) {
				const dataTemp = {
					lserviceTransactionId: props.lserviceTransaction.id,
					stageStatus: 'INPROGRESS',
					lserviceStageId: props.step.id,
					lserviceId: props.step.lserviceId
				};

				axiosInstance
					.post('/services/lgrest/api/lservice-stage-transactions/create-transaction-for-customer', {
						email: localStorage.getItem('lg_logged_in_email'),
						...dataTemp
					})
					.then(res => {
						setStateLserviceStageTransactionId(res.data.lserviceStageTransactionDTO.id);
					});
			}
		}
		if (props.lserviceStageTransaction !== null) {
			dispatch(getResponseDocumentReviewAndAttachments(props.lserviceStageTransaction.id)).then(() =>
				setLoading(false)
			);
			setStateLserviceStageTransactionId(props.lserviceStageTransaction.id);
		} else {
			// eslint-disable-next-line
			if (stateLserviceStageTransactionId) {
				dispatch(getResponseDocumentReviewAndAttachments(stateLserviceStageTransactionId)).then(() =>
					setLoading(false)
				);
			} else {
				setLoading(false);
			}
		}
	}, [
		dispatch,
		props.step.id,
		props.step.lserviceId,
		props.lserviceStageTransaction,
		props.lserviceTransaction,
		stateLserviceStageTransactionId,
		props.pricingInfoStatus
	]);

	useEffect(() => {
		setData(
			responseDocumentReviewsAndAttachments.filter(
				el =>
					el.documentReviewDTO.attachmentId !== null &&
					el.documentReviewDTO.lserviceStageTransactionId === stateLserviceStageTransactionId
			)
		);
		setUpdatesData(
			responseDocumentReviewsAndAttachments.filter(
				el =>
					el.documentReviewDTO.review !== null &&
					el.documentReviewDTO.lserviceStageTransactionId === stateLserviceStageTransactionId
			)
		);
	}, [responseDocumentReviewsAndAttachments, stateLserviceStageTransactionId]);

	let labelForUpdatesTableColumn = 'Updates';
	if (props.lservice) {
		if (
			props.lservice.name.toLowerCase() ===
			'NOC For Copyright (Artistic work) Filing (TM-C) (NEW SERVICE)'.toLowerCase()
		) {
			labelForUpdatesTableColumn = 'Status';
		}
	}

	let noRecordsMessage = 'No Filing Receipts found!';
	if (props.tmServiceType === 5) {
		noRecordsMessage = 'No Updates found!';
	} else if (props.tmServiceType === 4) {
		noRecordsMessage = 'No Filing Receipts or Updates found!';
	}

	let hideFirstColumn = false;
	if (props.lservice) {
		if (
			props.lservice.name.toLowerCase() ===
			'NOC For Copyright (Artistic work) Filing (TM-C) (NEW SERVICE)'.toLowerCase()
		) {
			hideFirstColumn = true;
		}
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	const findAttachmentMatchingWithId = (attachmentList, attachmentId) => {
		const el = attachmentList.find(eltemp => eltemp.id === attachmentId); // Possibly returns `undefined`
		return el !== null ? el : null; // so check result is truthy and extract `id`
	};

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
			) : data.length === 0 || updatesData.length === 0 ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { delay: 0.1 } }}
					className="flex flex-1 items-center justify-center h-full"
				>
					<Typography color="textSecondary" variant="h5">
						There are no records!
					</Typography>
				</motion.div>
			) : (
				<div className="w-full ml-10">
					<Typography className="text-16 sm:text-20 truncate font-semibold">
						{`Step ${props.stepCount} - ${props.step.name}`}
					</Typography>
					{[1, 2, 3, 4].includes(props.tmServiceType) && (
						<>
							<FuseScrollbars className="flex-grow overflow-x-auto mt-20">
								<Table stickyHeader className={classes.table} size="small" aria-labelledby="tableTitle">
									<TableHead>
										<TableRow>
											<TableCell>Trademark</TableCell>
											<TableCell align="center">
												{props.tmServiceType < 3 ? 'Download Report' : 'Download Receipt'}
											</TableCell>
										</TableRow>
									</TableHead>

									<TableBody>
										{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
											let imageData = '';
											if (n.customerTrademarkDetailsDTO.typeForTm === 'IMAGE') {
												imageData = findAttachmentMatchingWithId(
													n.attachmentDTOs,
													n.customerTrademarkDetailsDTO.attachmentId
												);
											}
											return (
												<TableRow
													className="h-36 cursor-pointer"
													hover
													tabIndex={-1}
													key={n.id}
												>
													<TableCell className="w-10" component="th" scope="row">
														{n.customerTrademarkDetailsDTO.typeForTm === 'IMAGE' ? (
															// eslint-disable-next-line
															<img
																className="w-1/2 block rounded"
																onClick={() =>
																	handleOpenDialog(
																		imageData.url ? imageData.url : '',
																		imageData.attachmentName
																			? imageData.attachmentName
																			: ''
																	)
																}
																src={imageData.url ? imageData.url : ''}
																alt={
																	imageData.attachmentName
																		? imageData.attachmentName
																		: ''
																}
															/>
														) : n.customerTrademarkDetailsDTO.typeForTm === 'TMAPPLNO' ? (
															n.customerTrademarkDetailsDTO.applicationTmNo
														) : n.customerTrademarkDetailsDTO.typeForTm === 'TMREGNO' ? (
															n.customerTrademarkDetailsDTO.registeredTmNo
														) : (
															n.customerTrademarkDetailsDTO.word
														)}
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
																window.open(
																	findAttachmentMatchingWithId(
																		n.attachmentDTOs,
																		n.documentReviewDTO.attachmentId
																	),
																	'_blank'
																)
															}
														/>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</FuseScrollbars>

							<TablePagination
								className="flex-shrink-0 border-t-1"
								component="div"
								count={data.length}
								rowsPerPage={rowsPerPage}
								page={page}
								rowsPerPageOptions={[3, 5]}
								backIconButtonProps={{
									'aria-label': 'Previous Page'
								}}
								nextIconButtonProps={{
									'aria-label': 'Next Page'
								}}
								onChangePage={handleChangePage}
								onChangeRowsPerPage={handleChangeRowsPerPage}
							/>
						</>
					)}

					{/* table for text updates start here show updates for TM Search 	 */}
					{[2, 4, 5].includes(props.tmServiceType) && (
						<>
							{data.length > 0 && <Divider className="mt-20" />}
							{updatesData.length !== 0 ? (
								<>
									<FuseScrollbars className="flex-grow overflow-x-auto mt-20">
										<Table
											stickyHeader
											className={classes.table}
											size="small"
											aria-labelledby="tableTitle"
										>
											<TableHead>
												<TableRow>
													{hideFirstColumn !== true && <TableCell>Trademark</TableCell>}
													<TableCell align="center">{labelForUpdatesTableColumn}</TableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{updatesData
													.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
													.map(n => {
														let imageData = '';
														if (n.customerTrademarkDetailsDTO.typeForTm === 'IMAGE') {
															imageData = findAttachmentMatchingWithId(
																n.attachmentDTOs,
																n.customerTrademarkDetailsDTO.attachmentId
															);
														}
														return (
															<TableRow
																className="h-36 cursor-pointer"
																hover
																tabIndex={-1}
																key={n.id}
															>
																{hideFirstColumn === false ? (
																	<TableCell
																		className="w-10"
																		component="th"
																		scope="row"
																	>
																		{n.customerTrademarkDetailsDTO.typeForTm ===
																		'IMAGE' ? (
																			// eslint-disable-next-line
																			<img
																				className="w-1/2 block rounded"
																				onClick={() =>
																					handleOpenDialog(
																						imageData.url
																							? imageData.url
																							: '',
																						imageData.attachmentName
																							? imageData.attachmentName
																							: ''
																					)
																				}
																				src={imageData.url ? imageData.url : ''}
																				alt={
																					imageData.attachmentName
																						? imageData.attachmentName
																						: ''
																				}
																			/>
																		) : n.customerTrademarkDetailsDTO.typeForTm ===
																		  'TMAPPLNO' ? (
																			n.customerTrademarkDetailsDTO
																				.applicationTmNo
																		) : n.customerTrademarkDetailsDTO.typeForTm ===
																		  'TMREGNO' ? (
																			n.customerTrademarkDetailsDTO.registeredTmNo
																		) : (
																			n.customerTrademarkDetailsDTO.word
																		)}
																	</TableCell>
																) : null}

																<TableCell
																	// align="center"
																	className="w-52 px-4 md:px-0"
																	padding="none"
																	component="th"
																	scope="row"
																>
																	{n.documentReviewDTO.review}
																</TableCell>
															</TableRow>
														);
													})}
											</TableBody>
										</Table>
									</FuseScrollbars>

									<TablePagination
										className="flex-shrink-0 border-t-1"
										component="div"
										count={updatesData.length}
										rowsPerPage={rowsPerPage}
										page={page}
										rowsPerPageOptions={[3, 5]}
										backIconButtonProps={{
											'aria-label': 'Previous Page'
										}}
										nextIconButtonProps={{
											'aria-label': 'Next Page'
										}}
										onChangePage={handleChangePage}
										onChangeRowsPerPage={handleChangeRowsPerPage}
									/>
								</>
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1, transition: { delay: 0.1 } }}
									className="flex flex-1 items-center justify-center h-full mt-20"
								>
									<Typography color="textSecondary" variant="h5">
										No {labelForUpdatesTableColumn} found!
									</Typography>
								</motion.div>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
}

export default withRouter(DownloadSearchReports);
