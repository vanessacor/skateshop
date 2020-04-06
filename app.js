const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

const indexRouter = require('./routes/index')
const catalogRouter = require('./routes/catalog') // Import routes for "catalog" area of site

const app = express()

// Set up mongoose connection
const devDbUrl = 'mongodb+srv://vanessa:sK8Shop@cluster0-ckn7c.mongodb.net/SkateShop?retryWrites=true&w=majority'
const mongoDB = process.env.MONGODB_URI || devDbUrl
mongoose.connect(mongoDB, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// middlewares

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// routes

app.use('/', indexRouter)
app.use('/catalog', catalogRouter)

// error handlers

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {}

  res.status(err.status || 500)
  res.render(err.status === 400 ? 'not-found' : 'error')
})

module.exports = app
