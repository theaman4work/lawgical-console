import { lazy } from 'react';

const ForgotPasswordConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/forgot-password',
			component: lazy(() => import('./ForgotPassword'))
		}
	]
};

export default ForgotPasswordConfig;
