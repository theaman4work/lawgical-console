import { combineReducers } from '@reduxjs/toolkit';
import projects from './projectsSlice';
import widgets from './widgetsSlice';
import products from './productsSlice';
import customerDashboardStats from './customerDashboardStatsSlice';

const reducer = combineReducers({
	widgets,
	projects,
	products,
	customerDashboardStats
});

export default reducer;
