import { useEffect, useState } from "react";

// Type the Telegram WebApp object minimally for now
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
  };
  ready: () => void;
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const tele = window.Telegram?.WebApp;

function App() {
  const [user, setUser] = useState<any>(null);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    if (!tele) {
      console.error(
        "Telegram WebApp is not available. Are you outside Telegram?"
      );
      return;
    }

    console.log("Full Telegram Object:", tele);
    console.log("initData:", tele.initData);
    console.log("initDataUnsafe:", tele.initDataUnsafe);

    tele.ready(); // Signal that the app is ready
    setIsTelegram(true);

    const userData = tele.initDataUnsafe?.user;
    if (userData) {
      console.log("User Data Found:", userData);
      setUser(userData);
    } else {
      console.warn("No user data in initDataUnsafe");
    }

    // Add a Main Button for testing
    tele.MainButton.setText("Test Button");
    tele.MainButton.show();
    tele.MainButton.onClick(() => {
      alert("Button works!");
    });
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>My Telegram Mini App</h1>
      {isTelegram ? (
        user ? (
          <div>
            <p>
              Welcome, {user.first_name} {user.last_name || ""}!
            </p>
            <p>User ID: {user.id}</p>
            {user.username && <p>Username: @{user.username}</p>}
            <p>Raw User Data: {JSON.stringify(user)}</p>
          </div>
        ) : (
          <p>No user data available. Check console logs.</p>
        )
      ) : (
        <p>This app must be run inside Telegram.</p>
      )}
    </div>
  );
}

export default App;
