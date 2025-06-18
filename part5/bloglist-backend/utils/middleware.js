const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.code === 11000){
    return response.status(400).json({ error: 'not unique username'})
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

//TOKEN EXTRACTOR
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

//USER EXTRACTOR
const userExtractor = async (request, response, next) => {
  const token = request.token
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)
      request.user = user
    } catch {
      request.token = null
    }
  } else {
    request.user = null
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler, 
  tokenExtractor,
  userExtractor
}