import { createBrowserRouter, RouterProvider } from "react-router"
import RootLayout from "./layout/RootLayout"
import Members from "./pages/Home"
import Balances from "./pages/Balances"
import 'bootstrap/dist/css/bootstrap.min.css';
import EditExpense from "./pages/EditExpense";

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element: <RootLayout />,
      children:[
        {
          index: true,
          element: <Members />
        },
        {
          path: "/balances" ,
          element: <Balances />
        },
        {
          path: `/expense/edit/:expenseId`,
          element: <EditExpense />
        }

      ]
    }
  ])
  return <RouterProvider router={router}/>
}

export default App
