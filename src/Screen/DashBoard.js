import React from "react";
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
  defs,
  linearGradient,
} from "recharts";
import { color } from "chart.js/helpers";

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
            <div style={{...styles.iconView,backgroundColor:"#FFCCFF	"}}>
              <FontAwesomeIcon style={{...styles.icon,color:"#CC99FF"}} icon={faUser} />
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
              <StatDescription style={styles.title}>Total Orders</StatDescription>
              <StatNumber>{dashBoardData.order}</StatNumber>
            </div>
            <div style={{...styles.iconView,backgroundColor:"#FFFF66	"}}>
              <FontAwesomeIcon style={{...styles.icon,color:"#FEC53D"}} icon={faShoppingCart} />
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
              <StatDescription style={styles.title}>Total Sales</StatDescription>
              <StatNumber>{dashBoardData.sales}</StatNumber>
            </div>
            <div style={{...styles.iconView,backgroundColor:"#CCFFCC"}}>
              <FontAwesomeIcon style={{...styles.icon,color:"#4AD991"}} icon={faMoneyBill} />
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
              <StatDescription style={styles.title}>Total Pending</StatDescription>
              <StatNumber>{dashBoardData.pending}</StatNumber>
            </div>
            <div style={{...styles.iconView,backgroundColor:"#66FFCC	"}}>
              <FontAwesomeIcon style={{...styles.icon,color:"#FF9066"}} icon={faClock} />
            </div>
          </div>
        </StatCard>
      </StatsContainer>

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
    marginBottom:10
  },
  title:{
    fontSize:25,
    color:"#202224",
    fontWeight:500
  }
};
