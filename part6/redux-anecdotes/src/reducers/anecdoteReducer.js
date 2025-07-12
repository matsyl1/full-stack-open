import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateVote(state, action) {
      const updated = action.payload
      return state.map(anecdote => 
        anecdote.id === updated.id ? updated : anecdote
      )
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdote(state, action) {
      return action.payload
    }
  }
})

export const { updateVote, createAnecdote, setAnecdote } = anecdoteSlice.actions

export const initializedAnecdotesThunk = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdote(anecdotes))
  }
}

export const addAnecdoteThunk = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const voteThunk = (anecdote) => {
  return async dispatch => {
    const updated = await anecdoteService.incrementVote(anecdote)
    dispatch(updateVote(updated))
  }
}

export default anecdoteSlice.reducer