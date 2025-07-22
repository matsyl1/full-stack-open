import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)

  if (!message) return null

  return (
    <div className="error" style={{ color: 'orange' }}>
      {message}
    </div>
  )
}

export default Notification