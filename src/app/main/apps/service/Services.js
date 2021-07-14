import FusePageCarded from '@fuse/core/FusePageCarded';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductServices, selectProductServices } from './store/productServicesSlice';
import reducer from './store';
import TradeMarksTab from './tabs/TradeMarksTab';
import PatentsTab from './tabs/PatentsTab';
import CopyrightsTab from './tabs/CopyrightsTab';
import OtherLegalServicesTab from './tabs/OtherLegalServicesTab';
import DesignsTab from './tabs/DesignsTab';
import { getServices, selectServices } from './store/servicesSlice';

const useStyles = makeStyles(theme => ({
	topBg: {
		background: `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
		color: theme.palette.getContrastText(theme.palette.primary.main)
	},
	headerIcon: {
		position: 'absolute',
		top: -50,
		left: 0,
		opacity: 0.2,
		fontSize: 350,
		// width: 512,
		// height: 512,
		pointerEvents: 'none'
	}
}));

function Services(props) {
	const dispatch = useDispatch();
	const classes = useStyles(props);

	// const products = useSelector(({ projectDashboardApp }) => projectDashboardApp.products);
	const productServices = useSelector(selectProductServices);
	const services = useSelector(selectServices);

	// const i = 0;
	// let i = 0;
	// if (window.location.href.indexOf('/patents') > -1) {
	// 	i = 1;
	// } else if (window.location.href.indexOf('/copyrights') > -1) {
	// 	i = 2;
	// } else if (window.location.href.indexOf('/legalservices') > -1) {
	// 	i = 3;
	// } else {
	// 	i = 0;
	// }
	// console.log('tabValue: ', i);
	const [tabValue, setTabValue] = useState(0);
	// console.log('tabValue: ', tabValue);

	useEffect(() => {
		dispatch(getProductServices());
		dispatch(getServices());
	}, [dispatch]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136 items-center',
				topBg: classes.topBg
			}}
			header={
				<div className="flex flex-1 w-full items-start justify-between">
					{/* <div className="flex flex-1 flex-col items-center sm:items-start"> */}
					{/* <div className="w-1/4" /> */}
					<div className="flex flex-col min-w-0 items-start sm:items-start">
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0 } }}>
							<Typography color="inherit" className="text-16 sm:text-36 font-bold tracking-tight">
								Welcome to Services
							</Typography>
						</motion.div>
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
							<Typography
								color="inherit"
								className="text-10 sm:text-12 mt-4 sm:mt-12 opacity-75 leading-tight sm:leading-loose"
							>
								Our courses will step you through the process of building a small application, or adding
								a new feature to an existing application. Our courses will step you through the process
								of building a small application, or adding a new feature to an existing application.
							</Typography>
						</motion.div>
					</div>
					<Icon className={classes.headerIcon}> school </Icon>
					{/* </div> */}
				</div>
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					// initialSelectedIndex={tabValue}
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className="h-64" label="Trademarks" />
					<Tab className="h-64" label="Patents" />
					<Tab className="h-64" label="Copyrights" />
					<Tab className="h-64" label="Design" />
					<Tab className="h-64" label="Other Legal Services" />
				</Tabs>
			}
			content={
				<div className="p-8 sm:p-12 max-w-2xl w-full">
					{tabValue === 0 && <TradeMarksTab />}
					{tabValue === 1 && <PatentsTab />}
					{tabValue === 2 && <CopyrightsTab />}
					{tabValue === 3 && <DesignsTab />}
					{tabValue === 4 && <OtherLegalServicesTab />}
				</div>
			}
			innerScroll
		/>
	);
}

export default withReducer('servicesApp', reducer)(Services);
