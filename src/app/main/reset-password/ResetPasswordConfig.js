import { lazy } from 'react';

const ResetPasswordConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/auth/reset-password',
			component: lazy(() => import('./ResetPassword'))
		}
	]
};

export default ResetPasswordConfig;
