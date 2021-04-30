import _ from '@lodash';

export const labelsList = [
	{
		id: 1,
		handle: 'frontend',
		title: 'Frontend',
		color: '#388E3C'
	},
	{
		id: 2,
		handle: 'backend',
		title: 'Backend',
		color: '#F44336'
	},
	{
		id: 3,
		handle: 'api',
		title: 'API',
		color: '#FF9800'
	},
	{
		id: 4,
		handle: 'issue',
		title: 'Issue',
		color: '#0091EA'
	},
	{
		id: 5,
		handle: 'mobile',
		title: 'Mobile',
		color: '#9C27B0'
	}
];

function getCategoryById(props) {
	return _.find(labelsList, { id: props.id });
}

export default getCategoryById;
