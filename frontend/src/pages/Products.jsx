import { useEffect, useState } from "react";
import productApi from "../services/productApi";
import orderApi from "../services/orderApi";
import Layout from "../components/Layout";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [orderMessage, setOrderMessage] = useState("");
    const [ordering, setOrdering] = useState(false);


    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response =
                    await productApi.get("/products");

                setProducts(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load products"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchProducts();

    }, []);


    const openOrderModal = (product) => {

        setSelectedProduct(product);
        setQuantity(1);
        setOrderMessage("");

    };


    const closeOrderModal = () => {

        setSelectedProduct(null);
        setOrderMessage("");

    };


    const placeOrder = async () => {

        if (!selectedProduct) {
            return;
        }

        try {

            setOrdering(true);
            setOrderMessage("");

            const response =
                await orderApi.post(
                    "/orders",
                    {
                        productId:
                            selectedProduct._id,

                        quantity:
                            Number(quantity)
                    }
                );

            setOrderMessage(
                `Order created successfully. Order ID: ${response.data.order._id}`
            );

        } catch (error) {

            setOrderMessage(
                error.response?.data?.message ||
                "Failed to create order"
            );

        } finally {

            setOrdering(false);
        }
    };


    return (

        <Layout>

            <div className="page-container">

                <div className="hero-section">

                    <div>

                        <p className="eyebrow">
                            SMARTRETAILX STORE
                        </p>

                        <h1>
                            Discover our products
                        </h1>

                        <p className="hero-text">
                            Browse products and place your order
                            through our distributed retail platform.
                        </p>

                    </div>

                </div>


                {
                    error && (
                        <div className="alert error-alert">
                            {error}
                        </div>
                    )
                }


                <div className="section-header">

                    <div>

                        <h2>
                            Product Catalogue
                        </h2>

                        <p>
                            {products.length} products available
                        </p>

                    </div>

                </div>


                {
                    loading ? (

                        <div className="empty-state">
                            Loading products...
                        </div>

                    ) : (

                        <div className="product-grid">

                            {
                                products.length === 0 ? (

                                    <div className="empty-state">
                                        No products available.
                                    </div>

                                ) : (

                                    products.map((product) => (

                                        <div
                                            className="product-card"
                                            key={product._id}
                                        >

                                            <div className="product-top">

                                                <span className="category-badge">
                                                    {product.category}
                                                </span>

                                                <span
                                                    className={
                                                        product.active
                                                            ? "status-dot active-status"
                                                            : "status-dot inactive-status"
                                                    }
                                                >
                                                    {
                                                        product.active
                                                            ? "Available"
                                                            : "Unavailable"
                                                    }
                                                </span>

                                            </div>


                                            <div className="product-image-placeholder">

                                                <span>
                                                    {
                                                        product.name
                                                            ? product.name.charAt(0).toUpperCase()
                                                            : "P"
                                                    }
                                                </span>

                                            </div>


                                            <h3>
                                                {product.name}
                                            </h3>


                                            <p className="product-description">
                                                {
                                                    product.description ||
                                                    "No description available"
                                                }
                                            </p>


                                            <p className="product-sku">
                                                SKU: {product.sku}
                                            </p>


                                            <div className="product-footer">

                                                <div>

                                                    <small>
                                                        Price
                                                    </small>

                                                    <div className="product-price">
                                                        LKR{" "}
                                                        {
                                                            Number(
                                                                product.price
                                                            ).toLocaleString()
                                                        }
                                                    </div>

                                                </div>


                                                <button
                                                    className="primary-button"
                                                    disabled={!product.active}
                                                    onClick={() =>
                                                        openOrderModal(product)
                                                    }
                                                >
                                                    {
                                                        product.active
                                                            ? "Order Now"
                                                            : "Unavailable"
                                                    }
                                                </button>

                                            </div>

                                        </div>

                                    ))

                                )
                            }

                        </div>

                    )
                }


                {
                    selectedProduct && (

                        <div className="modal-overlay">

                            <div className="order-modal">

                                <div className="modal-header">

                                    <div>

                                        <p className="eyebrow">
                                            NEW ORDER
                                        </p>

                                        <h2>
                                            {selectedProduct.name}
                                        </h2>

                                    </div>


                                    <button
                                        className="close-button"
                                        onClick={closeOrderModal}
                                    >
                                        ×
                                    </button>

                                </div>


                                <div className="order-summary">

                                    <div>

                                        <span>
                                            Unit Price
                                        </span>

                                        <strong>
                                            LKR{" "}
                                            {
                                                Number(
                                                    selectedProduct.price
                                                ).toLocaleString()
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <label className="form-label">
                                    Quantity
                                </label>


                                <input
                                    className="form-input"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(
                                            event.target.value
                                        )
                                    }
                                />


                                <div className="total-box">

                                    <span>
                                        Order Total
                                    </span>

                                    <strong>
                                        LKR{" "}
                                        {
                                            (
                                                Number(
                                                    selectedProduct.price
                                                ) *
                                                Number(quantity || 0)
                                            ).toLocaleString()
                                        }
                                    </strong>

                                </div>


                                {
                                    orderMessage && (

                                        <div className="alert info-alert">
                                            {orderMessage}
                                        </div>

                                    )
                                }


                                <div className="modal-buttons">

                                    <button
                                        className="secondary-button"
                                        onClick={closeOrderModal}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        className="primary-button"
                                        onClick={placeOrder}
                                        disabled={
                                            ordering ||
                                            Number(quantity) < 1
                                        }
                                    >
                                        {
                                            ordering
                                                ? "Processing..."
                                                : "Confirm Order"
                                        }
                                    </button>

                                </div>

                            </div>

                        </div>

                    )
                }

            </div>

        </Layout>
    );
}

export default Products;