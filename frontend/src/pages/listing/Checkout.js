import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price,
  );

function Checkout() {
  const { id } = useParams(); // listingId
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    country: "Vietnam",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await api.get(`/listings/${id}`);
      setListing(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = 30000;
  const subtotal = listing ? listing.pricing.fixedPrice * quantity : 0;
  const total = subtotal + shippingCost;

  const handleSubmit = async () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city
    ) {
      setError("Vui lòng điền đầy đủ địa chỉ giao hàng");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/orders", {
        listingId: id,
        quantity,
        paymentMethod,
        shippingAddress: address,
      });
      navigate(`/orders/${res.data._id}?success=true`);
    } catch (err) {
      setError(err.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="h-96 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );

  if (!listing) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Form */}
          <div className="flex flex-col gap-4">
            {/* Shipping address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                📦 Shipping Address
              </h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Full name *"
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Phone number *"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Street address *"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                💳 Payment Method
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { value: "COD", label: "💵 Cash on Delivery (COD)" },
                  { value: "bank_transfer", label: "🏦 Bank Transfer" },
                  { value: "paypal", label: "🅿️ PayPal (Simulated)" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition ${
                      paymentMethod === method.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                🛍️ Order Summary
              </h2>

              {/* Product */}
              <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {listing.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {listing.subtitle}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-2">
                    {formatPrice(listing.pricing.fixedPrice)}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(listing.totalQuantity, q + 1))
                    }
                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="flex flex-col gap-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({quantity} item{quantity > 1 ? "s" : ""})
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-1">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-full font-semibold text-sm mt-6 transition"
              >
                {submitting ? "Placing order..." : "Place Order"}
              </button>

              <Link to={`/listing/${id}`}>
                <button className="w-full border border-gray-300 text-gray-600 py-3 rounded-full text-sm mt-2 hover:bg-gray-50 transition">
                  Back to listing
                </button>
              </Link>
            </div>

            {/* Seller info */}
            <div className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-1">Sold by</p>
              <p className="text-blue-600">{listing.sellerId?.username}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
