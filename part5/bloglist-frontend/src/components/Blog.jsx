import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogsState, handleDelete, user }) => {
  const [showAll, setShowAll] = useState(false)
  const blogCreator = blog.user.username === user.username

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5

  }

  const handleLike = async () => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      const returnedBlog = await blogService.addLike(blog.id, updatedBlog)
      const completeBlog = {
        ...returnedBlog,
        user: typeof returnedBlog.user === 'string' ? blog.user : returnedBlog.user
      }
      updateBlogsState(completeBlog)
      console.log('Like added successfully', returnedBlog)
    } catch (error) {
      console.error('Error adding like:', error)
    }
  }

  return(
    <div style={blogStyle}>
      <div data-testid="default-view">
        {showAll === false &&
          <>
            {blog.title} / {blog.author}
            <button data-testid='view-button' onClick={() => setShowAll(true)}>view</button>
          </>
        }
      </div>
      <div data-testid="expand-view">
        {showAll === true &&
          <>
            <div>Title: {blog.title}</div>
            <div>Author: {blog.author}</div>
            <div>URL: {blog.url}</div>
            <div>Likes: {blog.likes} <button data-testid='like-button' onClick={() => handleLike()}>like</button></div>
            <button onClick={() => setShowAll(false)}>hide</button>
            {blogCreator && <button data-testid='delete-button' onClick={() => handleDelete(blog.id)}>delete</button>}
          </>
        }
      </div>
    </div>
  )}

export default Blog