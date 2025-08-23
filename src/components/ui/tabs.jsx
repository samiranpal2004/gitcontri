import React, { createContext, useContext, useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext({});

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
}

const Tabs = React.forwardRef(
  ({ className, defaultValue, value, onValueChange, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = useState(value || defaultValue);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleValueChange = (newValue) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider
        value={{ selectedValue, onValueChange: handleValueChange }}
      >
        <div ref={ref} className={cn("", className)} {...props} />
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, ...props }, ref) => {
  const { selectedValue, onValueChange } = useTabsContext();

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        selectedValue === value
          ? "bg-background text-foreground shadow-sm"
          : "hover:bg-background/50 hover:text-foreground",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => {
  const { selectedValue } = useTabsContext();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
