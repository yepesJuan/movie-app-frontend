"use client";
import { useState, useEffect } from "react";

// Appsync limit is not merely based on items length, but on kb of data.
// https://github.com/aws-amplify/amplify-category-api/issues/1408
export function useResponsiveLimit() {
  const [limit, setLimit] = useState(8);

  useEffect(() => {
    const updateLimit = () => {
      if (window.innerWidth < 1024) {
        setLimit(6);
      } else {
        setLimit(8);
      }
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  return limit;
}
