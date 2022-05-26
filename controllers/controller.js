const { User, Profile, Transaction } = require('../models')
const bcrypt = require('bcryptjs')

class Controller {
    static login(req, res){
        const {error} = req.query
        res.render('login', {error})
    }

    static checkUser(req, res){
        const {username, password} = req.body
        let error = ''
        User.findOne({where: { username }})
            .then(user => {
                if(user){
                    const isValidPassword = bcrypt.compareSync(password, user.password)
                    if(!isValidPassword) {
                        error = 'Invalid password'
                        res.redirect(`/login?error=${error}`)
                    } else {
                        req.session.UserId = user.id
                        res.redirect('/')
                    }
                } else {
                    error = 'Username not found'
                    res.redirect(`/login?error=${error}`)
                }
            })
            .catch(err => {
                res.send(err)
            })
    }

    static signUp(req, res){
        res.render('signup')
    }

    static addUser(req, res){
        const {username, password, email, role, fullName, gender, birthDate, monthlySalary} = req.body
        const userInput = {
            username,
            password,
            email,
            role
        }
        User.create(userInput)
            .then(user => {
                const profileInput = {
                    fullName,
                    gender,
                    birthDate,
                    monthlySalary,
                    UserId: user.id
                }
                return Profile.create(profileInput)
            })
            .then(() => {
                res.redirect('/login')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static iSpend(req,res){
        const {id} = req.params
        // res.send(id)
        const {filter} = req.query
        // console.log(filter)

        // ==================================== untuk option data dari promise ke 2 (dataUser), data yang bisa di filter
        let option = {
            include: [Profile, {
                model: Transaction
                
            }]
        }

        if (filter) {
            option = {
                include: [Profile, {
                    model: Transaction,
                    where: {
                        category: filter
                    }
                }]
            }
        }

        // ===========================================

        let dataBar = {}

        // dataBar buat data yang tetap yang ga ke filter buat chart bar



        User.findByPk(id,{
            include: [Profile, Transaction]
        })
        .then((dataForBar)=>{
            dataBar = dataForBar
            return User.findByPk(id,option)
        })
        .then((dataUser)=>{
            res.render('iSpend',{dataUser,dataBar})
        })
        .catch((err)=>{
            res.send(err)
        })

    }

    static index(req, res){
        const UserId = req.session.UserId
        Transaction.findAll({where: { UserId }})
            .then(transactions => {
                res.send(transactions)
            })
            .catch(err => {
                res.send(err)
            })
    }

    static addTransactionForm(req, res){
        
    }

    static addTransaction(req, res){

    }

    static showProfile(req, res){

    }

    static editProfileForm(req, res){

    }

    static editProfile(req, res){

    }

    static userList(req, res){

    }

    static deleteUser(req, res){
        
    }
}

module.exports = Controller