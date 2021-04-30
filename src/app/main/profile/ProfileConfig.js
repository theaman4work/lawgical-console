import { lazy } from 'react';

const ProfileConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/profile',
			component: lazy(() => import('./Profile'))
		}
	]
};

export default ProfileConfig;
