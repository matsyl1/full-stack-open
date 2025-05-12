const _ = require('lodash')

const dummy = (blogs) => {
  return blogs = 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => { 
  const mostLiked = blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])
  return { title: mostLiked.title, author: mostLiked.author, likes: mostLiked.likes }
}

const mostBlogs = (blogs) => {
  const count = _.countBy(blogs, 'author')
  const max = _.maxBy(Object.keys(count), (author) => count[author]);
  return { author: max, blogs: count[max] }
}

const mostLikes = (blogs) => {
  const group = _.groupBy(blogs, 'author')
  const likes = _.map(group, (posts, author) => ({author, likes: _.sumBy(posts, 'likes')}))
  return _.maxBy(likes, 'likes')
}
 
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}