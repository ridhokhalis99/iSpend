const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/login', Controller.login)
router.post('/login', Controller.checkUser)
router.get('/signUp', Controller.signUp)
router.post('/signUp', Controller.addUser)


// router.get('/users/:id', Controller.iSpend) // bikin sementara soalnya mau pake :id biar nampilin data yang sesuai id user

router.use(function (req, res, next) {
    console.log(req.session)
    if(!req.session.UserId){
        const error = 'Please login first'
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }
})

router.get('/', Controller.index)
// router.get('/addTransaction', Controller.addTransactionForm)
// router.post('/addTransaction', Controller.addTransaction)
// router.get('/profile', Controller.showProfile)
// router.get('/profile/edit', Controller.editProfileForm)
// router.post('/profile/edit', Controller.editProfile)
// router.get('/users', Controller.userList)
// router.get('/users/:UserId/delete', Controller.deleteUser)

module.exports = router