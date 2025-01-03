import { useState } from 'react'

const Button = ({ state, setState, text }) => {
  const handleClick = () => setState(state + 1)

  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
  ) 
}

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = (((good * 1) + (neutral * 0) + (bad * -1)) / total).toFixed(1)
  const positive = ((good / total) * 100).toFixed(1)

  if (total === 0) {
    return (
      <div>No feedback given</div>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total}/>
        <StatisticLine text="average" value={average}/>
        <StatisticLine text="positive" value={positive + " %"}/> 
      </tbody>
    </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>give feedback</h1>
        <Button state={good} setState={setGood} text="good"/>
        <Button state={neutral} setState={setNeutral} text="neutral"/>
        <Button state={bad} setState={setBad} text="bad"/>
      <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App