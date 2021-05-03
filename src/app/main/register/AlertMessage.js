import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';

export default function AlertMessage({ message }) {
	const [open, setOpen] = useState(true);
	function handleClose(event, reason) {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	}

	return (
		<div>
			<Snackbar
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				open={open}
				autoHideDuration={2000}
				onClose={handleClose}
				variant="warning"
				ContentProps={{
					'aria-describedby': 'message-id'
				}}
				message={message}
				action={[
					<IconButton key="close" onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				]}
			/>
		</div>
	);
}
