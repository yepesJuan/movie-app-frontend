"use client";
import { useState, useEffect } from "react";

// Appsync limit is not merely based on items length, but on kb of data.
// out of scope for this project but we could expirment using a GSI... https://github.com/aws-amplify/amplify-category-api/issues/1408
export function useResponsiveLimit() {
  const [limit, setLimit] = useState(11);

  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth < 1024) {
        setLimit(7);
      } else {
        setLimit(11);
      }
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  return limit;
}
