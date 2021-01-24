const order = require('../../../models/order')

function adminOrderController() {
    return{
        index(req, res){
            order.find({status: {$ne:'completed'}}, null, {sort:{'createdAt': -1}}).populate('customerId', '-password').
            exec((err, orders) => {
                console.log(req.xhr)
                if(req.xhr){
                    
                    res.json(orders)
                }
                else{

                res.render('admin/orders')
                }
            })


        }
    }
}

module.exports = adminOrderController