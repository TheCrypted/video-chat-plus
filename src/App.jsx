import './App.css'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {Home} from "./pages/Home.jsx";
import {NewUser} from "./pages/NewUser.jsx";
import {ExistingUser} from "./pages/ExistingUser.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Home />} />
            <Route path="/Signin" element={<ExistingUser />} />
            <Route path="/Signup" element={<NewUser />} />
        </>
    )
)

function App() {

  return (
        <RouterProvider router={router}/>
  )
}

export default App
