const { User, Profile, Transaction } = require('../models')


class Controller {
    static login(req, res){
        res.render('login')
    }

    static signUp(req, res){
        res.render('signup')
    }


    static iSpend(req,res){
        const {id} = req.params
        // res.send(id)
        const {filter} = req.query
        // console.log(filter)
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

        let dataBar = {}

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