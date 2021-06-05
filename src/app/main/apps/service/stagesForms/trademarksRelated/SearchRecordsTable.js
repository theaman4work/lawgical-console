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
	selectCustomerTrademarkDetails,
	getCustomerTrademarkDetails,
	removeCustomerTrademarkDetail
} from '../../store/customerTrademarkDetailsSlice';

const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

const findClassname = (classificationDTOs, idreq) => {
	const el = classificationDTOs.find(eltemp => eltemp.id === idreq); // Possibly returns `undefined`
	return `${el.name} ${el.desc}` || null; // so check result is truthy and extract `id`
};

function SearchRecordsTable(props) {
	const dispatch = useDispatch();
	const classes = useStyles();

	const customerTrademarkDetails = useSelector(selectCustomerTrademarkDetails);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(customerTrademarkDetails);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	useEffect(() => {
		dispatch(getCustomerTrademarkDetails()).then(() => setLoading(false));
	}, [dispatch]);

	useEffect(() => {
		setData(customerTrademarkDetails);
		props.onRecordAdditionOrRemoval(customerTrademarkDetails.length);
	}, [customerTrademarkDetails, props]);

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

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
							{/* <TableCell>id</TableCell> */}
							<TableCell>Class</TableCell>
							{/* <TableCell>Type</TableCell> */}
							<TableCell>Data</TableCell>
							<TableCell>Action</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
							const isSelected = selected.indexOf(n.id) !== -1;
							return (
								<TableRow className="h-36 cursor-pointer" hover tabIndex={-1} key={n.id}>
									{/* <TableCell component="th" scope="row">
										{n.id}
									</TableCell> */}

									<TableCell component="th" scope="row">
										{findClassname(props.classificationDTOs, n.classficationId)}
									</TableCell>

									{/* <TableCell component="th" scope="row">
										{n.typeForTm}
									</TableCell> */}

									<TableCell component="th" scope="row">
										{n.word || n.attachmentId}
									</TableCell>

									<TableCell component="th" scope="row">
										<IconButton
											onClick={ev => {
												ev.stopPropagation();
												const removeIds = [n.id];
												dispatch(removeCustomerTrademarkDetail(removeIds));
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

export default withRouter(SearchRecordsTable);
