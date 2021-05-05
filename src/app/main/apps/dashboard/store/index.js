import { combineReducers } from '@reduxjs/toolkit';
import projects from './projectsSlice';
import widgets from './widgetsSlice';
import products from './productsSlice';

const reducer = combineReducers({
	widgets,
	projects,
	products
});

export default reducer;
