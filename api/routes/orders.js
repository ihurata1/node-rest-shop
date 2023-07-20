const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");


router.get("/", (req, res, next) => {
    Order.find().select("product quantity").populate("product", "name price").exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:300/orders/" + doc._id,
                    }
                }
            }),

        });
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId).populate("product").exec().then(
        order => {
            if (!order) {
                return res.status(404).json({
                    message: "order NOT found",

                });
            }
            res.status(200).json({
                order: order,

            });
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err
            })
        }
    );

});


router.post("/", async (req, res, next) => {
    const productFound = await Product.findById(req.body.productId);

    if (!productFound) {
        return res.status(404).json({
            message: "Product not found"
        })
    }

    const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity
    })
    const createdOrder = await order.save();
    console.log(createdOrder);
    if (createdOrder) {
        res.status(201).json({
            message: "Order stored",
            createdOrder: {
                product: createdOrder.product,
                quantity: createdOrder.quantity
            },
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + createdOrder._id
            }
        })
    } else {
        res.status(500).json({ message: "Some error occured" })
    }
});

/*router.post("/", (req, res, next) => {
    Product.findById(req.body.productId).then(
        product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        }).then(result => {
            console.log(result);
            res.status(201).json(result);

        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });



});*/

router.delete("/:orderId", (req, res, next) => {
    Order.findOneAndRemove({ _id: req.params.orderId }).exec().then(
        result => res.status(200).json({
            message: "Order deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders",
                body: { productId: "ID", quantity: "Number" }
            }
        })
    ).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

});



module.exports = router;