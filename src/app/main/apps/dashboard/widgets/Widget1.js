import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo, useState } from 'react';

function Widget1(props) {
	const [currentRange, setCurrentRange] = useState(props.widget.currentRange);
	// console.log("Widget1 props:" ,props);
	function handleChangeRange(ev) {
		setCurrentRange(ev.target.value);
	}

	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between px-4">
				<div />
				<Icon className="text-32" style={{ color: '#0494AC' }}>
					add_circle
				</Icon>
			</div>
			<div className="text-center">
				<Typography className="text-48 font-semibold leading-none text-blue tracking-tighter">
					{props.widget.data.count[currentRange]}
				</Typography>
				<Typography className="text-16 text-blue-800 font-normal pb-40">{props.widget.data.name}</Typography>
			</div>
		</Paper>
	);
}

export default memo(Widget1);
