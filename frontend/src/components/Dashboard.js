import React, { useEffect, useState } from "react";
import axios from "axios";
import RiskMap from "./RiskMap";
import { Link } from "react-router-dom";
import image1 from "./image2.png";

const Dashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");
  const [inputData, setInputData] = useState({
    latitude: "",
    longitude: "",
    Neighbourhood: "",
    occurrencehour: "",
    occurrencedayofweek: "",
    premisetype: "",
  });

  const [voiceStatus, setVoiceStatus] = useState("🎙️ Voice Detection Active");
  const [recordedAudio, setRecordedAudio] = useState(null);

  useEffect(() => {
    startVoiceDetection();
  }, []);

  const startVoiceDetection = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setVoiceStatus("⚠️ Voice Detection Not Supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Detected Speech:", transcript);

      if (transcript.includes("help") || transcript.includes("danger")) {
        setVoiceStatus("🚨 Emergency Alert Sent!");
        alert("🚨 Emergency Alert Sent!");

        try {
          const response = await axios.post("http://localhost:8000/api/record-voice/");
          if (response.data.status === "success") {
            setRecordedAudio(`http://localhost:8000${response.data.audio_file}`);
          }
        } catch (error) {
          console.error("Error fetching audio file!", error);
        }
      }
    };
  };

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/predict-crime/", inputData)
      .then((response) => {
        console.log("Prediction Response:", response.data);
        setPredictions([...predictions, response.data]);
        setError("");
      })
      .catch((error) => {
        console.error("Error Predicting Crime:", error.response ? error.response.data : error.message);
        setError("Prediction failed. Please check your input values.");
      });
  };

  return (
    <div style={styles.container}>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <ul style={styles.navList}>
          <li><Link to="/" style={styles.navLink}>Home</Link></li>
          <li><Link to="/risk-map" style={styles.navLink}>Crime Risk Map</Link></li>
          <li><Link to="/crime-dashboard" style={styles.navLink}>Crime Dashboard</Link></li>
        </ul>
      </nav>

      <h1 style={styles.heading}>WOMEN SAFETY ANALYTICS DASHBOARD</h1>
      <h3 style={{ color: "blue", textAlign: "center" }}>{voiceStatus}</h3>

      {/* Crime Prediction Form */}
      <div style={styles.formContainer}>
        <h2>Predict Crime Type & Risk Level</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="latitude" placeholder="Latitude" value={inputData.latitude} onChange={handleChange} required style={styles.input} />
          <input type="text" name="longitude" placeholder="Longitude" value={inputData.longitude} onChange={handleChange} required style={styles.input} />
          <input type="text" name="Neighbourhood" placeholder="Neighbourhood" value={inputData.Neighbourhood} onChange={handleChange} required style={styles.input} />
          <input type="number" name="occurrencehour" placeholder="Hour (0-23)" value={inputData.occurrencehour} onChange={handleChange} required style={styles.input} />
          <input type="text" name="occurrencedayofweek" placeholder="Day of the week" value={inputData.occurrencedayofweek} onChange={handleChange} required style={styles.input} />
          <input type="text" name="premisetype" placeholder="Premise Type" value={inputData.premisetype} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button}>Predict Crime</button>
        </form>
      </div>

      {/* Error Message */}
      {error && <h3 style={styles.error}>{error}</h3>}

      {/* Prediction Result */}
      {predictions.length > 0 && (
        <div style={styles.predictionBox}>
          <h2>Latest Prediction</h2>
          <h3>Predicted Crime Type: {String(predictions[predictions.length - 1].crime_type)}</h3>
          <h3>Estimated Crime Rate: {String(predictions[predictions.length - 1].crime_rate_percentage)}%</h3>
          <h3>
            Risk Level:{" "}
            <span
              style={{
                color:
                  predictions[predictions.length - 1].risk_level === "High"
                    ? "red"
                    : predictions[predictions.length - 1].risk_level === "Medium"
                    ? "orange"
                    : "green",
              }}
            >
              {String(predictions[predictions.length - 1].risk_level)}
            </span>
          </h3>
        </div>
      )}

      {/* Display Risk Level Map */}
      {predictions.length > 0 && <RiskMap predictions={predictions} />}

      {/* Emergency Recording Playback */}
      {recordedAudio && (
        <div style={styles.audioContainer}>
          <h2>Emergency Recording</h2>
          <audio controls>
            <source src={recordedAudio} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

// Styles for UI components
const styles = {
  container: {
    backgroundImage: `url(${image1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  navbar: {
    position: "absolute",
    top: "10px",
    right: "20px",
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    gap: "15px",
  },
  navLink: {
    textDecoration: "none",
    fontSize: "18px",
    color: "black",
    fontWeight: "bold",
  },
  heading: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "50px",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "20px",
    width: "350px",
    margin: "auto",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid gray",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "10px",
  },
  predictionBox: {
    backgroundColor: "white",
    padding: "15px",
    width: "350px",
    margin: "20px auto",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  audioContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
};

export default Dashboard;
