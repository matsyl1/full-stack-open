import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './reducers/filterReducer'
import reducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore ({
    reducer: {
        anecdotes: reducer, 
        filter: filterReducer,
        notification: notificationReducer
    }
})

export default store