import { createBrowserRouter, RouterProvider } from "react-router"
import RootLayout from "./layout/RootLayout"
import Home from "./pages/Home"
import Balances from "./pages/Balances"
import 'bootstrap/dist/css/bootstrap.min.css';
import EditExpense from "./pages/EditExpense";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Groups from "./pages/Groups";
import ViewGroup from "./pages/ViewGroup";
import ViewExpense from "./pages/ViewExpense";
import AuthLoader from "./loader/authLoader";
import Expense from "./pages/CreateExpense";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      loader: AuthLoader,
      element: <RootLayout />,
      children:[
        {
          index: true,
          element: <Groups />
        },
        {
          path: "groups/:groupId/view",
          element: <ViewGroup />
        },
        {
          path:"groups/:groupId/createExpense",
          element: <Expense />
        },
        {
          path:"groups/:groupId/expenses/:expenseId/edit",
          element: <EditExpense />
        },
        {
          path:"expenses/:expenseId/view",
          element: <ViewExpense />
        },
      ],
      
    },
    {
      path:"/login",
      element: <Login />
    },
    {
      path:"/register",
      element: <Registration />
    }
  ])
  return (
    <>
      <RouterProvider router={router}/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
    />
    </>
  ) 
}

export default App
