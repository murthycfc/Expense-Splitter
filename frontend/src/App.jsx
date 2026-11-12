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
          path:"expenses/:expenseId/view",
          element: <ViewExpense />
        },
        // {
          
        //   element: <Home />
        // },
        // {
        //   path: "/balances" ,
        //   element: <Balances />
        // },
        // {
        //   path: `/expense/edit/:expenseId`,
        //   element: <EditExpense />
        // }

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
  return <RouterProvider router={router}/>
}

export default App
