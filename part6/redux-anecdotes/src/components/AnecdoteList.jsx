import { useDispatch, useSelector } from "react-redux"
import { voteThunk } from "../reducers/anecdoteReducer"
import { triggerNotificationThunk } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const filterAnecdotes = filter === ''
      ? anecdotes
      : anecdotes.filter(a =>
          a.content.toLowerCase().includes(filter.toLowerCase())
      )


    const handleVote = (anecdote) => {
      dispatch(voteThunk(anecdote))
      dispatch(triggerNotificationThunk(`You voted for: ${anecdote.content}`, 1))
    }


  return (
    <>
      {[...filterAnecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </>
  )
}

export default AnecdoteList