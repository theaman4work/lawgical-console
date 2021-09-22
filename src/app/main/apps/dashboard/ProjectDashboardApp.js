import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProjectDashboardAppHeader from './ProjectDashboardAppHeader';
import reducer from './store';
import { getWidgets, selectWidgets } from './store/widgetsSlice';
import HomeTab from './tabs/HomeTab';
import { getProducts, selectProducts } from './store/productsSlice';
import { getCustomerDashboardStats, selectCustomerDashboardStats } from './store/customerDashboardStatsSlice';
import ProjectDashboardAppSidebar from './ProjectDashboardAppSidebar';

const useStyles = makeStyles(theme => ({
	content: {
		'& canvas': {
			maxHeight: '100%'
		}
	}
}));

function ProjectDashboardApp(props) {
	const dispatch = useDispatch();
	const widgets = useSelector(selectWidgets);
	const products = useSelector(selectProducts);
	const dashboardStats = useSelector(selectCustomerDashboardStats);
	// const routeParams = useParams();

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useEffect(() => {
		dispatch(getWidgets());
		dispatch(getProducts());
		dispatch(getCustomerDashboardStats());
	}, [dispatch]);

	if (_.isEmpty(widgets)) {
		return null;
	}
	if (_.isEmpty(products)) {
		return null;
	}
	if (_.isEmpty(dashboardStats)) {
		return null;
	}

	return (
		<FusePageSimple
			classes={{
				header: 'min-h-140 h-140 lg:ltr:rounded-br-20 lg:rtl:rounded-bl-20 lg:ltr:mr-12 lg:rtl:ml-12',
				toolbar: 'min-h-56 h-56 items-end',
				rightSidebar: 'w-288 border-0 py-12',
				content: classes.content
			}}
			header={<ProjectDashboardAppHeader pageLayout={pageLayout} />}
			content={
				<div className="p-12 lg:ltr:pr-0 lg:rtl:pl-0">
					<HomeTab />
				</div>
			}
			rightSidebarContent={<ProjectDashboardAppSidebar />}
			ref={pageLayout}
		/>
	);
}

export default withReducer('projectDashboardApp', reducer)(ProjectDashboardApp);
