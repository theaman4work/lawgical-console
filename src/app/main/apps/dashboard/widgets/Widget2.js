import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo, useState } from 'react';

function Widget2(props) {
	const [currentRange, setCurrentRange] = useState(props.count);

	const productName = props.product !== null ? props.product : 'Copyrights';

	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between px-4">
				<div />
				<Icon className="text-32" style={{ color: '#0494AC' }}>
					add_circle
				</Icon>
			</div>
			<div className="text-center">
				<Typography className="text-48 font-semibold leading-none text-red tracking-tighter">
					{currentRange}
				</Typography>
				<Typography className="text-16 font-normal text-red-800 pb-40">{productName}</Typography>
			</div>
		</Paper>
	);
}

export default memo(Widget2);
