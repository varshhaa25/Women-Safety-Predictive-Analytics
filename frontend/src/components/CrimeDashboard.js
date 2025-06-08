import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const CrimeDashboard = () => {
  const [crimeData, setCrimeData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/all-crime-data/")
      .then((res) => res.json())
      .then((data) => setCrimeData(data))
      .catch((error) => console.error("Error fetching crime data:", error));
  }, []);

  // Prepare data for visualizations
  const neighborhoodCrimeCount = Object.values(
    crimeData.reduce((acc, crime) => {
      acc[crime.Neighbourhood] = acc[crime.Neighbourhood] || { name: crime.Neighbourhood, count: 0 };
      acc[crime.Neighbourhood].count += 1;
      return acc;
    }, {})
  );

  const crimeByHour = Object.values(
    crimeData.reduce((acc, crime) => {
      acc[crime.occurrencehour] = acc[crime.occurrencehour] || { hour: crime.occurrencehour, count: 0 };
      acc[crime.occurrencehour].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => a.hour - b.hour);

  const crimeByPremises = Object.values(
    crimeData.reduce((acc, crime) => {
      acc[crime.premisetype] = acc[crime.premisetype] || { name: crime.premisetype, value: 0 };
      acc[crime.premisetype].value += 1;
      return acc;
    }, {})
  );

  return (
    <div style={styles.dashboardContainer}>
      <h2 style={styles.title}>Crime Dashboard</h2>

      <div style={styles.metricsContainer}>
        <div style={styles.metricCard}><h4>Crime Reports</h4><p>{crimeData.length}</p></div>
        <div style={styles.metricCard}><h4>Neighbourhoods</h4><p>{neighborhoodCrimeCount.length}</p></div>
        <div style={styles.metricCard}><h4>Peak Crime Hour</h4><p>{crimeByHour.length > 0 ? crimeByHour[crimeByHour.length - 1].hour : "N/A"}</p></div>
      </div>

      <div style={styles.chartGrid}>
        <div style={styles.chartContainer}>
          <h3>Crime by Neighborhood</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={neighborhoodCrimeCount}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#009F92" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartContainer}>
          <h3>Crime Occurrence by Hour</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={crimeByHour}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#A7E0E1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.chartGrid}>
        <div style={styles.chartContainer}>
          <h3>Crime by Premises Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={crimeByPremises} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#1664A5" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    padding: "20px",
    backgroundColor: "#F5FFFA", // MintCream
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  metricsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  metricCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    flex: "1",
    margin: "0 10px",
  },
  chartGrid: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    flex: "1",
    margin: "10px",
    minWidth: "300px",
  },
};

export default CrimeDashboard;
