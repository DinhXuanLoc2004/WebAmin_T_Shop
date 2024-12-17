import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faMoneyBill,
  faClock,
  faComment
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../Css/Dashboard.css";

export default function DashBoard() {
  const [users, setUsers] = useState({ user: 0 });
  const [order, setOrders] = useState({ order: 0 });
  const [products, setProducts] = useState([]);
  const [statistics, setStatistics] = useState({
    monthly: [],
    selectedMonthWeeks: [],
    selectedWeekDays: [],
  });

  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [activeChart, setActiveChart] = useState("monthly");

  const [customerStatistics, setCustomerStatistics] = useState([]);

  const [chartDataKey, setChartDataKey] = useState("total_orders");

  const dashBoardData = { user: 182, order: 400, sales: 31.109, pending: 48 };

  useEffect(() => {
    fetchDataUser();
    fetchOrderStatistics();
    fetchDataOrders();
    fetchProducts();
  }, []);

  const fetchOrderStatistics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/api/dashboard/order_statistics"
      );
      const { monthly_statistics, user_email_statistics } =
        response.data.metadata;

      setStatistics((prev) => ({ ...prev, monthly: monthly_statistics }));
      setCustomerStatistics(user_email_statistics || []); // Cập nhật danh sách khách hàng
      handleMonthSelection(1, monthly_statistics); // Chọn tháng đầu tiên mặc định
    } catch (error) {
      console.error("Error fetching order statistics:", error);
    }
  };

  const fetchDataUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/api/auth/get_all_users"
      );
      const userCount = response.data.metadata?.length || 0;
      setUsers({ user: userCount });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDataOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/api/order/get_all_orders"
      );
      const orderCount = response.data.metadata?.length || 0;
      setOrders({ order: orderCount });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/v1/api/product/get_all_products?get_top_trendings=50"
      );
      const productsData = response.data?.metadata?.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handleMonthSelection = (month, data) => {
    const monthData = data.find((m) => m.month === month);
    setSelectedMonth(month);
    setStatistics((prev) => ({
      ...prev,
      selectedMonthWeeks: monthData?.weeks || [],
    }));
    handleWeekSelection(1, monthData?.weeks || []); // Load first week initially
  };

  const handleWeekSelection = (week, data) => {
    const weekData = data.find((w) => w.week === week);
    setSelectedWeek(week);
    setStatistics((prev) => ({
      ...prev,
      selectedWeekDays: weekData?.days || [],
    }));
  };

  const handleChartClick = () => {
    setChartDataKey((prevKey) =>
      prevKey === "total_orders" ? "total_revenue" : "total_orders"
    );
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  return (
    <div className="container my-4">
      <div className="row mb-4">
        <StatCard
          title="Total Users"
          value={users.user}
          icon={faUser}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value={order.order}
          icon={faShoppingCart}
          color="warning"
        />
        <StatCard
          title="Total Sales"
          value={dashBoardData.sales}
          icon={faMoneyBill}
          color="success"
        />
        <StatCard
          title="Pending Orders"
          value={dashBoardData.pending}
          icon={faClock}
          color="danger"
        />
      </div>

      {/* Product List */}
      <h2 className="mb-4 text-center">Top Trending Products</h2>
      <div className="scroll-container">
        {products.map((product) => (
          <div
            key={product._id}
            className="card shadow-sm"
            style={{ minWidth: "250px", maxWidth: "250px", flex: "0 0 auto" }}
          >
            <img
              src={product.thumb}
              alt={product.name_product}
              className="card-img-top"
              style={{ height: "150px", objectFit: "cover" }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">{product.name_product}</h5>
              <p className="text-muted">⭐ {product.averageRating}</p>
              <p>
                <strong className="text-info">{product.name_brand}</strong> -{" "}
                <span className="text-danger">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price_max)}
                </span>
              </p>
              <p className="text-muted">
                Sold: {product.total_orders} products
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Customer List */}
      <h2 className="mt-5 mb-3 text-center">Top Customers</h2>
      <ul className="list-group">
        {customerStatistics.map((customer) => (
          <li
            key={customer.phone}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{customer.name}</strong> {customer.email}
              <br />
              <small className="text-muted">{customer.province_name}</small>
            </div>
            <div>
              <span className="badge bg-primary rounded-pill mb-1">
                Orders: {customer.total_orders}
              </span>
              <br />
              <span className="badge bg-success rounded-pill">
                Spent:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(customer.total_spent)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Monthly Chart */}
      <div className="mt-5">
        <h3 className="mb-4 text-center">Monthly Statistics</h3>
        <div className="mb-3">
          <label style={{marginRight: "10px"}}>Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) =>
              handleMonthSelection(Number(e.target.value), statistics.monthly)
            }
            style={{borderRadius: "5px"}}
          >
            {statistics.monthly.map((m) => (
              <option key={m.month} value={m.month}>
                Month {m.month} - {m.year}
              </option>
            ))}
          </select>
        </div>

        <ResponsiveContainer
          width="100%"
          height={400}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AreaChart
            data={statistics.selectedMonthWeeks}
            onClick={handleChartClick}
            margin={{ top: 30, right: 30, left: 30, bottom: 10 }}
          >
            <XAxis tickFormatter={(value) => `Tuần ${value}`} dataKey="week" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value, name) =>
                name === "total_revenue" ? formatCurrency(value) : value
              }
            />
            <Area
              type="monotone"
              dataKey={chartDataKey} // Thay đổi giữa total_orders và total_revenue
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Chart */}
      <div className="mt-5">
        <h3 className="mb-4 text-center">Weekly Statistics</h3>
        <div className="mb-3">
          <label>Select Week: </label>
          <select
            value={selectedWeek}
            onChange={(e) =>
              handleWeekSelection(
                Number(e.target.value),
                statistics.selectedMonthWeeks
              )
            }
          >
            {statistics.selectedMonthWeeks.map((w) => (
              <option key={w.week} value={w.week}>
                Week {w.week}
              </option>
            ))}
          </select>
        </div>

        <ResponsiveContainer
          width="100%"
          height={400}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AreaChart
            data={statistics.selectedWeekDays}
            onClick={handleChartClick}
            margin={{ top: 30, right: 30, left: 30, bottom: 10 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value, name) =>
                name === "total_revenue" ? formatCurrency(value) : value
              }
            />
            <Area
              type="monotone"
              dataKey={chartDataKey} // Thay đổi giữa total_orders và total_revenue
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Full Year Chart */}
      <div className="mt-5">
        <h3 className="mb-4 text-center">Yearly Statistics</h3>
        <ResponsiveContainer
          width="100%"
          height={400}
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AreaChart
            data={statistics.monthly}
            onClick={handleChartClick}
            margin={{ top: 30, right: 30, left: 30, bottom: 10 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value, name) =>
                name === "total_revenue" ? formatCurrency(value) : value
              }
            />
            <Area
              type="monotone"
              dataKey={chartDataKey} // Thay đổi giữa total_orders và total_revenue
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="col-md-3 mb-4">
      <div className={`card text-white bg-${color} shadow`}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">{title}</h5>
            <h2 className="card-text">{value}</h2>
          </div>
          <FontAwesomeIcon icon={icon} size="3x" />
        </div>
      </div>
    </div>
  );
}
