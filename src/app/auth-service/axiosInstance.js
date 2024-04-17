import axios from 'axios';

// eslint-disable-next-line
export const axiosInstance = axios.create({
	baseURL: 'http://api.lawgical.io/'
});
