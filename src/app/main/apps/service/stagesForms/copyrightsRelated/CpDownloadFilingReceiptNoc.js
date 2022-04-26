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
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { GetApp } from '@material-ui/icons';
import { axiosInstance } from 'app/auth-service/axiosInstance';

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

/* const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
}); */

function CpDownloadFilingReceiptNoc(props) {
	const classes = useStyles();
	/* 
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

    function handleOpenDialog(url, name) {
		setDialog({
			open: true,
			imageUrl: url,
			imageName: name
		});
	} */
	return (
		<div>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There are no records!
				</Typography>
			</motion.div>
		</div>
	);
}

export default withRouter(CpDownloadFilingReceiptNoc);
