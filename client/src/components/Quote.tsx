import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { quotes } from "@shared/schema";

export function Quote() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate quotes every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(current => (current + 1) % quotes.length);
    }, 5 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuote = quotes[quoteIndex];

  return (
    <div className="max-w-md text-center">
      <p className="text-sm italic text-muted-foreground">"{currentQuote.text}"</p>
      <p className="text-xs mt-1">— {currentQuote.author}</p>
    </div>
  );
}