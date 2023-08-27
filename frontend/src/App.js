import './App.css';
import React from 'react';
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
import Settings from './component/core/dashboard/settings';
import Dashboard from './component/pages/Dashboard';
import PrivateRoute from './component/core/auth/PrivateRoute';
import EnrolledCourses from './component/core/dashboard/EnrollCourses';
import AddCourse from './component/core/dashboard/add course';
import Cart from './component/core/dashboard/cart';
import MyCourses from './component/core/dashboard/MyCourses';
import CourseDetails from './component/pages/CourseDetails'
import Catalog from './component/pages/Catalog';
import Contact from "./component/pages/ContactPage"
import ViewCourse from './component/pages/ViewCourse'
import VideoDetails from './component/core/view course/VideoDetails';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import EditCourse from './component/core/dashboard/edit course';
import { ACCOUNT_TYPE } from "./utils/constant"
import Instructor from './component/core/dashboard/instructor dashboard/Instructor';
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
        path: "/courses/:courseId",
        element: <CourseDetails />
      },
      {
        path: "/update-password/:id",
        element: <UpdatePassword />
      },
      {
        path: "catalog/:catalogName",
        element: <Catalog />
      },
      {
        path: "/dashboard",
        element: <PrivateRoute children={<Dashboard />} />,
        children: [
          {
            path: "my-profile",
            element: <MyProfile />,
          },
          {
            path: "enrolled-courses",
            element: <EnrolledCourses />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "settings",
            element: <Settings />
          },
          {
            path: "add-course",
            element: <AddCourse />
          },
          {
            path: "my-courses",
            element: <MyCourses />
          },
          {
            path: 'edit-course/:courseId',
            element: <EditCourse />
          },
          {
            path: "instructor",
            element: <Instructor />
          }
        ]
      },
      {
        path: "/view-course",
        element: <PrivateRoute children={<ViewCourse />} />,
        children: [
          {
            path: ":courseId/section/:sectionId/sub-section/:subSectionId",
            element: < VideoDetails />
          }
        ]
      }
    ]
  },

])
function App() {
  // const { user } = useSelector((state) => state.profile)

  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
