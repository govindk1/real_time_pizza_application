const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport){
    passport.use(new LocalStrategy({usernameField: 'email'},async (email, password, done) => {
        //Login
        //check if email exists

        const user = await User.findOne({email: email})
        
        if(!user){
            return done(null, false, {message: 'No user with this email'})
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, {message: 'Logged in succesfully'})
            }

            return done(null, false, {message:'Wrong username or password'})
        }).catch(err => {
            return done(null, false, {message: 'Sommething went wrong'})
        })


    }))

    //this gives us chance to store things in sessions the (user, done) come from the brcypt.compare
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    //whatever be the data stored in session we are passed it by parameters
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })            
    })

}


module.exports = init