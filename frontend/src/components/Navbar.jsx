import { NavLink, useNavigate } from "react-router-dom";
import {
    isAdmin
} from "../services/auth";

function Navbar() {

    const adminUser =
    isAdmin();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="brand">
                <div className="brand-mark">
                    SRX
                </div>

                <div>
                    <h2>SmartRetailX</h2>
                    <span>Distributed Retail Platform</span>
                </div>
            </div>


            <div className="nav-links">

                <NavLink
                    to="/products"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Products
                </NavLink>


                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    My Orders
                </NavLink>


                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        isActive
                            ? "nav-link active"
                            : "nav-link"
                    }
                >
                    Notifications
                </NavLink>

                {
    adminUser && (

        <NavLink
            to="/admin/products"
            className={({ isActive }) =>
                isActive
                    ? "nav-link active"
                    : "nav-link"
            }
        >
            Admin
        </NavLink>

    )
}


                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;