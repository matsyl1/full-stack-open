const Course = ({ courses }) => {
    return (
      <>
        <h1>Web development curriculum</h1>
        {courses.map(course => 
          <div key={course.id}>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        )}
      </>
    )
  }
  
  const Total = ({ parts }) => {  
    const total = parts.reduce((sum, i) => sum + i.exercises, 0)
    return (
      <p><strong>total of {total} exercises</strong></p>
    )
  }
  
  const Header = ({ course }) => <h2>{course}</h2>
  
  const Part = ({ name, exercises }) => 
    <p>
      {name} {exercises}
    </p>
  
  const Content = ({ parts }) => 
    <>
      {parts.map(part => 
        <Part key={part.id} name={part.name} exercises={part.exercises}/>
      )}
    </>

export default Course