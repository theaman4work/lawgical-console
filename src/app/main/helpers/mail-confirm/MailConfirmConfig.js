import { lazy } from 'react';

const MailConfirmConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/auth/mail-confirm',
			component: lazy(() => import('./MailConfirm'))
		}
	]
};

export default MailConfirmConfig;
