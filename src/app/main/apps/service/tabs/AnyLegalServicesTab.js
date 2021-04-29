import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { useTheme } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../CategoriesList';
import { courses } from '../CoursesList';

function AnyLegalServicesTab() {
	const theme = useTheme();
	const coursesTemp = courses;
	const categoriesTemp = categories;

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
			{coursesTemp &&
				(coursesTemp.length > 0 ? (
					<motion.div className="flex flex-wrap py-24" variants={container} initial="hidden" animate="show">
						{coursesTemp.map(course => {
							const category = categoriesTemp.find(_cat => _cat.value === course.category);
							return (
								<motion.div
									variants={item}
									className="w-full pb-24 sm:w-1/2 lg:w-1/3 sm:p-16"
									key={course.id}
								>
									<Card className="flex flex-col h-256 shadow">
										<div
											className="flex flex-shrink-0 items-center justify-between px-24 h-64"
											style={{
												background: category.color,
												color: theme.palette.getContrastText(category.color)
											}}
										>
											<Typography className="font-medium truncate" color="inherit">
												{category.label}
											</Typography>
											<div className="flex items-center justify-center opacity-75">
												<Icon className="text-20 mx-8" color="inherit">
													access_time
												</Icon>
												<div className="text-14 font-medium whitespace-nowrap">
													{course.length}
													min
												</div>
											</div>
										</div>
										<CardContent className="flex flex-col flex-auto items-center justify-center">
											<Typography className="text-center text-16 font-medium">
												{course.title}
											</Typography>
											<Typography
												className="text-center text-13 mt-8 font-normal"
												color="textSecondary"
											>
												{course.updated}
											</Typography>
										</CardContent>
										<CardActions className="justify-center pb-24">
											<Button
												to={`/apps/service/courses/${course.id}/${course.slug}`}
												component={Link}
												className="justify-start px-32"
												color="primary"
												variant="outlined"
											>
												{buttonStatus(course)}
											</Button>
										</CardActions>
										<LinearProgress
											className="w-full"
											variant="determinate"
											value={(course.activeStep * 100) / course.totalSteps}
											color="secondary"
										/>
									</Card>
								</motion.div>
							);
						})}
					</motion.div>
				) : (
					<div className="flex flex-1 items-center justify-center">
						<Typography color="textSecondary" className="text-24 my-24">
							No courses found!
						</Typography>
					</div>
				))}
		</div>
	);
}

export default AnyLegalServicesTab;
