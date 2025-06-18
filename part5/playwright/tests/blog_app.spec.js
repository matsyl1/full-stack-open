const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'testuser', username: 'test', password: 'testpassword' }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.getByText('log into application')
    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'testpassword')
      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('fails with incorrect credentials', async ({ page }) => {
      await loginWith(page, 'test!', 'testpassword!')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })  

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'testpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'playwright-title', 'playwright-author', 'playwright-url')
      await expect(page.getByText('New blog added')).toBeVisible()
      await expect(page.getByTestId('default-view')).toContainText('playwright-title / playwright-author')
    })
  
    test('new blog can be liked', async ({ page }) => {
      await createBlog(page, 'playwright-title', 'playwright-author', 'playwright-url')
      await expect(page.getByText('New blog added')).toBeVisible()
      await page.getByTestId('view-button').click()
      await page.getByTestId('like-button').click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('user who added the blog can delete it', async ({ page }) => {
      await createBlog(page, 'playwright-title', 'playwright-author', 'playwright-url')
      await page.getByTestId('view-button').click()
      page.once('dialog', dialog => dialog.accept())
      await page.getByTestId('delete-button').click()
      await expect(page.getByTestId('default-view')).not.toContainText('playwright-title / playwright-author')
    })
  })
})

describe('Delete button', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testuser1',
        username: 'test1',
        password: 'testpassword1'
      }
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'testuser2',
        username: 'test2',
        password: 'testpassword2'
      }
    })

    await page.goto('/')
  })

  test('is only visible for the user who added the blog', async ({ page }) => {
    await loginWith(page, 'test1', 'testpassword1')
    await createBlog(page, 'added by user1', 'added by user1', 'added by user1')
    await page.getByTestId('logout-button').click()
    await loginWith(page, 'test2', 'testpassword2')
    await page.getByTestId('view-button').click()
    await expect(page.getByTestId('delete-button')).not.toBeVisible()
  })
})

describe('Blog arrangement', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: { name: 'testuser', username: 'test', password: 'testpassword' }
    })

    const login = await request.post('http://localhost:3003/api/login', { 
      data: { username: 'test', password: 'testpassword' }
    })

    const token = (await login.json()).token

    await request.post('http://localhost:3003/api/blogs', {
      headers: { Authorization: `Bearer ${token}` },
        data: { title: 'blog1-title', author: 'blog1-author', url: 'blog1-url', likes: 0 }
    })

    await request.post('http://localhost:3003/api/blogs', {
      headers: { Authorization: `Bearer ${token}` },
        data: { title: 'blog2-title', author: 'blog2-author', url: 'blog2-url', likes: 0 }
    })

    await page.goto('/')
  })

  test('in descending order of likes ', async ({ page }) => {
    await loginWith(page, 'test', 'testpassword')
    await page.getByTestId('view-button').nth(0).click()
    await page.getByTestId('view-button').nth(0).click() //nth(0) again (view-btn hidden)
    await page.getByTestId('like-button').nth(1).click() //nth(1) (both like-btns visible)
    const blogs = await page.getByTestId('expand-view').all()
    const topBlog = await blogs[0].innerText()
    await expect(page.getByTestId('expand-view').first()).toContainText('blog2-title')
    await page.screenshot({ path: 'CHECK.png' })    
  })
})