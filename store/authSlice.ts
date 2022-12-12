import { createSlice } from '@reduxjs/toolkit';
import { AppState } from "./store";
import { HYDRATE } from 'next-redux-wrapper';

export interface AuthState {
    isAuthed: boolean
}

const initialAuthState: AuthState = {
    isAuthed: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        // Action to set the authentication status
        setAuthState(state, action) {
            state.isAuthed = action.payload;
        },

        // Special reducer for hydrating the state. Special case for next-redux-wrapper
        // @ts-ignore
        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state: any, action: { payload: { auth: any; }; }) => {
                return {
                    ...state,
                    ...action.payload.auth,
                };
            },
        },
    }
    
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth.isAuthed;

export default authSlice.reducer;