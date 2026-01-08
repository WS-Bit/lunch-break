import { useEffect, useState } from "react";
import "./App.css";

type Page = "coffee" | "lunch";

function App() {
  const [page, setPage] = useState<Page>("coffee");
  const [buttonsVisible, setButtonsVisible] = useState(true);

  // Prevent screen sleep
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async (): Promise<void> => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch (err) {
        console.error("Wake Lock failed:", err);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLock) wakeLock.release();
    };
  }, []);

  // Button fade logic
  useEffect(() => {
    const hideTimeout = setTimeout(() => setButtonsVisible(false), 5000);

    const handleMouseMove = () => setButtonsVisible(true);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(hideTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [buttonsVisible, page]);

  return (
    <div className="container">
      {/* Buttons */}
      <div className={`buttons ${buttonsVisible ? "visible" : "hidden"}`}>
        <button onClick={() => setPage("coffee")}>Coffee Break</button>
        <button onClick={() => setPage("lunch")}>Lunch Break</button>
      </div>

      {/* Page content */}
      {page === "coffee" && (
        <>
          <h1>Coffee Break</h1>
          <p>The Admin Team are currently on a coffee break and will be back soon</p>
        </>
      )}

      {page === "lunch" && (
        <>
          <h1>Lunch Break</h1>
          <p>The Admin Team are currently on a lunch break and will be back soon</p>
        </>
      )}
    </div>
  );
}

export default App;
