import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const rows = [
	{
		id: 'name',
		align: 'left',
		disablePadding: false,
		label: 'Name',
		sort: true
	},
	{
		id: 'email',
		align: 'left',
		disablePadding: false,
		label: 'Email',
		sort: true
	},
	{
		id: 'phone',
		align: 'left',
		disablePadding: false,
		label: 'Phone',
		sort: true
	},
	{
		id: 'city',
		align: 'left',
		disablePadding: false,
		label: 'City',
		sort: true
	},
	{
		id: 'createdOn',
		align: 'left',
		disablePadding: false,
		label: 'Created On',
		sort: true
	}
];

const useStyles = makeStyles(theme => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	}
}));

function ApplicantsTableHead(props) {
	// console.log(props);
	const classes = useStyles(props);
	const { selectedApplicantIds } = props;
	const numSelected = selectedApplicantIds.length;

	const [selectedApplicantsMenu, setSelectedApplicantsMenu] = useState(null);

	const dispatch = useDispatch();

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	function openSelectedApplicantsMenu(event) {
		setSelectedApplicantsMenu(event.currentTarget);
	}

	function closeSelectedApplicantsMenu() {
		setSelectedApplicantsMenu(null);
	}

	return (
		<TableHead>
			<TableRow className="h-48 sm:h-64">
				<TableCell padding="none" className="w-40 md:w-64 text-center z-99">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < props.rowCount}
						checked={props.rowCount !== 0 && numSelected === props.rowCount}
						onChange={props.onSelectAllClick}
					/>
				</TableCell>
				{rows.map(row => {
					return (
						<TableCell
							className="p-4 md:p-16"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'default'}
							sortDirection={props.applicant.id === row.id ? props.applicant.direction : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props.applicant.id === row.id}
										direction={props.applicant.direction}
										onClick={createSortHandler(row.id)}
										className="font-semibold"
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				}, this)}
			</TableRow>
		</TableHead>
	);
}

export default ApplicantsTableHead;
