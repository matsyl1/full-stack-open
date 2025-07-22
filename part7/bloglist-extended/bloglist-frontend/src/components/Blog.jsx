import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    marginBottom: 5,
    backgroundColor: 'rgba(239, 239, 244, 0.83)'
  }

  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title}
      </Link>{' '}
      by {blog.author}
    </div>
  )
}

export default Blog