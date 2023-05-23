import FuseUtils from '@fuse/utils';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Pagination from '@material-ui/lab/Pagination';
import _ from '@lodash';
import { memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { motion } from 'framer-motion';
import TodoListItem from 'app/main/apps/dashboard/TodoListItem';
import { todosList } from '../store/Todos';

function Widget5(props) {
	const todos = todosList;
	const theme = useTheme();
	const [awaitRender, setAwaitRender] = useState(true);
	const [tabValue, setTabValue] = useState(0);
	const widget = _.merge({}, props.widget);
	const currentRange = Object.keys(widget.ranges)[tabValue];
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [noOfPages] = useState(Math.ceil(todos.length / rowsPerPage));

	_.setWith(widget, 'mainChart.options.colors', [theme.palette.primary.main, theme.palette.secondary.main]);

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (!todos) {
		return null;
	}

	if (todos.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There are no records!
				</Typography>
			</motion.div>
		);
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	return (
		<Paper className="w-full rounded-20 shadow">
			<div className="flex items-center justify-between p-20">
				<FormControl className="ml-4">
					<Select value="title" displayEmpty name="filter" className="">
						<MenuItem value="title">
							<em>Trademarks</em>
						</MenuItem>
						{/* <MenuItem value="patents">Patents</MenuItem> */}
						<MenuItem value="copyrights">Copyrights</MenuItem>
						{/* <MenuItem value="design">Design</MenuItem>
						<MenuItem value="otherLegalServices">Other Legal Services</MenuItem> */}
					</Select>
				</FormControl>
				<div className="w-1/2 flex justify-end">
					<Button
						className="mx-8"
						variant="contained"
						color="primary"
						aria-label="AddNew"
						onClick={() => window.open('/services', '_self')}
					>
						Add New
					</Button>
				</div>
			</div>
			<div className="flex flex-row flex-wrap">
				<div className="w-full md:w-1/2 pb-16 pr-16 pl-16 min-h-420 h-420">
					<ReactApexChart
						options={widget.mainChart.options}
						series={widget.mainChart[currentRange].series}
						type={widget.mainChart.options.chart.type}
						height={widget.mainChart.options.chart.height}
					/>
				</div>
				<div className="flex w-full md:w-1/2 flex-wrap pb-16 pr-16 pl-4">
					<List className="w-full">
						<motion.div variants={container} initial="hidden" animate="show">
							{todos.slice((page - 1) * rowsPerPage, page * rowsPerPage).map(todo => (
								<motion.div variants={item} key={todo.id}>
									<TodoListItem todo={todo} key={todo.id} />
								</motion.div>
							))}
						</motion.div>
					</List>
					{/* <div className="flex flex-end mt-10 ml-auto">
						<Paper className="rounded-16 shadow">
							<IconButton>
								<Icon className="text-20">
									{theme.direction === 'ltr' ? 'chevron_left' : 'chevron_right'}
								</Icon>
							</IconButton>
							<Button className="min-w-48 h-48 p-0 px-16">1</Button>
							<Button className="min-w-48 h-48 p-0 px-16">2</Button>
							<Button className="min-w-48 h-48 p-0 px-16">3</Button>
							<Button className="min-w-48 h-48 p-0 px-16">4</Button>
							<Button className="min-w-48 h-48 p-0 px-16">5</Button>
							<IconButton>
								<Icon className="text-20">
									{theme.direction === 'ltr' ? 'chevron_right' : 'chevron_left'}
								</Icon>
							</IconButton>
						</Paper>
					</div> */}
					<div className="flex flex-end mt-auto ml-auto">
						{/* <Paper className="rounded-16 shadow"> */}
						<Pagination
							// classes="min-w-48 h-48 p-0 px-16"
							color="primary"
							variant="outlined"
							shape="rounded"
							count={noOfPages}
							page={page}
							defaultPage={1}
							onChange={handleChangePage}
						/>
						{/* </Paper> */}
					</div>
				</div>
			</div>
		</Paper>
	);
}

export default memo(Widget5);
