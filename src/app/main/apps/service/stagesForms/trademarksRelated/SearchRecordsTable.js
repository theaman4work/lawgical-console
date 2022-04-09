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
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
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
import {
	selectResponseCustomerTrademarkDetailsAndAttachments,
	getResponseCustomerTrademarkDetailsAndAttachments,
	removeResponseCustomerTrademarkDetailsAndAttachment
} from '../../store/responseCustomerTrademarkDetailsAndAttachmentsSlice';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const findClassname = (classificationDTOs, idreq) => {
	const el = classificationDTOs.find(eltemp => eltemp.id === idreq); // Possibly returns `undefined`
	return `${el.name} ${el.label}` || null; // so check result is truthy and extract `id`
};

// const findImageAttachmentUrlFromList = attachmentDTOs => {
// 	const el = attachmentDTOs.find(eltemp => eltemp.type === 'IMAGE'); // Possibly returns `undefined`
// 	return el.url || null; // so check result is truthy and extract `id`
// };

function SearchRecordsTable(props) {
	const dispatch = useDispatch();
	const classes = useStyles();

	const responseCustomerTrademarkDetailsAndAttachments = useSelector(
		selectResponseCustomerTrademarkDetailsAndAttachments
	);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(responseCustomerTrademarkDetailsAndAttachments);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [dialog, setDialog] = useState({
		open: false,
		imageUrl: null,
		imageName: null
	});

	useEffect(() => {
		dispatch(getResponseCustomerTrademarkDetailsAndAttachments()).then(() => setLoading(false));
	}, [dispatch]);

	useEffect(() => {
		setData(
			responseCustomerTrademarkDetailsAndAttachments.filter(
				eachRec =>
					eachRec.customerTrademarkDetailsDTO.lserviceStageTransactionId === props.lserviceStageTransactionId
			)
		);
		props.onRecordAdditionOrRemoval(data.length);
	}, [responseCustomerTrademarkDetailsAndAttachments, props, data.length]);

	function handleChangePage(value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
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
			) : data.length === 0 || props.lserviceStageTransactionId === null ? (
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
					<FuseScrollbars className="flex-grow overflow-x-auto">
						<Table stickyHeader className={classes.table} size="small" aria-labelledby="tableTitle">
							<TableHead>
								<TableRow>
									{/* <TableCell>id</TableCell> */}
									<TableCell>Class</TableCell>
									{/* <TableCell>Type</TableCell> */}
									<TableCell>Trademark</TableCell>
									<TableCell>Remove</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
									return (
										<TableRow className="h-36 cursor-pointer" hover tabIndex={-1} key={n.id}>
											{/* <TableCell component="th" scope="row">
												{n.id}
											</TableCell> */}

											<TableCell component="th" scope="row">
												{findClassname(
													props.classificationDTOs,
													n.customerTrademarkDetailsDTO.classficationId
												)}
											</TableCell>

											<TableCell
												className="w-52 md:px-0 text-center"
												padding="none"
												component="th"
												scope="row"
											>
												{n.customerTrademarkDetailsDTO.typeForTm === 'IMAGE' ? (
													// eslint-disable-next-line
													<img
														className="w-full block rounded"
														onClick={() =>
															handleOpenDialog(
																n.attachmentDTOs[0].url,
																n.attachmentDTOs[0].name
															)
														}
														src={n.attachmentDTOs[0].url}
														alt={n.attachmentDTOs[0].name}
													/>
												) : (
													n.customerTrademarkDetailsDTO.word
												)}
											</TableCell>

											<TableCell component="th" scope="row">
												<IconButton
													onClick={ev => {
														ev.stopPropagation();
														const removeIds = [n.id];
														dispatch(
															removeResponseCustomerTrademarkDetailsAndAttachment(
																removeIds
															)
														);
													}}
												>
													<Icon>delete</Icon>
												</IconButton>
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
				</div>
			)}
		</>
	);
}

export default withRouter(SearchRecordsTable);
