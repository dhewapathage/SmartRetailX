import { Link } from "react-router-dom";

const Brand = () => (
    <Link to="/" className="public-brand" aria-label="SmartRetailX home">
        <div className="brand-mark">S</div>
        <div><strong>SmartRetailX</strong><span>Everyday shopping, made simple</span></div>
    </Link>
);

function Home() {
    return (
        <div className="public-site">
            <header className="public-navbar">
                <Brand />
                <nav className="public-nav-links" aria-label="Main navigation">
                    <Link to="/">Home</Link><Link to="/shop">Shop</Link><a href="#why-us">Why us</a>
                    <Link to="/login" className="login-link">Sign in</Link><Link to="/register" className="public-cta">Create account</Link>
                </nav>
            </header>
            <main>
                <section className="campaign-hero">
                    <img src="https://design.canva.ai/4yyOQt8A4NHnx27" alt="A curated collection of modern home and lifestyle products" />
                    <div className="campaign-hero-shade" />
                    <div className="home-hero-content campaign-hero-copy">
                        <p className="eyebrow">WELCOME TO SMARTRETAILX</p>
                        <h1>Everyday finds,<br /><em>naturally better.</em></h1>
                        <p>Fresh choices for your home, your routine and everything in between.</p>
                        <div className="hero-actions"><Link to="/shop" className="public-primary-button">Shop now</Link><Link to="/register" className="public-secondary-button">Create an account</Link></div>
                    </div>
                </section>
                <section className="quick-categories" aria-label="Popular categories">
                    <div><span>01</span><strong>Electronics</strong><p>Useful tech for every day.</p></div>
                    <div><span>02</span><strong>Home</strong><p>Simple essentials for your space.</p></div>
                    <div><span>03</span><strong>Lifestyle</strong><p>Thoughtful products for daily life.</p></div>
                </section>
                <section className="seasonal-banner">
                    <img src="https://design.canva.ai/xsLmf-p4y3TNt4J" alt="Woman wearing premium headphones beside a curated technology collection" />
                    <div className="seasonal-banner-copy">
                        <p className="eyebrow">THE EVERYDAY EDIT</p>
                        <h2>Simple pieces.<br />A fresher routine.</h2>
                        <Link to="/shop">Explore the collection →</Link>
                    </div>
                </section>
                <section id="why-us" className="simple-benefits">
                    <div className="section-intro"><p className="eyebrow">WHY SMARTRETAILX</p><h2>Shopping without the clutter.</h2></div>
                    <div className="benefit-list">
                        <div><span>✓</span><div><strong>Easy to explore</strong><p>A clear catalogue that helps you find products quickly.</p></div></div>
                        <div><span>✓</span><div><strong>Secure ordering</strong><p>Sign in and place orders with confidence.</p></div></div>
                        <div><span>✓</span><div><strong>Live updates</strong><p>Orders and notifications stay connected in one place.</p></div></div>
                    </div>
                </section>
            </main>
            <footer className="public-footer"><Brand /><p>Modern retail, made simple.</p><p>© 2026 SmartRetailX</p></footer>
        </div>
    );
}

export default Home;
