import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'dashboard',
		title: 'Dashboard',
		translate: 'DASHBOARD',
		type: 'item',
		icon: 'dashboard',
		url: '/dashboard'
	},
	{
		id: 'services',
		title: 'Services',
		translate: 'SERVICES',
		type: 'collapse',
		icon: 'gavel',
		// url: '/apps/services/courses',
		children: [
			{
				id: 'service-trademark',
				title: 'Trademark',
				type: 'item',
				// icon: 'person',
				url: '/services/trademarks',
				exact: true
			},
			{
				id: 'service-patent',
				title: 'Patent',
				type: 'item',
				// icon: 'person',
				url: '/services/patents',
				exact: true
			},
			{
				id: 'service-copyrights',
				title: 'Copyrights',
				type: 'item',
				// icon: 'person',
				url: '/services/copyrights',
				exact: true
			},
			{
				id: 'service-anylegalservice',
				title: 'Any Legal Service',
				type: 'item',
				// icon: 'person',
				url: '/services/legalservices',
				exact: true
			}
		]
	},
	{
		id: 'profile',
		title: 'Profile',
		type: 'item',
		icon: 'account_circle',
		url: '/pages/profile'
	},
	{
		id: 'invoice-list',
		title: 'Invoice List',
		translate: 'INVOICE',
		type: 'item',
		icon: 'receipt',
		url: '/pages/invoices/compact'
		// badge: {
		// 	title: 25,
		// 	bg: '#F44336',
		// 	fg: '#FFFFFF'
		// }
	},
	{
		id: 'faq',
		title: 'Faq',
		type: 'item',
		icon: 'help_outline',
		url: '/pages/faq'
		// badge: {
		// 	title: 3,
		// 	bg: 'rgb(255, 111, 0)',
		// 	fg: '#FFFFFF'
		// }
	}
];

export default navigationConfig;
