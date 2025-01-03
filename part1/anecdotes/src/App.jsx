import { useState } from 'react'

const DisplayRandom = ({ text, anecdote, count }) => {
  return (
    <>
      <h1>{text}</h1>
      <div>{anecdote}</div>
      <div>has {count} votes</div>
    </>
  )
}

const DisplayMostVoted = ({ vote, text, anecdote, count }) => {
  if (Math.max(...vote) === 0) {
    return null
  }
  
  return (
    <>
      <h1>{text}</h1>
      <div>{anecdote}</div>
      <div>has {count} votes</div>
    </>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0))
  
  const randomIndex = () => Math.floor(Math.random() * anecdotes.length)
  const handleNext = () => setSelected(randomIndex())
  const handleVote = () => {
    const copy = [...vote]
    copy[selected] += 1
    setVote(copy)
  }

  const mostVoted = vote.indexOf(Math.max(...vote))

  return (
    <>
      <DisplayRandom text="Anecdote of the day" anecdote={anecdotes[selected]} count={vote[selected]}/>
      <Button handleClick={handleVote} text="vote"/>
      <Button handleClick={handleNext} text="next anecdote"/>
      <DisplayMostVoted vote={vote} text="Anecdote with most votes" anecdote={anecdotes[mostVoted]} count={vote[mostVoted]}/>
    </>
  )
}

export default App