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
        const id = req.session.UserId
        const {sort, filter} = req.query
        let option = {
            order: [['id', 'DESC']],
            where: {
                UserId: id
            }
         }

         if(filter){
           option.where.category = filter
         }

         if (sort) {
            option.order = Transaction.sortBy(sort)
        }
        
        let transactions = []

        let tempTotalFood = 0
        let tempTotalInvestment = 0
        let tempTotalShopping = 0
        let tempSisaUang = 0
  
        Transaction.sum('nominal',{
            where:{
                UserId:id,
                category: "Food"
            }
        })
          .then((result)=>{
              console.log(result)
              if(result){
                  
                  tempTotalFood = result
              }
            return Transaction.sum('nominal',{
                where:{
                    UserId:id,
                    category: "Investment"
                }
            })
            .then((result)=>{
                if(result){
                    tempTotalInvestment = result

                }
                return Transaction.sum('nominal',{
                    where:{
                        UserId:id,
                        category: "Shopping"
                    }
                })
            })
            .then((result)=>{
                if(result){
                    tempTotalShopping = result
                }
                return Transaction.findAll(option)
            })
          })
            .then(data => {
                transactions = data
                return Profile.findOne({where: {UserId: id}})
            })
            .then(profile => {
                tempSisaUang = profile.monthlySalary - tempTotalFood - tempTotalInvestment -tempTotalShopping
                res.render('iSpend', {transactions, profile, sort, filter, rupiahFormat,tempTotalFood,tempTotalInvestment,tempTotalShopping,tempSisaUang})
            })
            .catch(err => {
                res.send(err)
            })
    }

    static addTransactionForm(req, res){
        res.render('addTransaction')
    }

    static addTransaction(req, res){
        const id = req.session.UserId
        const {name,nominal,category} = req.body

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
                res.render('profile', {dataProfile, rupiahFormat})
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
        const id = req.session.UserId
        const {fullName,monthlySalary} = req.body

        Profile.findOne({where: {UserId: id}})
            .then((dataProfile)=>{
                let profileId = dataProfile.id
                return Profile.update({
                        fullName: fullName,
                        monthlySalary: monthlySalary
                    },
                    {
                        where: {
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
        User.findAll({include: Profile,
            where: { role: 'customer'}})
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

    static logout(req,res){
        req.session.destroy((err)=>{
            if(err){
                res.send(err)
            } else {
                res.redirect('/login')
            }
        })
    }
}

module.exports = Controller