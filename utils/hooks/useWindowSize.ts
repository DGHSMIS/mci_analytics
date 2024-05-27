import { useEffect, useState } from "react";

// Custom hook to get and update window size
function useWindowSize() {
  // Initialize state with current screen dimensions
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Function to update screen dimensions
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Add event listener on component mount and remove on unmount
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleanup on unmount

  return windowSize;
}

export default useWindowSize;
