// For example in App.tsx
import React, { useEffect } from "react";

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      console.log("Telegram WebApp is available:", window.Telegram.WebApp);
      window.Telegram.WebApp.ready();
    } else {
      console.error("Telegram WebApp is not available!");
    }
  }, []);

  const testConnection = () => {
    const testPayload = JSON.stringify({ test: "hello from mini app" });
    window.Telegram.WebApp.sendData(testPayload);
    console.log("Test data sent:", testPayload);
  };

  return (
    <div>
      Your App Content
      <button onClick={testConnection}>Test Connection</button>
    </div>
  );
};

export default App;
