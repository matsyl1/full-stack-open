const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
  // console.log(JSON.stringify(blogs, null, 2))
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'missing title or url' })
  }

  const { title, author, url, likes } = request.body

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(403)
      .json({ error: 'only the blog creator can delete this' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes,
  }

  const updatedBlogLikes = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true }
  )
  response.json(updatedBlogLikes)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body
  const blog = await Blog.findById(request.params.id)

  if(!blog) {
    return response.status(404).json({ error: 'Blog does not exist' })
  }

  blog.comments = blog.comments.concat(comment)
  const updatedBlog = await blog.save()
  
  response.status(201).json(updatedBlog)
 })

module.exports = blogsRouter
