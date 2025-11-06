import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    mobile: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://api-ums.onebigbit.com/adminusers/unified_otp_login",
        {
          username: form.username,
          mobile: form.mobile,
          otp: form.otp,
        }
      );

      const d = res.data ?? {};
      let token =
        d.token ||
        d.data?.token ||
        d.access_token ||
        d.data?.access_token ||
        d.data?.accessToken ||
        d.data?.session?.token ||
        d.user?.token ||
        d.data?.user?.token ||
        res.headers?.authorization ||
        res.headers?.Authorization ||
        null;

      if (typeof token === "string" && token.toLowerCase().startsWith("bearer ")) {
        token = token.split(" ")[1];
      }

      const userObj = d.data?.user || d.user || d.data || null;
      if (userObj) {
        localStorage.setItem("user", JSON.stringify(userObj));
      }

      if (token) {
        localStorage.setItem("token", token);
        alert("Login Successful!");
        navigate("/dashboard");
        return;
      }

      const apiMessage = d.message || d.data?.message || "Login returned no token.";
      setError(apiMessage + " — contact support if this persists.");
      return;
    } catch (err) {
      const apiMsg = err.response?.data?.message || err.response?.data || err.message;
      setError(`Login failed: ${apiMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0063af] to-[#0063af] font-[Poppins]">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-bold text-center text-[#0063af] mb-3">
          University Login
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Sign in to access your AI-powered project recommendations
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="e.g., 2400100001"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056D2] focus:outline-none"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile
            </label>
            <input
              type="text"
              value={form.mobile}
              onChange={(e) => {
                let value = e.target.value;
                if (!value.startsWith("+91")) {
                  value = "+91" + value.replace(/^\+?91/, "");
                }
                setForm({ ...form, mobile: value });
              }}
              placeholder="+91-9876543212"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056D2] focus:outline-none"
              required
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              placeholder="Enter OTP"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056D2] focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0056D2] text-white py-3 rounded-lg font-semibold hover:bg-[#004bb5] transition duration-200 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg border border-red-100">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Need help?{" "}
          <a href="/contact" className="text-[#0056D2] hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
