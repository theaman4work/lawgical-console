import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const ServicesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/services/:tab?',
			component: lazy(() => import('./Services'))
		},
		{
			path: '/apps/services/steps/:tab?/:lserviceId?/:lserviceTransactionId?',
			component: lazy(() => import('./service-steps/ServiceStep'))
		}
	]
};

export default ServicesAppConfig;
