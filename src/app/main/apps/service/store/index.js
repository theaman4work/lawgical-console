import { combineReducers } from '@reduxjs/toolkit';
import course from './courseSlice';
import courses from './coursesSlice';
import services from './servicesSlice';
import productServices from './productServicesSlice';

const reducer = combineReducers({
	services,
	productServices,
	courses,
	course
});

export default reducer;
