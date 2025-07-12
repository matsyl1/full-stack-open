import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: '',
  visible: false
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState, 
  reducers: {
    showNotification(state, action) {
      state.text = action.payload,
      state.visible = true
    },
    hideNotification(state) {
      state.text = '',
      state.visible = false
    }
  }
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const triggerNotificationThunk = (text, delay) => (dispatch) => {
  dispatch(showNotification(text))
  setTimeout(() => {
    dispatch(hideNotification())
  }, delay*1000)
}

export default notificationSlice.reducer