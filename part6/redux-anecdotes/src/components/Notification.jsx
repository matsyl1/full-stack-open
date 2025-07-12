import { useSelector } from "react-redux"

const Notification = () => {
  const { visible, text } = useSelector((state) => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (!visible) return null

  return (
    <div style={style}>
      {text}
    </div>
  )
}

export default Notification