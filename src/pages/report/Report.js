import { useEffect, useState } from "react";
import { getDailyReport } from "../../api/reportApi";

function Report() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const today = new Date().toISOString().split("T")[0];
      const data = await getDailyReport(today);
      setReport(data);
    } catch (err) {
      console.error("Failed to load report:", err);
      setError("Failed to load report");
      setReport("");
    } finally {
      setLoading(false);
    }
  };

  const parseReport = (reportStr) => {
    if (!reportStr) return null;
    // Format: "Daily Report 2025-12-26\nTotal revenue: 1620.00₺\nOrders: 10\nStaff hours: 88.0h\nOvertime: 0.0h"
    const lines = reportStr.split("\n");
    const dateLine = lines[0] || "";
    const revenueLine = lines[1] || "";
    const ordersLine = lines[2] || "";
    const hoursLine = lines[3] || "";
    const overtimeLine = lines[4] || "";

    return {
      date: dateLine.replace("Daily Report ", ""),
      revenue: revenueLine.replace("Total revenue: ", ""),
      orders: ordersLine.replace("Orders: ", ""),
      hours: hoursLine.replace("Staff hours: ", ""),
      overtime: overtimeLine.replace("Overtime: ", "")
    };
  };

  const data = parseReport(report);

  const handlePrintReport = () => {
    if (!data) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daily Report - ${data.date}</title>
        <style>
          @media print {
            @page { margin: 1cm; }
            body { margin: 0; }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5rem;
          }
          .date {
            text-align: center;
            color: #7f8c8d;
            font-size: 1.2rem;
            margin-bottom: 40px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-top: 40px;
          }
          .stat-card {
            border: 2px solid #ecf0f1;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            background: #f8f9fa;
          }
          .stat-icon {
            font-size: 3rem;
            margin-bottom: 15px;
          }
          .stat-title {
            font-size: 1rem;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .stat-value {
            font-size: 2.2rem;
            font-weight: bold;
            color: #2c3e50;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #95a5a6;
            font-size: 0.9rem;
            border-top: 1px solid #ecf0f1;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>📊 Daily Report</h1>
        <div class="date">Report Date: ${data.date}</div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-title">Total Revenue</div>
            <div class="stat-value">${data.revenue}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-title">Total Orders</div>
            <div class="stat-value">${data.orders}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-title">Staff Hours</div>
            <div class="stat-value">${data.hours}</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">⚠️</div>
            <div class="stat-title">Overtime</div>
            <div class="stat-value">${data.overtime}</div>
          </div>
        </div>
        
        <div class="footer">
          Generated on ${new Date().toLocaleString()} | BilDine Restaurant Management System
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{
          textAlign: "center",
          flex: 1,
          color: "#333",
          fontSize: "2rem",
          margin: 0
        }}>
          📊 Daily Report
        </h2>

        {data && (
          <button
            onClick={handlePrintReport}
            style={{
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#2980b9";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#3498db";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            🖨️ Print Report
          </button>
        )}
      </div>

      {loading && <div style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>Loading report...</div>}

      {!loading && error && <div style={{ textAlign: "center", color: "#e74c3c", fontSize: "1.2rem" }}>{error}</div>}

      {!loading && !error && !report && <div style={{ textAlign: "center", color: "#7f8c8d" }}>No report available for today.</div>}

      {!loading && data && (
        <div>
          <div style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "1.2rem",
            color: "#555",
            letterSpacing: "0.5px"
          }}>
            📅 Report Date: <strong>{data.date}</strong>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            {/* Revenue Card */}
            <StatCard
              title="Total Revenue"
              value={data.revenue}
              icon="💰"
              color="#2ecc71"
              bgColor="#eafaf1"
            />

            {/* Orders Card */}
            <StatCard
              title="Total Orders"
              value={data.orders}
              icon="📦"
              color="#3498db"
              bgColor="#ebf5fb"
            />

            {/* Staff Hours Card */}
            <StatCard
              title="Staff Hours"
              value={data.hours}
              icon="⏱️"
              color="#9b59b6"
              bgColor="#f5eef8"
            />

            {/* Overtime Card */}
            <StatCard
              title="Overtime"
              value={data.overtime}
              icon="⚠️"
              color="#e67e22"
              bgColor="#fef5e7"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }) {
  return (
    <div style={{
      backgroundColor: bgColor,
      border: `1px solid ${color}40`, // low opacity border
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease"
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{icon}</div>
      <div style={{ fontSize: "1rem", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>{title}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: color }}>{value}</div>
    </div>
  );
}

export default Report;
