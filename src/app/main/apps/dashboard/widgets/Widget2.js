import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { memo, useState } from 'react';

function Widget2(props) {
	const [currentRange, setCurrentRange] = useState(props.count);

	const productName = props.product !== null ? props.product : 'Patents';

	return (
		<Paper className="w-full rounded-20 shadow flex flex-col justify-between">
			<div className="flex items-center justify-between p-4">
				<div />
			</div>
			<div
				className="text-center"
				onClick={() => {
					window.open('/services/patents', '_self');
				}}
				aria-hidden="true"
			>
				<Typography className="text-48 font-semibold leading-none text-red tracking-tighter pt-20">
					{currentRange}
				</Typography>
				<Typography className="text-16 text-blue-800 font-normal pb-20">{productName}</Typography>
			</div>
		</Paper>
	);
}

export default memo(Widget2);
