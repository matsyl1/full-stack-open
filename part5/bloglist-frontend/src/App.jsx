import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import Create from './components/Create'
import Togglable from './components/Toggable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()



  const updateBlogsState = (updatedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === updatedBlog.id ? updatedBlog : blog
    ))
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleDelete = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Delete blog: ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(id, user.token)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setMessage('Blog deleted')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } catch (error) {
        setMessage('Failed to delete blog')
        setTimeout(() => {
          setMessage(null)
        }, 5000)}
    }
  }

  const handleCreate = async ({ title, author, url }) => {
    const blogObject = {
      title,
      author,
      url
    }

    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`New blog added: ${returnedBlog.title} by ${returnedBlog.author}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      setMessage('Adding new blog failed', error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={message} />

      {user === null &&
        <Login username={username} password={password}
          setUsername={setUsername} setPassword={setPassword}
          handleLogin={handleLogin}/>
      }

      {user !== null &&
        <>
          <h2>blogs</h2>
          <span>{user.name} logged-in</span>
          <button data-testid='logout-button' onClick={() => handleLogout()}>logout</button>

          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <Create handleCreate={handleCreate} />
          </Togglable>

          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog => <Blog key={blog.id} blog={blog} updateBlogsState={updateBlogsState} handleDelete={handleDelete} user={user} />)
          }
        </>
      }
    </div>
  )
}

export default App