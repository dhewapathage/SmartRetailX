import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await userApi.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            setMessage("Login successful");
            navigate("/products");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-page-light">
            <aside className="auth-brand-panel auth-welcome-panel">
                <Link to="/" className="auth-back-link">← Back to home</Link>
                <div className="auth-welcome-copy">
                    <div className="brand-mark">S</div>
                    <p className="eyebrow">WELCOME BACK</p>
                    <h1>Your shopping,<br />right where you left it.</h1>
                    <p>Sign in to browse products, place orders and receive live updates from SmartRetailX.</p>
                </div>
                <div className="auth-perks"><span>Secure access</span><span>Live orders</span><span>Instant updates</span></div>
            </aside>

            <main className="auth-form-panel">
                <div className="auth-form-card login-form-card">
                    <Link to="/" className="auth-back-mobile">← Back to home</Link>
                    <p className="eyebrow">SMARTRETAILX ACCOUNT</p>
                    <h2>Sign in</h2>
                    <p className="auth-description">Enter your details to continue shopping.</p>

                    <form onSubmit={handleLogin}>
                        <label>Email address</label>
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />

                        <label>Password</label>
                        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />

                        {message && <div className="alert info-alert">{message}</div>}

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="auth-switch">New to SmartRetailX? <Link to="/register">Create an account</Link></p>
                </div>
            </main>
        </div>
    );
}

export default Login;
