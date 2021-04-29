import _ from '@lodash';
import { amber, blue, blueGrey, green } from '@material-ui/core/colors';

export const categories = [
	{
		id: 0,
		value: 'web',
		label: 'Web',
		color: blue[500]
	},
	{
		id: 1,
		value: 'firebase',
		label: 'Firebase',
		color: amber[500]
	},
	{
		id: 2,
		value: 'cloud',
		label: 'Cloud',
		color: blueGrey[500]
	},
	{
		id: 3,
		value: 'android',
		label: 'Android',
		color: green[500]
	}
];

function getCategoryByValue(props) {
	return _.find(categories, { value: props.value });
}

export default getCategoryByValue;
