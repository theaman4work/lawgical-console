import { lazy } from 'react';

const ApplicantsConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/applicants',
			component: lazy(() => import('./Applicants'))
		}
	]
};

export default ApplicantsConfig;
