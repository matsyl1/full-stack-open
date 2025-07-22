import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog, fetchBlogs } from '../reducers/blogSlice'
import { useState } from 'react'
import blogService from '../services/blogs'

const SingleBlog = ({ blogs, user, handleDelete }) => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()
  const blog = blogs.find(b => b.id === id)
  const [comment, setComment] = useState('')

  if (!blog) return <p>Loading...</p>

  const blogCreator = blog.user.username === user.username

  const handleLike = () => {
    dispatch(likeBlog(blog))
  }

  const handleDeleteClick = () => {
    handleDelete(blog.id)
    navigate('/')
  }

  const handleComment = async (e) => {
    e.preventDefault()
    const updatedBlog = await blogService.addComment(blog.id, comment)
    dispatch(fetchBlogs())
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>Added by: {blog.user.username}</div>
      <div>Author: {blog.author}</div>
      <div>URL: {blog.url}</div>
      <div>
        Likes: {blog.likes}{' '}
        <button onClick={handleLike}>like</button>
      </div>
      {blogCreator && (
        <button onClick={handleDeleteClick}>delete</button>
      )}
      <h4>Comments</h4>
      <form onSubmit={handleComment}>
        <input value={comment} onChange={(e) => setComment(e.target.value)}/>
        <button type='submit'>add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, id) => (
          <li key={id}>{comment}</li>
        ))}
      </ul>

    </div>
  )
}

export default SingleBlog