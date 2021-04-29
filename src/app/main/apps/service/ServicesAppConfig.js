import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const ServicesAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/services',
			component: lazy(() => import('./Services'))
		},
		{
			path: '/services/trademarks',
			component: lazy(() => import('./Services'))
		},
		{
			path: '/services/patents',
			component: lazy(() => import('./Services'))
		},
		{
			path: '/services/copyrights',
			component: lazy(() => import('./Services'))
		},
		{
			path: '/services/legalservices',
			component: lazy(() => import('./Services'))
		},
		{
			path: '/apps/service/courses/:courseId/:courseHandle?',
			component: lazy(() => import('./course/Course'))
		}
	]
};

export default ServicesAppConfig;
