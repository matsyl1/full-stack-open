const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt') 
const helper = require('../utils/api_test_helper')
const Blog = require('../models/blog')
const User = require('../models/user') 
const mongoose = require('mongoose')

const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

//BLOG TESTING
describe('blog testing', () => {
  let token = ''
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'testuser', passwordHash })
    await user.save()

    const login = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'secret' })

    token = login.body.token
  })

  test('blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property named "id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    // console.log(Object.keys(blog))
    const keys = Object.keys(blog)
    assert.strictEqual(keys[4], 'id')
  })

  test('POST-request creates a new blogpost', async () => {
    const newBlog = {
      _id: '5a422a851b54a676234d17f0',
      title: 'test',
      author: 'test',
      url: 'https://test.test',
      likes: 1,
      __v: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  test('missing likes property defaults to 0', async () => {
    const newBlogMissingLikes = {
      _id: '5a422a851b54a676234d17f4',
      title: 'test',
      author: 'test',
      url: 'https://test.test',
      __v: 0,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogMissingLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
    // console.log(response.body)
  })

  test('blog with missing title fails with 400/bad request', async () => {
    const newBlogMissingTitle = {
      _id: '5a422a851b54a676234d17f4',
      author: 'test',
      url: 'https://test.test',
      likes: 1,
      __v: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogMissingTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog with missing url fails with 400/bad request', async () => {
    const newBlogMissingUrl = {
      _id: '5a422a851b54a676234d17f4',
      title: 'test',
      author: 'test',
      likes: 1,
      __v: 0,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogMissingUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('delete blog - status 204 if valid id and auth user', async () => {
    const newBlog = {
      title: 'Delete this',
      author: '...',
      url: '...',
      likes: 0,
    }

    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const ids = blogsAtEnd.map(i => i.id)
    assert(!ids.includes(createdBlog.id))
  })

  test('update blog likes - status 200 if successful', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 100 })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    assert.deepStrictEqual(blogsAtEnd[0].likes, 100)
  })

  test('create blog fails with 401/unauth without token', async () => {
    const newBlog = {
      title: 'sent w/o token',
      author: '...',
      url: '...',
      likes: '...',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

//USER TESTING
describe('user testing', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('user with short username not created', async () => {
    const newUser = {
      username: '12',
      name: '123',
      password: '123',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(response.body.error, /shorter/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 0) // Ensure no user is created
  })

  test('user with short password not created', async () => {
    const newUser = {
      username: '123',
      name: '123',
      password: '12',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(response.body.error, /least/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 0)
  })

  test('duplicate username not created', async () => {
    const newUser = {
      username: 'test',
      name: 'test user',
      password: '123',
    }

    await api.post('/api/users').send(newUser).expect(201)

    const duplicateUser = {
      username: 'test',
      name: 'duplicate test user',
      password: '456',
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(response.body.error, /unique/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1) // Ensure no duplicate user is created
  })
})

after(async () => {
  await mongoose.connection.close()
})
