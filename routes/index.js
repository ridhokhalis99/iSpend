const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/login', Controller.login)
router.post('/login', Controller.checkUser)
router.get('/signUp', Controller.signUp)
router.post('/signUp', Controller.addUser)

router.use(function (req, res, next) {
    console.log(req.session)
    if(!req.session.UserId){
        const error = 'Please login first'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

router.get('/', Controller.iSpend)
router.get('/addTransaction', Controller.addTransactionForm)
router.post('/addTransaction', Controller.addTransaction)
router.get('/profile', Controller.showProfile)
router.get('/profile/edit', Controller.editProfileForm)
router.post('/profile/edit', Controller.editProfile)
router.get('/deleteTransaction/:transactionId', Controller.deleteTransaction)

router.use(function (req, res, next) {
    console.log(req.session)
    if(req.session.role !== "admin"){
        const error = 'Admin only'
        res.redirect(`/?error=${error}`)
    } else {
        next()
    }
})

router.get('/users', Controller.userList)
router.get('/users/:UserId/delete', Controller.deleteUser)

module.exports = router