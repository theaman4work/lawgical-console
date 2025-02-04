import _ from '@lodash';

export const todosList = [
	{
		id: '561551bd7fe2ff461101c192',
		title: 'Proident tempor est nulla irure ad est',
		notes:
			'Id nulla nulla proident deserunt deserunt proident in quis. Cillum reprehenderit labore id anim laborum.',
		startDate: new Date(2018, 8, 3),
		dueDate: new Date(2018, 8, 5),
		completed: false,
		starred: false,
		important: false,
		deleted: false,
		labels: [1]
	},
	{
		id: '561551bd4ac1e7eb77a3a750',
		title: 'Magna quis irure quis ea pariatur laborum',
		notes: '',
		startDate: new Date(2018, 4, 3),
		dueDate: new Date(2018, 4, 5),
		completed: false,
		starred: false,
		important: true,
		deleted: false,
		labels: [1, 4]
	},
	{
		id: '561551bd917bfec2ddef2d49',
		title: 'Ullamco duis commodo sint ad aliqua aute',
		notes: 'Sunt laborum enim nostrud ea fugiat cillum mollit aliqua exercitation ad elit.',
		startDate: new Date(2018, 5, 3),
		dueDate: new Date(2018, 5, 5),
		completed: false,
		starred: true,
		important: true,
		deleted: false,
		labels: [3]
	},
	{
		id: '561551bdeeb2fd6877e18c29',
		title: 'Eiusmod non occaecat pariatur Lorem in ex',
		notes:
			'Nostrud anim mollit incididunt qui qui sit commodo duis. Anim amet irure aliquip duis nostrud sit quis fugiat ullamco non dolor labore. Lorem sunt voluptate laboris culpa proident. Aute eiusmod aliqua exercitation irure exercitation qui laboris mollit occaecat eu occaecat fugiat.',
		startDate: new Date(2018, 9, 3),
		dueDate: new Date(2018, 9, 5),
		completed: true,
		starred: true,
		important: false,
		deleted: false,
		labels: [2]
	},
	{
		id: '561551bdf38eae0134ae43d4',
		title: 'Lorem magna cillum consequat consequat mollit',
		notes:
			'Velit ipsum proident ea incididunt et. Consectetur eiusmod laborum voluptate duis occaecat ullamco sint enim proident.',
		startDate: new Date(2018, 6, 3),
		dueDate: new Date(2018, 6, 4),
		completed: false,
		starred: false,
		important: false,
		deleted: false,
		labels: [5, 4]
	},
	{
		id: '561551bd32f1588c814a0ccd',
		title: 'Quis irure cupidatat ad consequat reprehenderit excepteur',
		notes:
			'Esse nisi mollit aliquip mollit aute consequat adipisicing. Do excepteur dolore proident cupidatat pariatur irure consequat incididunt.',
		startDate: new Date(2018, 5, 3),
		dueDate: new Date(2018, 6, 5),
		completed: false,
		starred: true,
		important: false,
		deleted: false,
		labels: [2, 3]
	},
	{
		id: '561551bd0bb4b08ca77038ef',
		title: 'Officia voluptate tempor ut mollit ea cillum',
		notes: 'Deserunt veniam reprehenderit do elit magna ut.',
		startDate: new Date(2018, 2, 3),
		dueDate: new Date(2018, 3, 5),
		completed: true,
		starred: false,
		important: false,
		deleted: false,
		labels: [2, 4]
	},
	{
		id: '561551bdf84eec913835ebe5',
		title: 'Sit exercitation cupidatat minim est ipsum excepteur',
		notes: '',
		startDate: new Date(2018, 4, 3),
		dueDate: new Date(2018, 6, 2),
		completed: true,
		starred: false,
		important: true,
		deleted: false,
		labels: [1, 3]
	},
	{
		id: '561551bd2047cc709af0f670',
		title: 'Sunt fugiat officia nisi minim sunt duis',
		notes:
			'Eiusmod eiusmod sint aliquip exercitation cillum. Magna nulla officia ex consectetur ea ad excepteur in qui.',
		startDate: new Date(2018, 1, 3),
		dueDate: new Date(2018, 2, 5),
		completed: false,
		starred: false,
		important: false,
		deleted: false,
		labels: [5]
	},
	{
		id: '561551bd73d1a627e97005ce',
		title: 'Non cupidatat enim quis aliquip minim laborum',
		notes:
			'Qui cillum eiusmod nostrud sunt dolore velit nostrud labore voluptate ad dolore. Eu Lorem anim pariatur aliqua. Ullamco ut dolor velit esse occaecat dolore eu cillum commodo qui. Nulla dolor consequat voluptate magna ut commodo magna consectetur non aute proident.',
		startDate: new Date(2018, 10, 11),
		dueDate: new Date(2018, 10, 12),
		completed: false,
		starred: false,
		important: false,
		deleted: false,
		labels: [2]
	},
	{
		id: '561551bd8f7d793ded0a2353',
		title: 'Dolor ex occaecat magna labore laboris qui',
		notes:
			'Incididunt qui excepteur eiusmod elit cillum occaecat voluptate cillum nostrud. Dolor ullamco ullamco eiusmod do sunt adipisicing pariatur. In esse esse labore id reprehenderit sint do. Pariatur culpa dolor tempor qui excepteur duis do anim minim ipsum.',
		startDate: new Date(2018, 12, 13),
		dueDate: new Date(2018, 12, 15),
		completed: false,
		starred: false,
		important: true,
		deleted: false,
		labels: [3]
	},
	{
		id: '561551bdaa586f72d0be02cc',
		title: 'Ex nisi amet id dolore nostrud esse',
		notes: '',
		startDate: new Date(2018, 2, 3),
		dueDate: new Date(2018, 12, 4),
		completed: false,
		starred: true,
		important: true,
		deleted: false,
		labels: [4]
	},
	{
		id: '561551bd9f1c2de5b27f537b',
		title: 'In dolor velit labore dolore ex eiusmod',
		notes: '',
		startDate: new Date(2018, 3, 3),
		dueDate: new Date(2018, 4, 5),
		completed: false,
		starred: false,
		important: false,
		deleted: false,
		labels: [4]
	},
	{
		id: '561551bd26e21bb5e85b35cb',
		title: 'Sunt voluptate aliquip exercitation minim magna sit',
		notes: '',
		startDate: new Date(2018, 4, 3),
		dueDate: new Date(2018, 5, 5),
		completed: false,
		starred: false,
		important: false,
		deleted: false,
		labels: [4]
	},
	{
		id: '561551bd719860cf0ad2011a',
		title: 'Nisi et ullamco minim ea proident tempor',
		notes: 'Dolor veniam dolor cillum Lorem magna nisi in occaecat nulla dolor ea eiusmod.',
		startDate: new Date(2018, 6, 3),
		dueDate: new Date(2018, 7, 5),
		completed: false,
		starred: true,
		important: false,
		deleted: false,
		labels: [2, 4]
	},
	{
		id: '561551bd49d800c243264a91',
		title: 'Sit ipsum mollit cupidatat adipisicing officia aliquip',
		notes: '',
		startDate: new Date(2018, 8, 3),
		dueDate: new Date(2018, 9, 5),
		completed: true,
		starred: false,
		important: false,
		deleted: false,
		labels: [1]
	},
	{
		id: '561551bd061990eaf40fb64f',
		title: 'Amet sunt et quis amet commodo quis',
		notes: 'Nulla dolore consequat aliqua sint consequat elit qui occaecat et.',
		startDate: new Date(2018, 1, 3),
		dueDate: new Date(2018, 2, 5),
		completed: false,
		starred: false,
		important: true,
		deleted: false,
		labels: [1]
	},
	{
		id: '561551be81d05fa94711e7f3',
		title: 'Ut eiusmod ex ea eiusmod culpa incididunt',
		notes:
			'Fugiat non incididunt officia ex incididunt occaecat. Voluptate nostrud culpa aliquip mollit incididunt non dolore.',
		startDate: new Date(2018, 3, 3),
		dueDate: new Date(2018, 4, 5),
		completed: false,
		starred: false,
		important: false,
		deleted: false,
		labels: [2]
	},
	{
		id: '561551be05c093a80e0c8d05',
		title: 'Proident reprehenderit laboris pariatur ut et nisi',
		notes: 'Reprehenderit proident ut ad cillum quis velit quis aliqua ut aliquip tempor ullamco.',
		startDate: new Date(2018, 5, 3),
		dueDate: new Date(2018, 6, 5),
		completed: true,
		starred: true,
		important: true,
		deleted: false,
		labels: [5]
	},
	{
		id: '561551be3bb43a5bd431c2fc',
		title: 'Aliqua aliquip aliquip aliquip et exercitation aute',
		notes:
			'Adipisicing Lorem tempor ex anim. Labore tempor laboris nostrud dolore voluptate ullamco. Fugiat ex deserunt anim minim esse velit laboris aute ea duis incididunt. Elit irure id Lorem incididunt laborum aliquip consectetur est irure sunt. Ut labore anim nisi aliqua tempor laborum nulla cillum. Duis irure consequat cillum magna cillum eiusmod ut. Et exercitation voluptate quis deserunt elit quis dolor deserunt ex ex esse ex.',
		startDate: new Date(2018, 7, 3),
		dueDate: new Date(2018, 8, 5),
		completed: true,
		starred: false,
		important: true,
		deleted: true,
		labels: [3]
	}
];

function getCategoryById(props) {
	return _.find(todosList, { id: props.id });
}

export default getCategoryById;
