import { lazy } from 'react';

const Error404Config = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/errors/error-404',
			component: lazy(() => import('./Error404'))
		}
	]
};

export default Error404Config;
