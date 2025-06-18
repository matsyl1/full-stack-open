const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('login-button').click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByTestId('new-blog-button').click()
  await page.getByTestId('title-input').fill(title)
  await page.getByTestId('author-input').fill(author)
  await page.getByTestId('url-input').fill(url)
  await page.getByTestId('create-button').click()
}
export { loginWith, createBlog }