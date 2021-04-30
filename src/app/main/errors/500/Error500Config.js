import { lazy } from 'react';

const Error500Config = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/errors/error-500',
			component: lazy(() => import('./Error500'))
		}
	]
};

export default Error500Config;
