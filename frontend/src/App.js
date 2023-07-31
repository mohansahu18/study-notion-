import './App.css';
import Error from './component/Error';
import AboutPage from './component/AboutPage'
import ContactPage from './component/ContactPage'
import HomePage from './component/HomePage';
import Header from './component/Header';
import Footer from './component/Footer'
import Login from './component/Login';
import Signup from './component/Signup';
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
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
])
function App() {
  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
