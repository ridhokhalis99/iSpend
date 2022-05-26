const router = require('express').Router()
const Controller = require('../controllers/controller')

router.get('/login', Controller.login)
// router.post('/login', Controller.login)
router.get('/signUp', Controller.signUp)
// router.post('/signUp', Controller.signUp)


router.get('/users/:id', Controller.iSpend) // bikin sementara soalnya mau pake :id biar nampilin data yang sesuai id user


// router.get('/', Controller.index)
// router.get('/addTransaction', Controller.addTransactionForm)
// router.post('/addTransaction', Controller.addTransaction)
// router.get('/profile', Controller.showProfile)
// router.get('/profile/edit', Controller.editProfileForm)
// router.post('/profile/edit', Controller.editProfile)
// router.get('/users', Controller.userList)
// router.get('/users/:UserId/delete', Controller.deleteUser)

module.exports = router