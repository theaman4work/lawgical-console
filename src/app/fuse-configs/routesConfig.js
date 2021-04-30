import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import Error404Config from 'app/main/errors/404/Error404Config';
import Error500Config from 'app/main/errors/500/Error500Config';
import ForgotPasswordConfig from 'app/main/forgot-password/ForgotPasswordConfig';
import helpersConfigs from 'app/main/helpers/HelpersConfigs';
import LockConfig from 'app/main/lock/LockConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import ProfileConfig from 'app/main/profile/ProfileConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';
import ResetPasswordConfig from 'app/main/reset-password/ResetPasswordConfig';
import { Redirect } from 'react-router-dom';

const routeConfigs = [
	...appsConfigs,
	...helpersConfigs,
	Error404Config,
	Error500Config,
	ForgotPasswordConfig,
	LockConfig,
	LoginConfig,
	LogoutConfig,
	ProfileConfig,
	RegisterConfig,
	ResetPasswordConfig
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin', 'staff', 'user']),
	{
		path: '/',
		exact: true,
		auth: null,
		component: () => <Redirect to="/dashboard" />
	},
	{
		component: () => <Redirect to="/errors/error-404" />
	}
];

export default routes;
