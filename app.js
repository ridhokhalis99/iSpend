const express = require('express')
const router = require('./routes/index')
const session = require('express-session')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'expense tracker',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))
app.use('/', router)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})