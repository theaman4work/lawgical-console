import { Button, IconButton } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AddCircle } from '@material-ui/icons';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
	largeIcon: {
		width: 32,
		height: 32,
		color: '#0494AC'
	}
};

function Widget0(props) {
	const [currentRange, setCurrentRange] = useState(props.count);

	const productName = props.product !== null ? props.product : 'Trademarks';

	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between px-4">
				<div />
				<AddCircle style={styles.largeIcon} onClick={() => window.open('/services', '_self')} />
			</div>
			<div className="text-center">
				<Typography className="text-48 font-semibold leading-none text-blue tracking-tighter">
					{currentRange}
				</Typography>
				<Typography className="text-16 text-blue-800 font-normal pb-40">{productName}</Typography>
			</div>
		</Paper>
	);
}

export default memo(Widget0);
