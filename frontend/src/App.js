import './App.css';
import Error from './component/pages/ErrorPage';
import AboutPage from './component/pages/AboutPage'
import ContactPage from './component/pages/ContactPage'
import HomePage from './component/pages/HomePage';
import Header from './component/common/Header';
import Footer from './component/common/Footer'
import Login from './component/pages/Login';
import Signup from './component/pages/Signup';
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
