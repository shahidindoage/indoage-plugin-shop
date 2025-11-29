// components/FullPageLoader.js
"use client";

export default function FullPageLoader({ text = "Loading..." }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.loaderWrapper}>
        <div style={styles.spinner}></div>
        <p style={styles.text}>{text}</p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  spinner: {
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #0070f3",
    borderRadius: "50%",
    width: 50,
    height: 50,
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 500,
    color: "#0070f3",
  },
};

// In globals.css
/*
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/
