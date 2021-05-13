import { combineReducers } from '@reduxjs/toolkit';
import course from './courseSlice';
import courses from './coursesSlice';
import services from './servicesSlice';
import productServices from './productServicesSlice';
import serviceSteps from './serviceStepsSlice';

const reducer = combineReducers({
	services,
	productServices,
	courses,
	course,
	serviceSteps
});

export default reducer;
