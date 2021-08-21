import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useTheme } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forwardRef, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProductServices } from '../store/productServicesSlice';
import { selectServices } from '../store/servicesSlice';
import { selectServiceTransactions } from '../store/lserviceTransactionsSlice';

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function TradeMarkTab() {
	const theme = useTheme();
	const productServices = useSelector(selectProductServices);
	const subservices = useSelector(selectServices);
	const serviceTransactions = useSelector(selectServiceTransactions);

	const productServicesForTradeMark = [];
	const subServicesForTradeMark = [];
	const [dialog, setDialog] = useState({
		open: false,
		title: null,
		serviceData: null,
		records: null
	});

	// eslint-disable-next-line
	Object.keys(productServices).map(function (keyName) {
		if (productServices[keyName].productId === 1) {
			productServicesForTradeMark.push(productServices[keyName]);

			// eslint-disable-next-line
			Object.keys(subservices).map(function (keyNameSubService) {
				if (subservices[keyNameSubService].productLserviceId === productServices[keyName].id) {
					subServicesForTradeMark.push(subservices[keyNameSubService]);
				}
			});
		}
	});

	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: {
			opacity: 0,
			y: 20
		},
		show: {
			opacity: 1,
			y: 0
		}
	};

	function handleOpenDialog(serviceData, listOfServiceTransactions) {
		setDialog({
			open: true,
			title: serviceData.name,
			serviceData,
			records: listOfServiceTransactions
			// ...dialogData
		});
	}

	function buttonStatus(course) {
		switch (course.activeStep) {
			case course.totalSteps:
				return 'Completed';
			case 0:
				return 'Start';
			default:
				return 'Continue';
		}
	}

	return (
		<>
			<div>
				{useMemo(() => {
					function handleCloseDialog() {
						setDialog({
							...dialog,
							open: false
						});
					}

					return (
						<Dialog
							classes={{
								paper: 'm-24'
							}}
							open={dialog.open}
							onClose={handleCloseDialog}
							aria-labelledby="service-applications-list"
							TransitionComponent={Transition}
							fullWidth
							maxWidth="xs"
						>
							<AppBar position="static" elevation={0} className="items-center">
								<Typography variant="h6" color="inherit" className="p-16 items-center">
									{dialog.title}
								</Typography>
							</AppBar>
							<DialogContent className="w-full">
								<List component="nav" className="w-full p-0 pt-0" autoFocus>
									{dialog.records &&
										// eslint-disable-next-line
									dialog.records.map((serviceTransaction, i) => {
											const url = `/apps/services/steps/trademarks/${dialog.serviceData.id}`;
											// console.log(serviceTransaction.createdOn);
											return (
												<>
													<ListItem
														key={serviceTransaction.createdOn}
														className="pl-12"
														button
														component={Link}
														to={`${url}/${serviceTransaction.id}`}
													>
														<ListItemText
															primary={
																serviceTransaction.lablelByUser !== null
																	? serviceTransaction.lablelByUser
																	: serviceTransaction.sysGenName
															}
														/>
													</ListItem>
													<Divider key={i} />
												</>
											);
										})}
								</List>
							</DialogContent>
							<DialogActions className="p-16">
								<Button
									color="primary"
									variant="contained"
									size="medium"
									aria-label="closePopup"
									component={Link}
									to={
										dialog.serviceData && `/apps/services/steps/trademarks/${dialog.serviceData.id}`
									}
								>
									Add New
								</Button>
								<Button
									onClick={handleCloseDialog}
									color="primary"
									variant="contained"
									size="medium"
									aria-label="closePopup"
								>
									Close
								</Button>
							</DialogActions>
						</Dialog>
					);
				}, [dialog])}
			</div>
			<div className="flex flex-col flex-auto flex-shrink-0 w-full">
				{productServicesForTradeMark &&
					(productServicesForTradeMark.length > 0 ? (
						<motion.div
							className="flex flex-wrap py-24"
							variants={container}
							initial="hidden"
							animate="show"
						>
							{productServicesForTradeMark.map(productService => {
								return (
									<motion.div
										variants={item}
										className="w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16"
										key={productService.id}
									>
										<Card className="flex flex-col h-256 shadow">
											<div
												className="flex flex-shrink-0 items-center justify-between px-24 h-64"
												style={{
													background: '#607D8B',
													color: theme.palette.getContrastText('#607D8B')
												}}
											>
												<Typography className="font-medium truncate" color="inherit">
													{productService.name}
												</Typography>
											</div>
											<CardContent className="flex flex-col flex-auto items-start justify-start pl-6 pt-1 pr-6">
												<List
													component="nav"
													style={{ maxHeight: '200px', overflow: 'auto', width: '100%' }}
													className="p-0 pt-0"
													autoFocus
												>
													{
														// eslint-disable-next-line
														subServicesForTradeMark.map((subService, i) => {
															const url = `/apps/services/steps/trademarks/${subService.id}`;
															if (
																subService.productLserviceId === productService.id &&
																subService.status === 'ACTIVE'
															) {
																const listOfServiceTransactions = serviceTransactions.filter(
																	rec => rec.servicesId === subService.id
																);

																if (listOfServiceTransactions.length > 0) {
																	return (
																		<ListItem
																			key={productService.id + i}
																			onClick={() =>
																				handleOpenDialog(
																					subService,
																					listOfServiceTransactions
																				)
																			}
																			className="pl-12"
																			button
																		>
																			<ListItemIcon className="min-w-40">
																				<Icon className="text-20">
																					import_contacts
																				</Icon>
																			</ListItemIcon>
																			<ListItemText primary={subService.name} />
																		</ListItem>
																	);
																	// eslint-disable-next-line
																} else {
																	return (
																		<ListItem
																			key={subService.createdOn}
																			className="pl-12"
																			button
																			component={Link}
																			to={url}
																		>
																			<ListItemIcon className="min-w-40">
																				<Icon className="text-20">
																					import_contacts
																				</Icon>
																			</ListItemIcon>
																			<ListItemText primary={subService.name} />
																		</ListItem>
																	);
																}
															}
														})
													}
												</List>
											</CardContent>
											{/* <LinearProgress
												className="w-full"
												variant="determinate"
												value={(productService.activeStep * 100) / productService.totalSteps}
												color="secondary"
											/> */}
										</Card>
									</motion.div>
								);
							})}
						</motion.div>
					) : (
						<div className="flex flex-1 items-center justify-center">
							<Typography color="textSecondary" className="text-24 my-24">
								No Trademark services found!
							</Typography>
						</div>
					))}
			</div>
		</>
	);
}

export default TradeMarkTab;
