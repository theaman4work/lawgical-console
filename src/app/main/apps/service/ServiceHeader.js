import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { motion } from 'framer-motion';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	header: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
		color: theme.palette.getContrastText(theme.palette.primary.main)
	},
	headerIcon: {
		position: 'absolute',
		top: -64,
		left: 0,
		opacity: 0.04,
		fontSize: 512,
		width: 512,
		height: 512,
		pointerEvents: 'none'
	}
}));

function ServiceHeader(props) {
    const classes = useStyles(props);

	return (
		<div className="flex flex-col flex-auto flex-shrink-0 w-full">
			<div
				className={clsx(
					classes.header,
					'relative overflow-hidden flex flex-shrink-0 items-center justify-center h-150 sm:h-238'
				)}
			>
				<div className="flex flex-col max-w-2xl mx-auto w-full p-24 sm:p-32">
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0 } }}>
						<Typography color="inherit" className="text-24 sm:text-44 font-bold tracking-tight">
							Welcome to Service
						</Typography>
					</motion.div>
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
						<Typography
							color="inherit"
							className="text-12 sm:text-14 mt-8 sm:mt-16 opacity-75 leading-tight sm:leading-loose"
						>
							Our courses will step you through the process of building a small application, or adding a
							new feature to an existing application. Our courses will step you through the process of
							building a small application, or adding a new feature to an existing application.
						</Typography>
					</motion.div>
				</div>

				<Icon className={classes.headerIcon}> school </Icon>
			</div>
		</div>
	);
}

export default ServiceHeader;
