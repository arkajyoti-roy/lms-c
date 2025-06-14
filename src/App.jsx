import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Components/Home';
import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import Courses from './pages/student/Courses';
import MyLearning from './pages/student/MyLearning';
import Profile from './pages/student/Profile';
import Slidebar from './pages/Admin/Sidebar.jsx';
import CourseTable from './pages/Admin/course/CourseTable';
import Dashboard from './pages/Admin/Dashboard';
import AddCourse from './pages/Admin/course/AddCourse';
// import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import PublicRoute from './components/PublicRoute'; // Ensure this import is correct
import InsProfile from './pages/Admin/InsProfile';
import EditCourse from './pages/Admin/course/EditCourse';
import CreateLecture from './pages/Admin/lecture/CreateLecture';
import EditLecture from './pages/Admin/lecture/EditLecture';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/CourseProgress';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/courses',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <Courses />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/course-detail/:courseId',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <CourseDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '/course-progress/:courseId',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <CourseProgress />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-learning',
        element: (
          <ProtectedRoute allowedRoles={['student']}>
            <MyLearning />
          </ProtectedRoute>
        ),
      },
      // Test route for CourseTable
      {
        path: '/test',
        element: <CourseDetail />,
      },

      // Admin Routes
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['instructor']}>
            <Slidebar />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'ins-profile',
            element: <InsProfile />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'course',
            element: <CourseTable />,
          },
          {
            path: 'course/create',
            element: <AddCourse />,
          },
          {
            path: 'course/:courseId',
            element: <EditCourse />,
          },
          {
            path: 'course/:courseId/lecture',
            element: <CreateLecture />,
          },{
            path: 'course/:courseId/lecture/:lectureId',
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;