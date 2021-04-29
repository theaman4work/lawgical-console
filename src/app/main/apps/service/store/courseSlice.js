import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getCourse = createAsyncThunk('servicesApp/course/getCourse', async params => {
	const response = await axios.get('/api/academy-app/course', { params });
	const data = await response.data;
	return data;
});

export const updateCourse = createAsyncThunk(
	'servicesApp/course/updateCourse',
	async (_data, { getState, dispatch }) => {
		const { id } = getState().servicesApp.course;

		const response = await axios.post('/api/academy-app/course/update', { id, ..._data });
		const data = await response.data;

		dispatch(showMessage({ message: 'Course Saved' }));

		return data;
	}
);

const courseSlice = createSlice({
	name: 'servicesApp/course',
	initialState: null,
	reducers: {},
	extraReducers: {
		[getCourse.fulfilled]: (state, action) => action.payload,
		[updateCourse.fulfilled]: (state, action) => ({
			...state,
			...action.payload
		})
	}
});

export default courseSlice.reducer;
