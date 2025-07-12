import { useDispatch } from "react-redux"
import { triggerNotificationThunk } from "../reducers/notificationReducer"
import { addAnecdoteThunk } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdoteThunk(content))
    dispatch(triggerNotificationThunk(`You created a new anecdote: ${content}`, 5))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm