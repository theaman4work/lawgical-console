import { lazy } from 'react';

const PricingConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/pricing',
			component: lazy(() => import('./Pricing'))
		}
	]
};

export default PricingConfig;
