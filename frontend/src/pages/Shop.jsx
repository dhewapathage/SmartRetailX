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

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const navigate =
        useNavigate();

    const categories = ["All", ...new Set(products.map((product) => product.category).filter(Boolean))];
    const visibleProducts = products.filter((product) => {
        const query = search.trim().toLowerCase();
        const matchesCategory = category === "All" || product.category === category;
        const matchesSearch = !query || [product.name, product.description, product.sku]
            .some((value) => String(value || "").toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
    });


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


    const handleOrder = () => {

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
                            Everyday shopping
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
                        Sign in
                    </Link>

                    <Link
                        to="/register"
                        className="public-cta"
                    >
                        Create account
                    </Link>

                </nav>

            </header>


            <main className="shop-page">

                <div className="shop-heading clean-shop-heading">

                    <p className="eyebrow">
                        THE SMARTRETAILX STORE
                    </p>

                    <h1>
                        Find what you need.
                    </h1>

                    <p>
                        A simple catalogue of everyday products, with clear prices and easy ordering.
                    </p>

                </div>


                <div className="shop-tools">
                    <label className="shop-search">
                        <span aria-hidden="true">⌕</span>
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" />
                    </label>
                    <div className="category-filters" aria-label="Filter by category">
                        {categories.map((item) => <button key={item} type="button" className={item === category ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
                    </div>
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
                                visibleProducts.map(
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
                                                        handleOrder()
                                                    }
                                                >
                                                    {
                                                        product.active
                                                            ? "Order now"
                                                            : "Unavailable"
                                                    }
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                            {visibleProducts.length === 0 && <div className="empty-state">No products match your search.</div>}

                        </div>

                    )
                }

            </main>

        </div>
    );
}


export default Shop;
