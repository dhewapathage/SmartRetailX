import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import notificationApi from "../services/notificationApi";

function Notifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const fetchNotifications = async () => {

            try {

                const response =
                    await notificationApi.get(
                        "/notifications"
                    );

                setNotifications(
                    response.data
                );

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load notifications"
                );

            } finally {

                setLoading(false);
            }
        };


        fetchNotifications();

    }, []);


    return (

        <Layout>

            <div className="page-container">

                <div className="hero-section">

                    <div>

                        <p className="eyebrow">
                            NOTIFICATIONS
                        </p>

                        <h1>
                            Your Updates
                        </h1>

                        <p className="hero-text">
                            View order confirmations,
                            cancellations and system updates.
                        </p>

                    </div>

                </div>


                {
                    loading && (
                        <div className="empty-state">
                            Loading notifications...
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
                    notifications.length === 0 && (

                        <div className="empty-state">
                            No notifications yet.
                        </div>

                    )
                }


                <div className="notification-list">

                    {
                        notifications.map(
                            (notification) => (

                                <div
                                    className="notification-card"
                                    key={notification._id}
                                >

                                    <div
                                        className={
                                            notification.type ===
                                            "ORDER_CANCELLATION"
                                                ? "notification-icon cancelled-icon"
                                                : "notification-icon success-icon"
                                        }
                                    >

                                        {
                                            notification.type ===
                                            "ORDER_CANCELLATION"
                                                ? "!"
                                                : "✓"
                                        }

                                    </div>


                                    <div className="notification-content">

                                        <div className="notification-header">

                                            <h3>
                                                {
                                                    notification.type ===
                                                    "ORDER_CANCELLATION"
                                                        ? "Order Cancelled"
                                                        : "Order Confirmed"
                                                }
                                            </h3>

                                            <span>
                                                {
                                                    notification.createdAt
                                                        ? new Date(
                                                            notification.createdAt
                                                        ).toLocaleString()
                                                        : ""
                                                }
                                            </span>

                                        </div>


                                        <p>
                                            {
                                                notification.message
                                            }
                                        </p>


                                        {
                                            notification.orderId && (

                                                <small>
                                                    Order: #
                                                    {
                                                        notification.orderId
                                                            .slice(-8)
                                                    }
                                                </small>

                                            )
                                        }

                                    </div>

                                </div>

                            )
                        )
                    }

                </div>

            </div>

        </Layout>
    );
}

export default Notifications;