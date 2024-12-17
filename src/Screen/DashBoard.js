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

import { color } from "chart.js/helpers";
import axios from "axios";
import ShowProductsContainer from "../component/ShowProductsContainer";
const DashboardContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #f4f4f4;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 50px;
  padding: 20px;
  flex: 1;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.h2`
  margin: 10px 0;
`;

const StatDescription = styled.p`
  color: grey;
  font-size: 14px;
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

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
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/v1/api/product/get_all_products"
        );

        const productsData = response.data?.metadata?.products || [];
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          console.warn("Dữ liệu sản phẩm không hợp lệ:", productsData);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
    fetchData();
  }, []);
  const customers = [
    { id: 1, name: "Nguyễn Văn A", purchaseCount: 15 },
    { id: 2, name: "Trần Thị B", purchaseCount: 12 },
    { id: 3, name: "Lê Văn C", purchaseCount: 10 },
    // Thêm các khách hàng khác
  ];

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
