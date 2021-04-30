import { lazy } from 'react';

const FaqConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/faq',
			component: lazy(() => import('./Faq'))
		}
	]
};

export default FaqConfig;
