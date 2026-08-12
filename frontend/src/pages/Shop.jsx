import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import productApi from "../services/productApi";


function Shop() {

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const navigate =
        useNavigate();


    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response =
                    await productApi.get(
                        "/products"
                    );

                setProducts(
                    response.data
                );

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


    const handleOrder = (product) => {

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate(
                "/login",
                {
                    state: {
                        from: "/products"
                    }
                }
            );

            return;
        }


        navigate("/products");
    };


    return (

        <div className="public-site">

            <header className="public-navbar">

                <Link
                    to="/"
                    className="public-brand"
                >
                    <div className="brand-mark">
                        SRX
                    </div>

                    <div>
                        <strong>
                            SmartRetailX
                        </strong>

                        <span>
                            Smart Shopping
                        </span>
                    </div>
                </Link>


                <nav className="public-nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/shop">
                        Shop
                    </Link>

                    <Link to="/#about">
                        About
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="public-cta"
                    >
                        Register
                    </Link>

                </nav>

            </header>


            <main className="shop-page">

                <div className="shop-heading">

                    <p className="eyebrow">
                        SMARTRETAILX STORE
                    </p>

                    <h1>
                        Explore our products
                    </h1>

                    <p>
                        Browse our available products.
                        Login or create an account when
                        you're ready to place an order.
                    </p>

                </div>


                {
                    loading && (
                        <div className="empty-state">
                            Loading products...
                        </div>
                    )
                }


                {
                    error && (
                        <div className="alert error-alert">
                            {error}
                        </div>
                    )
                }


                {
                    !loading && (

                        <div className="product-grid">

                            {
                                products.map(
                                    (product) => (

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
                                                            ? product.name
                                                                .charAt(0)
                                                                .toUpperCase()
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
                                                        handleOrder(product)
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

                                    )
                                )
                            }

                        </div>

                    )
                }

            </main>

        </div>
    );
}


export default Shop;