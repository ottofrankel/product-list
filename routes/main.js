const router = require("express").Router();
const faker = require("faker");
const Product = require("../models/product");
const Review = require("../models/review");

router.get("/generate-fake-data", (req, res, next) => {
  for (let i = 0; i < 90; i++) {
    let product = new Product();

    product.category = faker.commerce.department();
    product.name = faker.commerce.productName();
    product.price = faker.commerce.price();
    product.image = "https://via.placeholder.com/250?text=Product+Image";

    product.save((err) => {
      if (err) throw err;
    });
  }
  res.end();
});

router.param("product", (req, res, next, id) => {
  Product
  .find({_id: id})
  .populate("reviews")
  .exec((err, product) => {
    if (err)
      console.log(err);
    else
      req.product = product;
    next();
  })
})

router.get("/products", (req, res, next) => {
  const pageNum = req.query.page || 1;

  Product
  .find()
  .skip(9 * (pageNum - 1))
  .limit(9)
  .exec((err, products) => {
    Product.count().exec((err, count) => {
      if (err) return next(err);

      res.send(products);
    });
  });
});

router.get("/products/:product", (req, res) => {
  res.send(req.product);
})

router.get("/products/:product/reviews", (req, res, next) => {
  const pageNum = req.query.page || 1;

  Review
  .find({product: req.product._id})
  .skip(4 * (pageNum - 1))
  .limit(4)
  .exec((err, reviews) => {
    Review.count().exec((err, count) => {
      if (err) return next(err);

      res.send(reviews);
    });
  })
})

router.post("/products/:product/reviews", (req, res) => {
  const product = req.product;

  // This is for testing 
  const testReview = new Review({
    text: 'test review',
    username: 'me',
    product: product._id
  })

  testReview.save();

  product.reviews.push(testReview);
  product.save();

  res.send(testReview);
})

module.exports = router;