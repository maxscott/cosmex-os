import { useState } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
      <p className="mt-4 text-lg">Count: {count}</p>
    </div>
  );
}

export default App;
