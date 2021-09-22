import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AddCircle } from '@material-ui/icons';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCustomerDashboardStats } from '../store/customerDashboardStatsSlice';

const styles = {
	largeIcon: {
		width: 32,
		height: 32,
		padding: 1
	}
};

function Widget0(props) {
	// const [currentRange, setCurrentRange] = useState(props.count);
	const dashboardStats = useSelector(selectCustomerDashboardStats);

	const productName = props.product !== null ? props.product : 'Trademarks';

	let tmStats = 0;
	if (dashboardStats) {
		// eslint-disable-next-line
		for ( const[key, value] of Object.entries(dashboardStats) ) {
			tmStats = value.trademarkCount;
			break;
		}
	}

	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between p-4">
				<div />
				{/* <AddCircle color="primary" style={styles.largeIcon} onClick={() => window.open('/services', '_self')} /> */}
			</div>
			<div
				className="text-center"
				onClick={() => {
					window.open('/services/trademarks', '_self');
				}}
				aria-hidden="true"
			>
				<Typography className="text-48 font-semibold leading-none text-blue tracking-tighter pt-20">
					{tmStats}
				</Typography>
				<Typography className="text-16 text-blue-800 font-normal pb-20">{productName}</Typography>
			</div>
		</Paper>
	);
}

export default memo(Widget0);
