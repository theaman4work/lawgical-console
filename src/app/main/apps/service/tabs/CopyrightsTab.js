import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { amber, blue, blueGrey, green } from '@material-ui/core/colors';
import { useTheme } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectProductServices } from '../store/productServicesSlice';
import { selectServices } from '../store/servicesSlice';
import { courses } from '../CoursesList';

function CopyrightsTab() {
	const theme = useTheme();
	const coursesTemp = courses;
	const productServices = useSelector(selectProductServices);
	const subservices = useSelector(selectServices);

	const productServicesForCopyright = [];
	const subServicesForCopyright = [];

	// eslint-disable-next-line
	Object.keys(productServices).map(function (keyName) {
		if (productServices[keyName].productId === 3) {
			productServicesForCopyright.push(productServices[keyName]);

			// eslint-disable-next-line
			Object.keys(subservices).map(function (keyNameSubService) {
				if (subservices[keyNameSubService].productLserviceId === productServices[keyName].id) {
					subServicesForCopyright.push(subservices[keyNameSubService]);
				}
			});
		}
	});

	if (productServicesForCopyright.length < 1) {
		return null;
	}

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
		<div className="flex flex-col flex-auto flex-shrink-0 w-full">
			{productServicesForCopyright &&
				(productServicesForCopyright.length > 0 ? (
					<motion.div className="flex flex-wrap py-24" variants={container} initial="hidden" animate="show">
						{productServicesForCopyright.map(productService => {
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
												background: productService.id % 2 === 0 ? blue[500] : amber[500],
												color: theme.palette.getContrastText(
													productService.id % 2 === 0 ? blue[500] : amber[500]
												)
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
												subServicesForCopyright.map((subService, i) => {
														const url = `/apps/services/steps/${subService.id}`;
														if (subService.productLserviceId === productService.id) {
															return (
																<ListItem
																	key={i}
																	// onClick={() => handleOpenDialog(article)}
																	className="pl-12"
																	button
																	component={Link}
																	to={url}
																>
																	<ListItemIcon className="min-w-40">
																		<Icon className="text-20">import_contacts</Icon>
																	</ListItemIcon>
																	<ListItemText primary={subService.name} />
																</ListItem>
															);
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
	);
}

export default CopyrightsTab;
