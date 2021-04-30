import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo } from 'react';

function Widget3(props) {
	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between px-4">
				<div />
				<Icon className="text-32" style={{ color: '#0494AC' }}>
					add_circle
				</Icon>
			</div>
			<div className="text-center">
				<Typography className="text-48 font-semibold leading-none text-orange tracking-tighter">
					{props.widget.data.count}
				</Typography>
				<Typography className="text-16 font-normal text-orange-800 pb-40">{props.widget.data.name}</Typography>
			</div>
		</Paper>
	);
}

export default memo(Widget3);
