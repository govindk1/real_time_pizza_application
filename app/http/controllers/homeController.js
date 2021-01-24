const Menu = require('../../models/menu')

 function homeController(){
    return {
        // index:function(req, res){
        //     res.render('home')
        // }
        async index(req, res){
            // Menu.insertMany([
            // {"name": "Marinara","image": "pizza.png","price": "300","size": "medium"},
            // { "name": "Carbonara","image": "pizza.png", "price": "200","size": "small"},
            // ])
            
            try{
            var pizzas = await Menu.find({})
            }catch{
                alert('check your connection')
            }
            res.render('home', {pizzas: pizzas}) 
        }
    }
}

module.exports = homeController