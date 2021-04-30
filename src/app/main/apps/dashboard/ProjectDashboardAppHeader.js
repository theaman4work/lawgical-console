import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import { selectWidgets } from './store/widgetsSlice';

function ProjectDashboardAppHeader(props) {
	const { pageLayout } = props;
	const user = useSelector(({ auth }) => auth.user);

	return (
		<div className="flex flex-col justify-between flex-1 min-w-0 px-24 pt-24">
			<div className="flex justify-between items-center">
				<div className="flex items-center min-w-0">
					{user.data.photoURL ? (
						<Avatar className="w-52 h-52 sm:w-64 sm:h-64" alt="user photo" src={user.data.photoURL} />
					) : (
						<Avatar className="w-52 h-52 sm:w-64 sm:h-64">{user.data.displayName[0]}</Avatar>
					)}
					<div className="mx-12 min-w-0">
						<Typography className="text-18 sm:text-24 md:text-32 font-bold leading-none mb-8 tracking-tight">
							Welcome back, {user.data.displayName}!
						</Typography>

						<div className="flex items-center opacity-60 truncate">
							<Icon className="text-14 sm:text-24">notifications</Icon>
							<Typography className="text-12 sm:text-14 font-medium mx-4 truncate">
								You have 2 new messages and 15 new tasks
							</Typography>
						</div>
					</div>
				</div>
				<Hidden lgUp>
					<IconButton
						onClick={ev => pageLayout.current.toggleRightSidebar()}
						aria-label="open left sidebar"
						color="inherit"
					>
						<Icon>menu</Icon>
					</IconButton>
				</Hidden>
			</div>
		</div>
	);
}

export default ProjectDashboardAppHeader;
