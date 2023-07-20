const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

//const storage = multer.diskStorage({
//    destination function
//});
const upload = multer({ dest: 'uploads/' });

const Product = require("../models/product");

router.get("/", (req, res, next) => {
    Product.find().select("name price _id").exec().then(docs => { //selected variables return with select
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ err });
    });
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select("name price _id").exec().then(doc => {
        console.log(doc);
        if (doc) {
            res.status(200).json({ doc });
        }
        else {
            res.status(404).json({ message: "No valid entry found for this Id" });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });

});

router.post("/", upload.single('productImage'), (req, res, next) => {

    console.log(req.file);

    const name = req.body.name;
    const price = req.body.price;

    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: name,
        price: price
    });

    product.save().then(result => {
        console.log("result: " + result);
        res.status(201).json({
            message: "Handling POST requests to /products",
            createdProduct: result
        });
    }).catch(err => {
        console.log(name);
        res.status(500).json({
            error: err,
            name: name,
            price: price
        });
    });


});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findOneAndUpdate({ _id: id }, { $set: updateOps }).exec().then(
        result => {
            console.log(result);
            res.status(200).json(result);
        }
    ).catch(
        err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        }
    );

});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findOneAndRemove({ _id: id }).exec().then(
        result => {
            res.status(200).json(result);
        }
    ).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});



module.exports = router;