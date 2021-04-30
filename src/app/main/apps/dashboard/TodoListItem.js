import _ from '@lodash';
import { amber, red } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { labelsList } from './store/Labels';

import TodoChip from './TodoChip';

const useStyles = makeStyles({
	todoItem: {
		'&.completed': {
			background: 'rgba(0,0,0,0.03)',
			'& .todo-title, & .todo-notes': {
				textDecoration: 'line-through'
			}
		}
	}
});

const labels = labelsList;

function getTitle(label) {
	for (let i = 0; i < labels.length; i += 1) {
		const obj = labels[i];
		if (obj.id === label) {
			return obj.title;
		}
	}
	return 'Mobile';
}

function getColor(label) {
	for (let i = 0; i < labels.length; i += 1) {
		const obj = labels[i];
		if (obj.id === label) {
			return obj.color;
		}
	}
	return '#9C27B0';
}

function TodoListItem(props) {
	const classes = useStyles(props);

	return (
		<ListItem
			className="pt-10 px-0 sm:px-0"
			// onClick={ev => {
			// 	ev.preventDefault();
			// 	dispatch(openEditTodoDialog(props.todo));
			// }}
			dense
			button
		>
			<div className="flex flex-1 flex-col relative overflow-hidden px-0" key={props.todo.id}>
				<Typography className="todo-title truncate text-xs font-medium" color="inherit">
					{props.todo.title}
				</Typography>

				<Typography color="textSecondary" className="todo-notes truncate text-xs">
					{_.truncate(props.todo.notes.replace(/<(?:.|\n)*?>/gm, ''), { length: 180 })}
				</Typography>

				<div className={clsx(classes.labels, 'flex -mx-2 mt-1')}>
					{props.todo.labels.map(label => (
						<TodoChip className="mx-2 mt-4" title={getTitle(label)} color={getColor(label)} key={label} />
					))}
				</div>
			</div>

			<div className="px-8">
				<IconButton
				// onClick={ev => {
				// 	ev.preventDefault();
				// 	ev.stopPropagation();
				// 	dispatch(
				// 		updateTodo({
				// 			...props.todo,
				// 			important: !props.todo.important
				// 		})
				// 	);
				// }}
				>
					{props.todo.important ? <Icon style={{ color: red[500] }}>error</Icon> : <Icon>error_outline</Icon>}
				</IconButton>
				<IconButton
				// onClick={ev => {
				// 	ev.preventDefault();
				// 	ev.stopPropagation();
				// 	dispatch(
				// 		updateTodo({
				// 			...props.todo,
				// 			starred: !props.todo.starred
				// 		})
				// 	);
				// }}
				>
					{props.todo.starred ? <Icon style={{ color: amber[500] }}>star</Icon> : <Icon>star_outline</Icon>}
				</IconButton>
			</div>
		</ListItem>
	);
}

export default TodoListItem;
