import { useEffect } from "react";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (document.activeElement?.tagName === "INPUT" || 
          document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "t":
          // Toggle timer/clock
          document.querySelector("[data-timer-toggle]")?.click();
          break;
        case "n":
          // Focus new task input
          document.querySelector("[data-new-task]")?.focus();
          break;
        case "m":
          // Stop all sounds
          document.querySelector("[data-stop-sounds]")?.click();
          break;
        case "r":
          // Random sound mix
          document.querySelector("[data-random-mix]")?.click();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
}
