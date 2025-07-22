import { useParams } from 'react-router-dom'

const User = ({ blogs }) => {

  const { id } = useParams()

  if (!blogs || blogs.length === 0) {
    return null
  }

  const userBlogs = blogs.filter(blog => blog.user.id === id)

  const name = userBlogs[0].user.name

  return (
    <div>
      <h2>{name}</h2>
      <div>added blogs:</div>
      <ul>
        {userBlogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User