import { Link } from "react-router-dom";

function Home() {

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

                    <a href="#about">
                        About
                    </a>

                    <Link
                        to="/login"
                        className="login-link"
                    >
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


            <main>

                <section className="home-hero">

                    <div className="home-hero-content">

                        <p className="eyebrow">
                            SMARTER RETAIL EXPERIENCE
                        </p>

                        <h1>
                            Shopping made
                            simple, secure and
                            connected.
                        </h1>

                        <p>
                            Discover products,
                            place orders and track
                            your shopping experience
                            through SmartRetailX.
                        </p>


                        <div className="hero-actions">

                            <Link
                                to="/register"
                                className="public-primary-button"
                            >
                                Start Shopping
                            </Link>

                            <Link
    to="/shop"
    className="public-secondary-button"
>
    Explore Products
</Link>

                        </div>

                    </div>


                    <div className="hero-visual">

                        <div className="hero-card">

                            <span className="hero-small-label">
                                SMART RETAIL
                            </span>

                            <h2>
                                Everything you need,
                                in one place.
                            </h2>

                            <div className="hero-feature">
                                ✓ Secure account access
                            </div>

                            <div className="hero-feature">
                                ✓ Fast order processing
                            </div>

                            <div className="hero-feature">
                                ✓ Real-time updates
                            </div>

                        </div>

                    </div>

                </section>


                <section
                    id="products"
                    className="home-section"
                >

                    <div className="home-section-heading">

                        <p className="eyebrow">
                            SHOP SMART
                        </p>

                        <h2>
                            Featured Products
                        </h2>

                        <p>
                            Explore products available
                            through SmartRetailX.
                        </p>

                    </div>


                    <div className="featured-grid">

                        <div className="featured-card">

                            <div className="featured-placeholder">
                                E
                            </div>

                            <span>
                                Electronics
                            </span>

                            <h3>
                                Latest Technology
                            </h3>

                            <p>
                                Explore modern devices
                                and accessories.
                            </p>

                        </div>


                        <div className="featured-card">

                            <div className="featured-placeholder">
                                H
                            </div>

                            <span>
                                Home
                            </span>

                            <h3>
                                Everyday Essentials
                            </h3>

                            <p>
                                Products designed for
                                your everyday needs.
                            </p>

                        </div>


                        <div className="featured-card">

                            <div className="featured-placeholder">
                                L
                            </div>

                            <span>
                                Lifestyle
                            </span>

                            <h3>
                                Shop Your Style
                            </h3>

                            <p>
                                Discover products that
                                fit your lifestyle.
                            </p>

                        </div>

                    </div>


                    <div className="section-action">

                        <Link
                            to="/login"
                            className="public-primary-button"
                        >
                            Login to Shop
                        </Link>

                    </div>

                </section>


                <section
                    id="about"
                    className="about-section"
                >

                    <div>

                        <p className="eyebrow">
                            ABOUT SMARTRETAILX
                        </p>

                        <h2>
                            A modern retail experience
                            built around the customer.
                        </h2>

                    </div>


                    <div>

                        <p>
                            SmartRetailX provides a
                            secure and convenient way
                            for customers to browse
                            products, place orders,
                            track purchases and receive
                            order updates.
                        </p>

                        <p>
                            Behind the customer
                            experience is a distributed
                            microservice architecture
                            designed for scalability,
                            resilience and reliability.
                        </p>

                    </div>

                </section>

            </main>


            <footer className="public-footer">

                <div>

                    <strong>
                        SmartRetailX
                    </strong>

                    <p>
                        Modern retail.
                        Smarter experiences.
                    </p>

                </div>


                <p>
                    © 2026 SmartRetailX
                </p>

            </footer>

        </div>
    );
}

export default Home;