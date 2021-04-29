import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const getCourses = createAsyncThunk('servicesApp/categories/getCourses', async () => {
	const response = await axios.get('/api/academy-app/courses');
	const data = await response.data;

	return data;
});

const coursesAdapter = createEntityAdapter({});

export const { selectAll: selectCourses, selectById: selectCourseById } = coursesAdapter.getSelectors(
	state => state.servicesApp.courses
);

const coursesSlice = createSlice({
	name: 'servicesApp/courses',
	initialState: coursesAdapter.getInitialState({}),
	reducers: {},
	extraReducers: {
		[getCourses.fulfilled]: coursesAdapter.setAll
	}
});

export default coursesSlice.reducer;
