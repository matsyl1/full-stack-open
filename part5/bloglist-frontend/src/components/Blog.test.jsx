import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import Create from './Create'

const blog = {
  title: 'test blog',
  author: 'test author',
  url: 'http://testurl.com',
  likes: 10,
  user: { username: 'test-username', name: 'test-name', id: 123 }
}

const user = {
  username: 'test-username',
  name: 'test-name',
  id: 123
}

const mockHandler = vi.fn()

blogService.addLike = vi.fn().mockResolvedValue({ ...blog, likes: blog.likes + 1 })

beforeEach(() => {
  mockHandler.mockClear()
})



test('default view renders only title and author', () => {

  render(<Blog blog={blog} updateBlogsState={mockHandler} handleDelete={mockHandler} user={user}/>)

  const defaultView = screen.getByTestId('default-view')

  expect(defaultView).toHaveTextContent('test blog')
  expect(defaultView).toHaveTextContent('test author')
  expect(defaultView).not.toHaveTextContent('http://testurl.com')
  expect(defaultView).not.toHaveTextContent('10')
})

test('expand view also renders url and likes', () => {

  render(<Blog blog={blog} updateBlogsState={mockHandler} handleDelete={mockHandler} user={user}/>)

  const viewButton = screen.getByText('view')
  fireEvent.click(viewButton)

  const expandView = screen.getByTestId('expand-view')

  expect(expandView).toHaveTextContent('test blog')
  expect(expandView).toHaveTextContent('test author')
  expect(expandView).toHaveTextContent('http://testurl.com')
  expect(expandView).toHaveTextContent('10')
})

test('event handler called twice if button is clicked twice', async () => {

  render(<Blog blog={blog} updateBlogsState={mockHandler} handleDelete={mockHandler} user={user}/>)

  const userAction = userEvent.setup()

  await userAction.click(screen.getByText('view'))

  const likeButton = screen.getByText('like')
  await userAction.click(likeButton)
  await userAction.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blog form details passed correctly when new blog created', async () => {

  render(<Create handleCreate={mockHandler} />)

  const userAction = userEvent.setup()
  const titleInput = screen.getByTestId('title-input')
  const authorInput = screen.getByTestId('author-input')
  const urlInput = screen.getByTestId('url-input')
  const createButton = screen.getByTestId('create-button')

  await userAction.type(titleInput, 'test title')
  await userAction.type(authorInput, 'test author')
  await userAction.type(urlInput, 'test url')
  await userAction.click(createButton)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'test title',
    author: 'test author',
    url: 'test url'
  })
})