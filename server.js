require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')

const PORT = process.env.PORT || 3000

//Database connection
const url = 'mongodb://localhost:27017/pizza'
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});





//use to flash the cookies
app.use(flash())

//session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//Event emmiter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)


//Session config it works as an middleware
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,  
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))


//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json()) //means by default express don't know in which form data will be received so this will tell us that it receive in json 



//global middleware
//since we want to provide session to all the views they cannot directly access the sessions
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)



const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})


//socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    //join 
    // console.log(socket.id)

    socket.on('join', (orderId) => {
        console.log(orderId)
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
  
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
