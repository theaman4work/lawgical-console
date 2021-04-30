import { lazy } from 'react';

const MaintenanceConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/auth/maintenance',
			component: lazy(() => import('./Maintenance'))
		}
	]
};

export default MaintenanceConfig;
