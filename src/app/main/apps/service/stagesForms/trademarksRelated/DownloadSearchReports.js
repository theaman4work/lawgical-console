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
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
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

function DownloadSearchReports(props) {
	const dispatch = useDispatch();
	const classes = useStyles();

	const responseCustomerTrademarkDetailsAndAttachments = useSelector(selectResponseDocumentReviewAndAttachments);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(responseCustomerTrademarkDetailsAndAttachments);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [stateLserviceStageTransactionId, setStateLserviceStageTransactionId] = useState(
		props.lserviceStageTransaction !== null ? props.lserviceStageTransaction.id : null
	);

	useEffect(() => {
		if (props.lserviceTransaction.id !== null && stateLserviceStageTransactionId == null) {
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
		} else {
			dispatch(getResponseDocumentReviewAndAttachments(stateLserviceStageTransactionId)).then(() =>
				setLoading(false)
			);
		}
	}, [
		dispatch,
		props.step.id,
		props.step.lserviceId,
		props.lserviceStageTransaction,
		props.lserviceTransaction,
		stateLserviceStageTransactionId
	]);

	useEffect(() => {
		setData(responseCustomerTrademarkDetailsAndAttachments);
	}, [responseCustomerTrademarkDetailsAndAttachments]);

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	const findAttachmentMatchingWithId = (attachmentList, attachmentId) => {
		const el = attachmentList.find(eltemp => eltemp.id === attachmentId); // Possibly returns `undefined`
		return el !== null ? el.url : null; // so check result is truthy and extract `id`
	};

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There are no records!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full ml-10">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className={classes.table} size="small" aria-labelledby="tableTitle">
					<TableHead>
						<TableRow>
							<TableCell>Trademark</TableCell>
							<TableCell align="center">Download Report</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							return (
								<TableRow className="h-36 cursor-pointer" hover tabIndex={-1} key={n.id}>
									<TableCell className="w-10 px-4 md:px-0" component="th" scope="row">
										{n.customerTrademarkDetailsDTO.typeForTm === 'IMAGE' ? (
											<img
												className="w-1/2 block rounded"
												src={findAttachmentMatchingWithId(
													n.attachmentDTOs,
													n.customerTrademarkDetailsDTO.attachmentId
												)}
												alt={n.customerTrademarkDetailsDTO.word}
											/>
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
													'_self'
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
		</div>
	);
}

export default withRouter(DownloadSearchReports);
