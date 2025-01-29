const Notification = ({ message }) => {
    if (!message || message.msg === null) {
      return null
    }

    return (
      <div className={message.type === "success" ? "success" : "error"}>
        {message.msg}
      </div>
    )
  }

  export default Notification