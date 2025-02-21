import { useEffect, useState } from "react";

const tele = window.Telegram.WebApp;
function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    tele.ready();
    const userData = tele.initDataUnsafe;
    if (userData) {
      setUser(userData);
    }
  }, [setUser]);
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>My Telegram Mini App lol</h1>
      <p>user: {JSON.stringify(user)}</p>
      {user ? (
        <div>
          <p>
            Welcome, {user.first_name} {user.last_name || ""}!
          </p>
          <p>User ID: {user.id}</p>
          {user.username && <p>Username: @{user.username}</p>}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}

export default App;
