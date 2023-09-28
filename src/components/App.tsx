import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Clipboards from "./Clipboards";
import Login from "./Login";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(auth.currentUser);
  onAuthStateChanged(auth, () => {
    if (user === null) setUser(auth.currentUser);
  });

  const router = createBrowserRouter([
    {
      path: "/clipboards",
      element: <Clipboards user={user} />,
    },
    {
      path: "/",
      element: <Login user={user} setUser={setUser} />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
