import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faMoneyBill,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../helper/axiosIntercreptor";
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
  const data = [
    { month: "January", sales: 80 },
    { month: "February", sales: 20 },
    { month: "March", sales: 90 },
    { month: "April", sales: 10 },
    { month: "May", sales: 60 },
    { month: "June", sales: 50 },
    { month: "July", sales: 70 },
    { month: "August", sales: 60 },
    { month: "September", sales: 100 },
    { month: "October", sales: 80 },
    { month: "November", sales: 90 },
    { month: "December", sales: 45 },
  ];

  const dashBoardData = { user: 182, order: 400, sales: 31.109, pending: 48 };
  
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post("/product/get_all_products");
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
  ];

  return (
    <DashboardContainer>
      <StatsContainer>
        <StatCard>
          <div
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div>
              <StatDescription style={styles.title}>Total User</StatDescription>
              <StatNumber>{dashBoardData.user}</StatNumber>
            </div>
            <div style={{ ...styles.iconView, backgroundColor: "#FFCCFF	" }}>
              <FontAwesomeIcon
                style={{ ...styles.icon, color: "#CC99FF" }}
                icon={faUser}
              />
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div>
              <StatDescription style={styles.title}>
                Total Orders
              </StatDescription>
              <StatNumber>{dashBoardData.order}</StatNumber>
            </div>
            <div style={{ ...styles.iconView, backgroundColor: "#FFFF66	" }}>
              <FontAwesomeIcon
                style={{ ...styles.icon, color: "#FEC53D" }}
                icon={faShoppingCart}
              />
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div>
              <StatDescription style={styles.title}>
                Total Sales
              </StatDescription>
              <StatNumber>{dashBoardData.sales}</StatNumber>
            </div>
            <div style={{ ...styles.iconView, backgroundColor: "#CCFFCC" }}>
              <FontAwesomeIcon
                style={{ ...styles.icon, color: "#4AD991" }}
                icon={faMoneyBill}
              />
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div>
              <StatDescription style={styles.title}>
                Total Pending
              </StatDescription>
              <StatNumber>{dashBoardData.pending}</StatNumber>
            </div>
            <div style={{ ...styles.iconView, backgroundColor: "#66FFCC	" }}>
              <FontAwesomeIcon
                style={{ ...styles.icon, color: "#FF9066" }}
                icon={faClock}
              />
            </div>
          </div>
        </StatCard>
      </StatsContainer>
      <div style={styles.screen}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <h2 style={styles.title_saleoff}>Các sản phẩm bán chạy</h2>
          <img
            style={styles.saleOff_icon}
            src="https://batdongsan24h.s3-ap-southeast-1.amazonaws.com/Buysell/2022/12/17/133157198984883145-20200910100355-44a4-wm.png"
            alt="Sale Off Icon"
          />
        </div>
        <div style={styles.container}>
          <div style={styles.productList}>
            {products.map((product) => (
              <div
                key={product._id}
                style={styles.productCard}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={product.thumb}
                  alt={product.name}
                  style={styles.image}
                />
                <h3 style={styles.name}>{product.name_product}</h3>
                <p style={styles.rating}>⭐ {product.averageRating}</p>

                {/* <p style={styles.category}>{product.name_category}</p> */}
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    justifySelf: "center",
                    gap: 50,
                  }}
                >
                  <p style={styles.brand}>{product.name_brand}</p>
                  <p style={styles.price}>{product.price_max}$</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 style={styles.title_customers}>
          Danh sách các khách hàng mua nhiều
        </h2>
        <div style={styles.customerList}>
          {customers.map((customer) => (
            <div key={customer.id} style={styles.customerItem}>
              <p style={styles.customerName}>{customer.name}</p>
              <p style={styles.customerPurchases}>
                Số lượng mua: {customer.purchaseCount}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ChartContainer>
        <h3>Sales Details</h3>
        <ResponsiveContainer width="100%" height={700}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="linear"
              dataKey="sales"
              stroke="#FF0000"
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </DashboardContainer>
  );
}

const styles = {
  icon: {
    height: 40,
    width: 40,
    color: "white",
  },
  iconView: {
    height: 55,
    width: 55,
    borderRadius: "30%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginLeft: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    color: "#202224",
    fontWeight: 500,
  },
  screen: {
    marginTop: 20,
    padding: 20,
    border: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  containerShowProducts: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 20,
    width: "100%",
  },
  title_saleoff: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 30,
    color: "#333",
  },
  saleOff_icon: {
    height: 100,
    width: 120,
    marginLeft: 10,
    marginBottom: 10,
    marginLeft: 30,
    color: "#FF9933",
  },
  title_customers: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  customerList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  },
  customerItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
  customerName: {
    fontWeight: "bold",
  },
  customerPurchases: {
    color: "grey",
  },
  thTd: {
    textAlign: "center",
    padding: "10px 15px",
    fontWeight: "normal",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    color: "#555",
  },
  thTdTable: {
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "180px",
    padding: "10px 50px",
    fontSize: "14px",
    color: "#333",
  },

  container: {
    fontFamily: "'Arial', sans-serif",
    maxWidth: "100%",
    marginLeft: 25,
    overflowX: "auto", // Cho phép cuộn ngang
    whiteSpace: "nowrap", // Không cho xuống dòng
  },
  productCard: {
    display: "inline-block", // Cần để các sản phẩm nằm ngang
    border: "1px solid #ddd",
    borderRadius: "10px",
    width: "250px",
    padding: "15px",
    textAlign: "center",
    marginRight: "30px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
  },
  productCardHover: {
    transform: "scale(1.05)",
  },
  image: {
    width: 200,
    height: 300,
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  name: {
    fontSize: "25px",
    fontWeight: "600",
    margin: "10px 0",
    color: "#444",
  },
  category: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "10px",
  },
  brand: {
    fontSize: "20px",
    color: "black",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#E91E63",
    marginBottom: "10px",
  },
  rating: {
    fontSize: "14px",
    color: "#FFD700",
  },
};
