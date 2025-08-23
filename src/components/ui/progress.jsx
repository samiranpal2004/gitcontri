import { useState, useEffect } from "react";

function Progress({ value, max = 100, className = "", ...props }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the progress bar
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-full bg-secondary h-4 ${className}`}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${(progress / max) * 100}%` }}
      />
    </div>
  );
}

export { Progress };
