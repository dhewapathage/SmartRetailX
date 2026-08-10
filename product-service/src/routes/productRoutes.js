const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    authenticate
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const router = express.Router();


// Anyone authenticated can view products
router.get("/", authenticate, getProducts);

router.get("/:id", authenticate, getProductById);


// Only ADMIN can modify products
router.post(
    "/",
    authenticate,
    authorizeRoles("ADMIN"),
    createProduct
);

router.put(
    "/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    deleteProduct
);

module.exports = router;