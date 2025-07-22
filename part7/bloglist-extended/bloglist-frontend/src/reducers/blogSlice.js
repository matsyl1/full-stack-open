import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

export const fetchBlogs = createAsyncThunk('blogs/fetchAll', async () => {
  return await blogService.getAll()
})

export const createBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, { rejectWithValue }) => {
    try {
      const newBlog = await blogService.create(blogData)
      return newBlog
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const likeBlog = createAsyncThunk('blogs/like', async (blog) => {
  const updated = {
    ...blog, likes: blog.likes + 1,
    user: blog.user.id || blog.user
  }
  const response = await blogService.addLike(blog.id, updated)
  return { ...response, user: blog.user }
})

export const deleteBlog = createAsyncThunk('blogs/delete', async ({ id, token }) => {
  await blogService.remove(id, token)
  return id
})

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        return state.map(blog =>
          blog.id !== action.payload.id ? blog : action.payload
        )
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload
        return state.filter(blog => blog.id !== action.payload)
      })
  },
})

export default blogSlice.reducer