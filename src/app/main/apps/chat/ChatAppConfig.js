import { lazy } from 'react';

const ChatAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/chat',
			component: lazy(() => import('./ChatApp'))
		}
	]
};

export default ChatAppConfig;
