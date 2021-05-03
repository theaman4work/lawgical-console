import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { axiosInstance } from './axiosInstance';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axiosInstance.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null, null);
						// console.warn('onAutoLogout');
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();
		const email = this.getLgLoggedInEmail();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token, email);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null, null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			const managedUserVM = {
				email: data.email,
				password: data.password,
				login: data.email,
				firstName: data.name
			};

			const reqData = {
				managedUserVM,
				roleType: 1
			};

			axiosInstance
				.post('/api/users/complete-registration', reqData)
				.then(response => {
					if (response.status === 200) {
						// console.log('authenticate (success)');
						const userData = {
							uuid: response.data.endUserDTO.id,
							from: 'lawgical',
							role: 'admin',
							data: {
								displayName: response.data.endUserDTO.name,
								photoURL: 'assets/images/avatars/profile.jpg',
								email: response.data.endUserDTO.email,
								settings: {
									layout: {
										style: 'layout1',
										config: {}
									},
									customScrollbars: true,
									theme: {}
								},
								shortcuts: []
							}
						};
						this.setSession(response.data.id_token, response.data.endUserDTO.email);
						resolve(userData);
					}
					// else {}
				})
				.catch(function errror(error) {
					if (error.response) {
						// console.warn('registration failed');
						// console.log(error.response.data);
						// console.log(error.response.status);
						// console.log(error.response.headers);
						const errorArr = [];
						errorArr.push({
							type: 'custom',
							message: error.response.data.errorMessage
						});
						reject(errorArr);
					}
				});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			const reqAuthData = {
				username: email,
				password,
				rememberMe: 'true'
			};
			axiosInstance
				.post('/api/users/authentication', reqAuthData)
				.then(response => {
					if (response.data.id_token) {
						// console.log('authentication (success)');
						const userData = {
							uuid: response.data.gwId,
							from: 'lawgical',
							role: 'admin',
							data: {
								displayName: response.data.endUserDTO.name,
								photoURL: 'assets/images/avatars/profile.jpg',
								email,
								settings: {
									layout: {
										style: 'layout1',
										config: {}
									},
									customScrollbars: true,
									theme: {}
								},
								shortcuts: []
							}
						};
						this.setSession(response.data.id_token, email);
						resolve(userData);
					} else {
						const errorArr = [];
						errorArr.push({
							type: 'custom',
							message: 'Authentication failed, please try again!'
						});
						reject(errorArr);
					}
				})
				.catch(function errror(error) {
					if (error.response) {
						// console.warn('authentication failed');
						// console.log(error.response.data);
						// console.log(error.response.status);
						// console.log(error.response.headers);
						const errorArr = [];
						errorArr.push({
							type: 'custom',
							message: error.response.data.errorMessage
						});
						reject(errorArr);
					}
				});
		});
	};

	signInWithToken = email => {
		return new Promise((resolve, reject) => {
			axiosInstance
				.get(`/api/users/get-data-using-token/${this.getLgLoggedInEmail()}`, {
					// params: {
					// 	email: this.getLgLoggedInEmail()
					// }
				})
				.then(response => {
					if (response.status === 200) {
						const userData = {
							uuid: response.data.gwId,
							from: 'lawgical',
							role: 'admin',
							data: {
								displayName: response.data.gwUserName,
								photoURL: 'assets/images/avatars/profile.jpg',
								email,
								settings: {
									layout: {
										style: 'layout1',
										config: {}
									},
									customScrollbars: true,
									theme: {}
								},
								shortcuts: []
							}
						};
						this.setSession(response.data.id_token, email);
						resolve(userData);
					} else {
						this.logout();
						reject(new Error('Failed to login (1301)'));
					}
				})
				.catch(error => {
					this.logout();
					console.warn(error);
					reject(new Error('Failed to login (1302)'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = (access_token, email) => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			localStorage.setItem('lg_logged_in_email', email);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
			axiosInstance.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			localStorage.removeItem('lg_logged_in_email');
			delete axios.defaults.headers.common.Authorization;
			delete axiosInstance.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};

	getLgLoggedInEmail = () => {
		return window.localStorage.getItem('lg_logged_in_email');
	};
}

const instance = new JwtService();

export default instance;
