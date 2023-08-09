import './App.css';
import Error from './component/pages/ErrorPage';
import AboutPage from './component/pages/AboutPage'
import ContactPage from './component/pages/ContactPage'
import HomePage from './component/pages/HomePage';
import Header from './component/common/Header';
import Footer from './component/common/Footer'
import Login from './component/pages/Login';
import Signup from './component/pages/Signup';
import VerifyEmail from './component/pages/VerifyEmail';
import ForgotPassword from './component/pages/ForgotPassword';
import UpdatePassword from './component/pages/UpdatePassword';
import MyProfile from './component/core/dashboard/MyProfile';
import Settings from './component/core/dashboard/Settings';
import Dashboard from './component/pages/Dashboard';
import PrivateRoute from './component/core/auth/PrivateRoute';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
const appRouter = createBrowserRouter([
  {
    path: '/',
    element:
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    ,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />
      },
      {
        path: '/contact',
        element: <ContactPage />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />
      },
      {
        path: "/update-password/:id",
        element: <UpdatePassword />
      },
      {
        path: "/dashboard",
        element: <PrivateRoute children={<Dashboard />} />,
        children: [
          {
            path: "my-profile",
            element: <MyProfile />,
          },
          // {
          //   path: "/enrolled-courses",
          //   element: ,
          // },
          // {
          //   path: "/cart",
          //   element: '',
          // },
          {
            path: "settings",
            element: <Settings />
          }
        ]
      }

    ]
  },

])
function App() {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
