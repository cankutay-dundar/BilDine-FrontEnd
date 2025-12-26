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

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>📄 Daily Report</h2>

      {loading && <p>Loading report...</p>}

      {!loading && error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && !report && <p>No report available for today.</p>}

      {!loading && report && <p>{report}</p>} {/* display single string */}
    </div>
  );
}

export default Report;
