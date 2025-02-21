// For example in App.tsx
import React, { useEffect } from "react";

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    window?.Telegram?.WebApp?.ready();
  }, []);

  return <div>Your App Content</div>;
};

export default App;
