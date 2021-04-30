import { lazy } from 'react';

const ComingSoonConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/auth/coming-soon',
			component: lazy(() => import('./ComingSoon'))
		}
	]
};

export default ComingSoonConfig;
