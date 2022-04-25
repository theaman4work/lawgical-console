import { combineReducers } from '@reduxjs/toolkit';
import services from './servicesSlice';
import productServices from './productServicesSlice';
import serviceTransactions from './lserviceTransactionsSlice';
import serviceSteps from './serviceStepsSlice';
import applicants from './applicantSlice';
import responseCustomerTrademarkDetailsAndAttachments from './responseCustomerTrademarkDetailsAndAttachmentsSlice';
import responseDocumentReviewAndAttachments from './responseDocumentReviewAndAttachmentsSlice';
import responseCustomerCopyrightDetailsAndAttachments from './responseCustomerCopyrightDetailsAndAttachmentsSlice';

const reducer = combineReducers({
	services,
	productServices,
	serviceTransactions,
	serviceSteps,
	applicants,
	responseCustomerTrademarkDetailsAndAttachments,
	responseDocumentReviewAndAttachments,
	responseCustomerCopyrightDetailsAndAttachments
});

export default reducer;
