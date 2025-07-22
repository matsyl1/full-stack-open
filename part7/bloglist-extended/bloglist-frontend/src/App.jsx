import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification, clearNotification } from './reducers/notificationSlice'
import { fetchBlogs, createBlog, deleteBlog, likeBlog } from './reducers/blogSlice'
import { setUser, clearUser } from './reducers/userSlice'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Login from './components/Login'
import loginService from './services/login'
import Create from './components/Create'
import Togglable from './components/Toggable'
import Users from './components/Users'
import SingleBlog from './components/SingleBlog'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const notify = (message, time = 5) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000)
  }

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    dispatch(clearUser())
  }

  const handleDelete = async (id, token) => {
    const blog = blogs.find(b => b.id === id)
    if(window.confirm(`Delete blog: ${blog.title} by ${blog.author}?`))
      try {
        dispatch(deleteBlog({ id, token: user.token }))
        notify('Blog deleted')
      } catch (error) {
        notify('Failed to delete blog')
      }
  }

  const handleCreate = async ({ title, author, url }) => {
    blogFormRef.current.toggleVisibility()
    try {
      dispatch(createBlog({ title, author, url }))
      notify(`New blog created: ${title} by ${author}`)
    } catch (error) {
      notify('Failed to create blog')
    }
  }

  const padding = {
    padding: 5,
  }

  return (
    <div className="container">
      <Router>
        <div>
          {user === null && (
            <Login
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          )}

          {user !== null && (
            <>
              <div>
                <Link style={padding} to='/'>blogs</Link>
                <Link style={padding} to='/users'>users</Link>
                <span style={padding}>{user.name} logged-in</span>
                <button data-testid="logout-button" onClick={() => handleLogout()}>
                  logout
                </button>
              </div>
              <Notification />
              <Routes>
                <Route path='/' element={
                  <>
                    <h2>blogs</h2>
                    <Togglable buttonLabel="new blog" ref={blogFormRef}>
                      <Create handleCreate={handleCreate} />
                    </Togglable>
                    {[...blogs]
                      .sort((a, b) => b.likes - a.likes)
                      .map(blog => (
                        <Blog
                          key={blog.id}
                          blog={blog}
                          handleDelete={handleDelete}
                          user={user}
                        />
                      ))}
                  </>
                } />
                <Route path='/users/*' element={<Users blogs={blogs}/>}/>
                <Route path="/blogs/:id" element={<SingleBlog blogs={blogs} user={user} handleDelete={handleDelete} />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </div>
  )
}

export default App