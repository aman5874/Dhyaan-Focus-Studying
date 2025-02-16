import { useState, useEffect } from "react";
import { quotes } from "@shared/schema";

export function Quote() {
  // Get a random quote index on initial render
  const [quoteIndex, setQuoteIndex] = useState(() => 
    Math.floor(Math.random() * quotes.length)
  );

  // Rotate quotes every 5 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(current => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * quotes.length);
        } while (newIndex === current && quotes.length > 1);
        return newIndex;
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuote = quotes[quoteIndex];

  return (
    <div className="max-w-[90vw] sm:max-w-md text-center px-4 sm:px-0">
      <p className="text-xs sm:text-sm italic text-muted-foreground">"{currentQuote.text}"</p>
      <p className="text-xs mt-1">— {currentQuote.author}</p>
    </div>
  );
}