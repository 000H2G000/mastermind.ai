import { createHashRouter } from "react-router";
import HomePage from "./pages/home/home";
import DatabaseDemo from "./pages/database/DatabaseDemo";
import LandingPage from "./pages/landing/LandingPage";

export const routes = createHashRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/database",
    element: <DatabaseDemo />,
  },
]);
