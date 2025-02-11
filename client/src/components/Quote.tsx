
import { useQuery } from "@tanstack/react-query";
import { quotes } from "@shared/schema";

export function Quote() {
  const { data: randomQuote } = useQuery({
    queryKey: ["/api/quotes", Math.random()], // Add random key to force refresh
    queryFn: () => {
      return quotes[Math.floor(Math.random() * quotes.length)];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  if (!randomQuote) return null;

  return (
    <div className="max-w-md text-center">
      <p className="text-sm italic text-muted-foreground">"{randomQuote.text}"</p>
      <p className="text-xs mt-1">— {randomQuote.author}</p>
    </div>
  );
}
