import { useState } from 'react'

const Create = ({ handleCreate }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    handleCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>create new</h2>
      <div>title: <input data-testid='title-input' value={title} onChange={(e) => setTitle(e.target.value)} type="text" /></div>
      <div>author: <input data-testid='author-input' value={author} onChange={(e) => setAuthor(e.target.value)} type="text" /></div>
      <div>url: <input data-testid='url-input' value={url} onChange={(e) => setUrl(e.target.value)} type="text" /></div>
      <button data-testid='create-button' type="submit">create</button>
    </form>
  )
}

export default Create

