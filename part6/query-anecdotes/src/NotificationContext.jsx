/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

const initialState = {
  visible: false, 
  message: ''
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'show-notification':
      return {visible: true, 
              message: action.payload}
    case 'hide-notification':
      return {visible: false,
              message: ''
      }
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, initialState)

  const triggerNotification = (message) => {
    notificationDispatch({type: 'show-notification', payload: message})
    setTimeout(() => {
      notificationDispatch({type: 'hide-notification'})
    }, 3000)
  }

  return (
    <NotificationContext.Provider value={{notification, triggerNotification}}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext