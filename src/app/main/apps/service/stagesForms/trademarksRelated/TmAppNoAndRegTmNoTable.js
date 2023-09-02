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
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
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

function TmAppNoAndRegTmNoTable(props) {
	const dispatch = useDispatch();
	const classes = useStyles();

	const responseCustomerTrademarkDetailsAndAttachments = useSelector(
		selectResponseCustomerTrademarkDetailsAndAttachments
	);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(responseCustomerTrademarkDetailsAndAttachments);
	const [page, setPage] = useState(parseInt(0));
	const [rowsPerPage, setRowsPerPage] = useState(5);

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

	function handleChangePage(value, newpage) {
		setPage(parseInt(newpage));
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(parseInt(event.target.value, data.length));
		setPage(parseInt(0));
	}

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0 || props.lserviceStageTransactionId === null) {
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
							<TableCell>
								{props.trademarkNoType === 1 ? 'TM Application No' : 'Registered TM No'}
							</TableCell>
							<TableCell>Action</TableCell>
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
										{props.trademarkNoType === 1
											? n.customerTrademarkDetailsDTO.applicationTmNo
											: n.customerTrademarkDetailsDTO.registeredTmNo}
									</TableCell>

									<TableCell component="th" scope="row">
										<IconButton
											onClick={ev => {
												ev.stopPropagation();
												const removeIds = [n.id];
												dispatch(
													removeResponseCustomerTrademarkDetailsAndAttachment(removeIds)
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
	);
}

export default withRouter(TmAppNoAndRegTmNoTable);
