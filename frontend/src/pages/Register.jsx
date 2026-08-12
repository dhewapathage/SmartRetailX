import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../services/api";

function Register() {

    const navigate =
        useNavigate();


    const [formData, setFormData] =
        useState({

            name: "",

            email: "",

            password: "",

            confirmPassword: ""
        });


    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleChange = (event) => {

        setFormData({

            ...formData,

            [event.target.name]:
                event.target.value
        });
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match"
            );

            return;
        }


        try {

            setLoading(true);


            await userApi.post(
                "/users",
                {

                    name:
                        formData.name,

                    email:
                        formData.email,

                    password:
                        formData.password
                }
            );


            setMessage(
                "Registration successful. Redirecting to login..."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1000);


        } catch (error) {

            setError(

                error.response?.data?.message ||
                "Registration failed"
            );


        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-brand-panel">

                <Link
                    to="/"
                    className="auth-brand"
                >

                    <div className="brand-mark">
                        SRX
                    </div>

                    <strong>
                        SmartRetailX
                    </strong>

                </Link>


                <div>

                    <p className="eyebrow">
                        JOIN SMARTRETAILX
                    </p>

                    <h1>
                        Create your
                        shopping account.
                    </h1>

                    <p>
                        Register to place orders,
                        track purchases and receive
                        real-time order updates.
                    </p>

                </div>

            </div>


            <div className="auth-form-panel">

                <div className="auth-form-card">

                    <p className="eyebrow">
                        CREATE ACCOUNT
                    </p>

                    <h2>
                        Register
                    </h2>

                    <p className="auth-description">
                        Enter your details below.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                    >

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={
                                formData.name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Your full name"
                            required
                        />


                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="you@example.com"
                            required
                        />


                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Create password"
                            required
                        />


                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                formData.confirmPassword
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Confirm password"
                            required
                        />


                        {
                            error && (

                                <div className="alert error-alert">
                                    {error}
                                </div>

                            )
                        }


                        {
                            message && (

                                <div className="alert success-alert">
                                    {message}
                                </div>

                            )
                        }


                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Creating account..."
                                    : "Create Account"
                            }

                        </button>

                    </form>


                    <p className="auth-switch">

                        Already have an account?

                        {" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Register;