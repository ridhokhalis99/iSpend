const { User, Profile, Transaction } = require('../models')
const bcrypt = require('bcryptjs')
const rupiahFormat = require('../helpers/rupiahFormat')

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
                        req.session.role = user.role

                        if(req.session.role === "admin"){
                            res.redirect('/users')
                        } else {
                            res.redirect('/')
                        }
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
                if(err.name === 'SequelizeValidationError'){
                    err = err.errors.map(error => error.message)
                    return res.redirect(`/signup?error=${err}`)
                }
                res.send(err)
            })
    }

    static iSpend(req,res){
        // const {id} = req.params
        const id = req.session.UserId
        // res.send(id)
        const {sort, filter} = req.query
        console.log(filter)

        // ==================================== untuk option data dari promise ke 2 (dataUser), data yang bisa di filter
        // let option = {
        //     include: [Profile, {
        //         model: Transaction
                
        //     }]
        // }

        // if (filter) {
        //     option = {
        //         include: [Profile, {
        //             model: Transaction,
        //             where: {
        //                 category: filter
        //             }
        //         }]
        //     }
        // }

        let option = {
            order: [['id', 'DESC']],
            where: {
                UserId: id
            }
         }
         if(filter){
           option.where = {
              category: filter
           }
         }
         if (sort) {
            option.order = [
                [sort, 'ASC']
            ]
        }

        // ===========================================

        let dataBar = {}
         let transactions = []
        // dataBar buat data yang tetap yang ga ke filter buat chart bar

        Transaction.findAll(option)
            .then(data => {
                transactions = data
                return Profile.findOne({where: {UserId: id}})
            })
            .then(profile => {
                res.render('iSpend', {transactions, profile, sort, filter, rupiahFormat})
            })
            .catch(err => {
                res.send(err)
            })

        // User.findByPk(id,{
        //     include: [Profile, Transaction]
        // })
        // .then((dataForBar)=>{
        //     dataBar = dataForBar
        //     return User.findByPk(id,option)
        // })
        // .then((dataUser)=>{
        //     res.render('iSpend',{dataUser, dataBar, rupiahFormat})
        // })
        // .catch((err)=>{
        //     res.send(err)
        // })

    }

    static addTransactionForm(req, res){
        res.render('addTransaction')
    }

    static addTransaction(req, res){
        // res.send(req.body)
        const id = req.session.UserId
        const {name,nominal,category} = req.body
        // let newDate = new Date()

        Transaction.create({
            name,
            nominal,
            category,
            UserId: id,
        })
        .then(()=>{
            res.redirect('/')
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    static showProfile(req, res){
        const id = req.session.UserId

        Profile.findOne({where: {UserId: id}})
        .then((dataProfile)=>{
            res.render('profile', {dataProfile})
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    static editProfileForm(req, res){
        const id = req.session.UserId

        Profile.findOne({where: {UserId: id}})
        .then((dataProfile)=>{
            res.render('profileEdit', {dataProfile})
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    static editProfile(req, res){
        // res.send(req.body)
        // {"fullname":"Raymond Kurnia","monthlySalary":"10000000"}
        const id = req.session.UserId
        const {fullName,monthlySalary} = req.body

        Profile.findOne({where: {UserId: id}})
        .then((dataProfile)=>{
            // res.render('profileEdit', {dataProfile})
            let profileId = dataProfile.id
            // res.send(dataProfile)
            return Profile.update({
                    fullName: fullName,
                    monthlySalary: monthlySalary
                },{
                    where:{
                        id: profileId
                }
                })
        })
        .then(()=>{
            res.redirect('/profile')
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    static deleteTransaction(req,res){
        const {transactionId} = req.params
        console.log(transactionId)
        Transaction.destroy({
            where: {
                id: +transactionId
            }
        })
        .then(()=>{
            res.redirect('/')
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    static userList(req, res){
        User.findAll({where: { role: 'customer'}})
        .then((dataUsers)=>{
            res.render('userList',{dataUsers})
        })
        .catch((err)=>{
            res.send(err)
        })
    }

    static deleteUser(req, res){
        const {UserId} = req.params
        User.destroy({
            where: {
                id: UserId
            }
        })
        .then(()=>{
            res.redirect('/users')
        })
        .catch((err)=>{
            res.send(err)
        })
    }
}

module.exports = Controller