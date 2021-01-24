function cartController(){
    return {
        cart(req, res){
            res.render('customers/cart')
        },
        update(req, res){

            //in seesion cart we are adding details
            if(!req.session.cart){
                req.session.cart = {
                    items:{

                    },
                    totalQty: 0,
                    totalPrice: 0
                }
                
            }

            let cart = req.session.cart
            // console.log(req.body)
            //check if item does not exit in cart
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty  += 1;
                cart.totalPrice += parseInt(req.body.price)
            }
            else{
                cart.items[req.body._id].qty += 1,
                cart.totalQty  += 1;
                cart.totalPrice += parseInt(req.body.price)

            }

            return res.json({totalQty:req.session.cart.totalQty})
        }
    }
}

module.exports = cartController