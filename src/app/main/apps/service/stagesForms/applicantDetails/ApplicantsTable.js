import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import {
	getApplicants,
	openEditApplicantDialog,
	openNewApplicantDialog,
	selectApplicants,
	setApplicantsForLserviceTransaction
} from '../../store/applicantSlice';
import { updateData } from '../../store/serviceStepsSlice';
import ApplicantsTableHead from './ApplicantsTableHead';

function ApplicantsTable(props) {
	const dispatch = useDispatch();
	const applicants = useSelector(selectApplicants);
	// console.log('ApplicantsTable');
	// console.log(props);

	const [messageAndLevel, setMessageAndLevel] = useState({
		message: '',
		level: 'error',
		open: false
	});
	const [selected, setSelected] = useState([]);
	// const [data, setData] = useState(applicants);
	const [error, setError] = useState(null);
	const [applicant, setApplicant] = useState({
		direction: 'asc',
		id: null
	});

	useEffect(() => {
		dispatch(getApplicants());
	}, [dispatch]);

	useEffect(() => {
		console.log();

		const selectedIds = [];
		if (applicants.length > 0) {
			// eslint-disable-next-line
			for ( const[key, value] of Object.entries(applicants) ) {
				// console.log('key - value');
				// console.log(`${key} - ${JSON.stringify(value.applicantsOfLserTransDTOs)}`);
				if (value.applicantsOfLserTransDTOs != null && value.applicantsOfLserTransDTOs.length > 0) {
					// eslint-disable-next-line
					for (const [key1, value1] of Object.entries(value.applicantsOfLserTransDTOs)) {
						// console.log('key1 - value1');
						// console.log(`${key1} - ${JSON.stringify(value1)}`);
						if (
							props.lserviceTransaction.id === value1.lserviceTransactionId &&
							value1.status === 'ACTIVE'
						) {
							selectedIds.push(value1.applicantId);
						}
					}
				}
			}
			setSelected(selectedIds);
		}
	}, [applicants, props.lserviceTransaction.id]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (applicant.id === property && applicant.direction === 'desc') {
			direction = 'asc';
		}

		setApplicant({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(applicants.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleRowClick(item) {
		const editDialogData = {
			id: item.id,
			name: item.applicantDTO.name,
			contactPhoneNo: item.applicantDTO.contactPhoneNo || '',
			contactEmail: item.applicantDTO.contactEmail || '',
			avatar: 'assets/images/avatars/profile.jpg',
			nationality: item.applicantDTO.nationality || '',
			type: item.applicantDTO.type || '',
			addressLine1: item.addressDTO.addressLine1 || '',
			addressLine2: item.addressDTO.addressLine2 || '',
			pincode: item.addressDTO.pincode || '',
			city: item.addressDTO.city || '',
			state: item.addressDTO.state || '',
			country: item.addressDTO.country || '',
			addressId: item.addressDTO.id || '',
			createdOn: item.applicantDTO.createdOn || '',
			addressCreatedOn: item.addressDTO.createdOn || ''
		};
		dispatch(openEditApplicantDialog(editDialogData));
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
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

	function saveApplicantsForLservice() {
		let message = '';
		let open = false;
		let level = 'error';

		if (selected.length <= 0) {
			message = 'Please select atleast 1 applicant!';
			open = true;
		} else {
			// eslint-disable-next-line
			if (props.lserviceTransaction.id == null) {
				message = 'Please complete the previous steps before trying to complete this step!';
				open = true;
				setSelected([]);
			} else if (props.lservice != null) {
				if (!props.lservice.areMultipleApplicantsAllowed && selected.length > 1) {
					message = `${props.lservice.name} does not allow multiple applicants hence select only 1!`;
					open = true;
				} else {
					const reqData = {
						applicantIds: selected,
						lserviceTransactionId: props.lserviceTransaction.id,
						mail: localStorage.getItem('lg_logged_in_email')
					};

					message = `${selected.length} applicants saved successfully.`;
					open = true;
					level = 'success';
					dispatch(setApplicantsForLserviceTransaction(reqData));

					if (props.lserviceStageTransaction === null) {
						const lserviceTransactionId = props.lserviceTransaction.id;
						dispatch(
							updateData({
								lserviceTransactionId,
								stageStatus: 'INPROGRESS',
								lserviceStageId: props.step.id,
								lserviceId: props.step.lserviceId
							})
						);
					}
				}
			} else {
				message = 'Unknown error occurred, please try again!';
				open = true;
			}
		}
		setMessageAndLevel({
			message,
			open,
			level
		});
	}

	if (applicants.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography className="pr-10" color="textSecondary" variant="h5">
					There are no applicants!
				</Typography>

				<Button
					variant="contained"
					color="primary"
					size="medium"
					aria-label="addnew"
					onClick={ev => dispatch(openNewApplicantDialog())}
				>
					Add
				</Button>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<Typography className="text-16 sm:text-20 truncate font-semibold">
				{`Step ${props.stepCount} - ${props.step.name}`}
			</Typography>

			<Collapse in={messageAndLevel.open}>
				<Alert
					severity={messageAndLevel.level}
					variant="outlined"
					className="mb-10"
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
			<div className="w-full flex items-center justify-end pb-10">
				<Button
					variant="contained"
					color="primary"
					size="medium"
					aria-label="addnew"
					onClick={ev => dispatch(openNewApplicantDialog())}
				>
					Add New
				</Button>
				<Button
					variant="contained"
					color="primary"
					size="medium"
					aria-label="save"
					className="ml-5"
					onClick={() => saveApplicantsForLservice()}
				>
					Save
				</Button>
			</div>
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<ApplicantsTableHead
						selectedApplicantIds={selected}
						applicant={applicant}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={applicants.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(
							applicants,
							[
								o => {
									switch (applicant.id) {
										case 'id': {
											return parseInt(o.id, 10);
										}
										case 'name': {
											return o.applicantDTO.name;
										}
										case 'email': {
											return o.applicantDTO.contactEmail;
										}
										case 'phone': {
											return o.applicantDTO.contactPhoneNo;
										}
										case 'city': {
											return o.addressDTO.city;
										}
										case 'createdOn': {
											return o.applicantDTO.createdOn;
										}
										default: {
											return o[applicant.id];
										}
									}
								}
							],
							[applicant.direction]
						).map(n => {
							const isSelected = selected.indexOf(n.id) !== -1;
							return (
								<TableRow
									className="h-72 cursor-pointer"
									hover
									role="checkbox"
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.id}
									selected={isSelected}
									onClick={event => handleRowClick(n)}
								>
									<TableCell className="w-40 md:w-64 text-center" padding="none">
										<Checkbox
											checked={isSelected}
											onClick={event => event.stopPropagation()}
											onChange={event => handleCheck(event, n.id)}
										/>
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row">
										{n.applicantDTO.name}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row">
										{n.applicantDTO.contactEmail}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row">
										{n.applicantDTO.contactPhoneNo}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row">
										{n.addressDTO.city}
									</TableCell>

									<TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
										{n.applicantDTO.createdOn}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</FuseScrollbars>
		</div>
	);
}

export default withRouter(ApplicantsTable);
