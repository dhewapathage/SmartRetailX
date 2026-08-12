import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import productApi from "../services/productApi";

function AdminProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        sku: "",
        active: true
    });


    const fetchProducts = async () => {

        try {

            const response =
                await productApi.get("/products");

            setProducts(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchProducts();

    }, []);


    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setFormData({

            ...formData,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    };


    const openAddModal = () => {

        setEditingProduct(null);

        setFormData({
            name: "",
            description: "",
            category: "",
            price: "",
            sku: "",
            active: true
        });

        setShowModal(true);
    };


    const openEditModal = (product) => {

        setEditingProduct(product);

        setFormData({
            name:
                product.name || "",

            description:
                product.description || "",

            category:
                product.category || "",

            price:
                product.price || "",

            sku:
                product.sku || "",

            active:
                product.active
        });

        setShowModal(true);
    };


    const closeModal = () => {

        setShowModal(false);
        setEditingProduct(null);
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            const payload = {

                name:
                    formData.name,

                description:
                    formData.description,

                category:
                    formData.category,

                price:
                    Number(formData.price),

                sku:
                    formData.sku,

                active:
                    formData.active
            };


            if (editingProduct) {

                await productApi.put(
                    `/products/${editingProduct._id}`,
                    payload
                );

            } else {

                await productApi.post(
                    "/products",
                    payload
                );
            }


            closeModal();

            await fetchProducts();


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Product operation failed"
            );
        }
    };


    const deleteProduct = async (product) => {

        const confirmed =
            window.confirm(
                `Delete ${product.name}?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await productApi.delete(
                `/products/${product._id}`
            );

            await fetchProducts();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };


    return (

        <Layout>

            <div className="page-container">


                <div className="hero-section">

                    <div>

                        <p className="eyebrow">
                            ADMINISTRATION
                        </p>

                        <h1>
                            Product Management
                        </h1>

                        <p className="hero-text">
                            Manage products available
                            through SmartRetailX.
                        </p>

                    </div>

                </div>


                <div className="admin-toolbar">

                    <div>

                        <h2>
                            Products
                        </h2>

                        <p>
                            {products.length} products
                        </p>

                    </div>


                    <button
                        className="primary-button"
                        onClick={openAddModal}
                    >
                        + Add Product
                    </button>

                </div>


                {
                    error && (

                        <div className="alert error-alert">
                            {error}
                        </div>

                    )
                }


                {
                    loading ? (

                        <div className="empty-state">
                            Loading products...
                        </div>

                    ) : (

                        <div className="admin-product-list">

                            {
                                products.map(
                                    (product) => (

                                        <div
                                            className="admin-product-row"
                                            key={product._id}
                                        >

                                            <div className="admin-product-main">

                                                <div className="admin-product-avatar">

                                                    {
                                                        product.name
                                                            ?.charAt(0)
                                                            .toUpperCase()
                                                    }

                                                </div>


                                                <div>

                                                    <strong>
                                                        {product.name}
                                                    </strong>

                                                    <p>
                                                        {product.category}
                                                        {" • "}
                                                        {product.sku}
                                                    </p>

                                                </div>

                                            </div>


                                            <div className="admin-product-price">

                                                LKR{" "}

                                                {
                                                    Number(
                                                        product.price
                                                    ).toLocaleString()
                                                }

                                            </div>


                                            <span
                                                className={
                                                    product.active
                                                        ? "status confirmed"
                                                        : "status cancelled"
                                                }
                                            >
                                                {
                                                    product.active
                                                        ? "ACTIVE"
                                                        : "INACTIVE"
                                                }
                                            </span>


                                            <div className="admin-actions">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        openEditModal(product)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteProduct(product)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }


                {
                    showModal && (

                        <div className="modal-overlay">

                            <div className="admin-modal">

                                <div className="modal-header">

                                    <div>

                                        <p className="eyebrow">
                                            {
                                                editingProduct
                                                    ? "EDIT PRODUCT"
                                                    : "NEW PRODUCT"
                                            }
                                        </p>

                                        <h2>
                                            {
                                                editingProduct
                                                    ? "Update Product"
                                                    : "Add Product"
                                            }
                                        </h2>

                                    </div>


                                    <button
                                        className="close-button"
                                        onClick={closeModal}
                                    >
                                        ×
                                    </button>

                                </div>


                                <form
                                    onSubmit={handleSubmit}
                                    className="admin-form"
                                >

                                    <label>
                                        Product Name
                                    </label>

                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />


                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={handleChange}
                                    />


                                    <label>
                                        Category
                                    </label>

                                    <input
                                        name="category"
                                        value={
                                            formData.category
                                        }
                                        onChange={handleChange}
                                        required
                                    />


                                    <label>
                                        Price
                                    </label>

                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />


                                    <label>
                                        SKU
                                    </label>

                                    <input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        required
                                    />


                                    <label className="checkbox-row">

                                        <input
                                            name="active"
                                            type="checkbox"
                                            checked={
                                                formData.active
                                            }
                                            onChange={handleChange}
                                        />

                                        Active Product

                                    </label>


                                    <div className="modal-buttons">

                                        <button
                                            type="button"
                                            className="secondary-button"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="primary-button"
                                        >
                                            {
                                                editingProduct
                                                    ? "Save Changes"
                                                    : "Add Product"
                                            }
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    )
                }

            </div>

        </Layout>
    );
}


export default AdminProducts;