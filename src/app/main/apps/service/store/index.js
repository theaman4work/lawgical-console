import { combineReducers } from '@reduxjs/toolkit';
import services from './servicesSlice';
import productServices from './productServicesSlice';
import serviceSteps from './serviceStepsSlice';
import applicants from './applicantSlice';
import customerTrademarkDetails from './customerTrademarkDetailsSlice';

const reducer = combineReducers({
	services,
	productServices,
	serviceSteps,
	applicants,
	customerTrademarkDetails
});

export default reducer;
