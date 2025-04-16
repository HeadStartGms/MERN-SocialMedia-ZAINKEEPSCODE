import * as AuthApi from "../api/AuthRequests";
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const logIn = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("../home", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL" });
  }
};
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ userData, navigate }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/register', userData);
      navigate('/home');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: 'REGISTER_REQUEST' });
    
    const response = await axios.post(
      'http://localhost:5000/auth/register',
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: response.data
    });

  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                       'Registration failed. Please try again.';
    
    dispatch({
      type: 'REGISTER_FAIL',
      payload: errorMessage
    });
  }
};

export const logout = ()=> async(dispatch)=> {
  dispatch({type: "LOG_OUT"})
}
