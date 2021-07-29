import { combineReducers } from '@reduxjs/toolkit';
import services from './servicesSlice';
import productServices from './productServicesSlice';
import serviceSteps from './serviceStepsSlice';
import applicants from './applicantSlice';
import responseCustomerTrademarkDetailsAndAttachments from './responseCustomerTrademarkDetailsAndAttachmentsSlice';
import responseDocumentReviewAndAttachments from './responseDocumentReviewAndAttachmentsSlice';

const reducer = combineReducers({
	services,
	productServices,
	serviceSteps,
	applicants,
	responseCustomerTrademarkDetailsAndAttachments,
	responseDocumentReviewAndAttachments
});

export default reducer;
