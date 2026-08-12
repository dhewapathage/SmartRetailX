import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../services/api";

function Login() {

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const navigate =
        useNavigate();


    const handleLogin = async (event) => {

        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response =
                await userApi.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );


            const token =
                response.data.token;


            localStorage.setItem(
                "token",
                token
            );


            setMessage(
                "Login successful"
            );


            navigate("/products");


        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="login-page">

            <div className="login-card">

                <h1>
                    SmartRetailX
                </h1>

                <p className="subtitle">
                    Customer Login
                </p>


                <form
                    onSubmit={handleLogin}
                >

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }
                        placeholder="Enter your email"
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        placeholder="Enter your password"
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Logging in..."
                                : "Login"
                        }

                    </button>

                </form>


                {
                    message && (
                        <p className="message">
                            {message}
                        </p>
                    )
                }

            </div>

        </div>
    );
}

export default Login;