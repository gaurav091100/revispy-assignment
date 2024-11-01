import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Loader from './components/Loader';
import Home from './pages/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Layout from './components/Layout';
import VerifyMail from './pages/verifyMail/VerfiyMail';
import Categories from './pages/Categories/Categories';
import ProtectedRoute from './route/ProtetctedRoute';

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    loader: Loader,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: Loader,
      },{
        path: "/login",
        element: <Login />,
        loader: Loader,
        children: [
        ],
      },
      {
        path: "/register",
        element: <Register />,
        loader: Loader,
        children: [
        ],
      },
      {
        path: "/verify-email/:emailId",
        element: <VerifyMail />,
        loader: Loader,
        children: [
        ],
      },
      {
        path: "/categories",
        element: <ProtectedRoute>
          <Categories />
        </ProtectedRoute>,
        loader: Loader,
        children: [
        ],
      },
    ],
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
