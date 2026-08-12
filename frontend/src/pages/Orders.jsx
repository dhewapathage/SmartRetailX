import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import orderApi from "../services/orderApi";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response =
                    await orderApi.get("/orders");

                setOrders(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load orders"
                );

            } finally {

                setLoading(false);
            }
        };


        fetchOrders();

    }, []);


    const getStatusClass = (status) => {

        switch (status) {

            case "CONFIRMED":
                return "status confirmed";

            case "CANCELLED":
                return "status cancelled";

            default:
                return "status pending";
        }
    };


    return (

        <Layout>

            <div className="page-container">

                <div className="hero-section">

                    <div>

                        <p className="eyebrow">
                            ORDER HISTORY
                        </p>

                        <h1>
                            My Orders
                        </h1>

                        <p className="hero-text">
                            Track your recent SmartRetailX orders
                            and their processing status.
                        </p>

                    </div>

                </div>


                {
                    loading && (
                        <div className="empty-state">
                            Loading orders...
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
                    !loading &&
                    orders.length === 0 && (

                        <div className="empty-state">
                            You have no orders yet.
                        </div>

                    )
                }


                <div className="orders-list">

                    {
                        orders.map((order) => (

                            <div
                                className="order-card"
                                key={order._id}
                            >

                                <div className="order-card-header">

                                    <div>

                                        <p className="order-id">
                                            ORDER
                                        </p>

                                        <h3>
                                            #
                                            {
                                                order._id.slice(-8)
                                            }
                                        </h3>

                                    </div>


                                    <span
                                        className={
                                            getStatusClass(
                                                order.status
                                            )
                                        }
                                    >
                                        {order.status}
                                    </span>

                                </div>


                                {
                                    order.items.map(
                                        (item, index) => (

                                            <div
                                                className="order-item"
                                                key={index}
                                            >

                                                <div>

                                                    <strong>
                                                        {
                                                            item.productName
                                                        }
                                                    </strong>

                                                    <p>
                                                        Quantity:
                                                        {" "}
                                                        {item.quantity}
                                                    </p>

                                                </div>


                                                <strong>
                                                    LKR{" "}
                                                    {
                                                        (
                                                            item.unitPrice *
                                                            item.quantity
                                                        ).toLocaleString()
                                                    }
                                                </strong>

                                            </div>

                                        )
                                    )
                                }


                                <div className="order-card-footer">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        LKR{" "}
                                        {
                                            Number(
                                                order.totalAmount
                                            ).toLocaleString()
                                        }
                                    </strong>

                                </div>

                            </div>

                        ))
                    }

                </div>

            </div>

        </Layout>
    );
}

export default Orders;