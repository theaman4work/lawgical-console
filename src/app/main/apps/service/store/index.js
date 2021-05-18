import { combineReducers } from '@reduxjs/toolkit';
import services from './servicesSlice';
import productServices from './productServicesSlice';
import serviceSteps from './serviceStepsSlice';

const reducer = combineReducers({
	services,
	productServices,
	serviceSteps
});

export default reducer;
