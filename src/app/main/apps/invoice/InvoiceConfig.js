import { lazy } from 'react';

const InvoiceConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/invoice',
			component: lazy(() => import('./Invoice'))
		}
	]
};

export default InvoiceConfig;
