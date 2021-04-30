import { lazy } from 'react';

const LockConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/lock',
			component: lazy(() => import('./Lock'))
		}
	]
};

export default LockConfig;
