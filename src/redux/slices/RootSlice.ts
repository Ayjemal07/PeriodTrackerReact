import { createSlice } from '@reduxjs/toolkit'

const rootSlice = createSlice({
    name: "root",
    initialState: {
        last_period_date: "last_period_date",
        period_duration: "period_duration",
    },
    reducers: {
        chooselast_period_date: (state, action) => { state.last_period_date = action.payload},
        chooseperiod_duration: (state, action) => { state.period_duration= action.payload},
    }
})

export const reducer = rootSlice.reducer;
export const { chooselast_period_date, chooseperiod_duration} = rootSlice.actions