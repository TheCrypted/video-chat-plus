import './App.css'
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from "react-router-dom";
import {Home} from "./pages/Home.jsx";
import {NewUser} from "./pages/NewUser.jsx";
import {ExistingUser} from "./pages/ExistingUser.jsx";
import {Landing} from "./pages/Landing.jsx";
import {useEffect, useState} from "react";

const ProtectedRoutes = ({children}) => {
    let [auth, setAuth] = useState(false);
    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem('token')
            if(!token) {return <Navigate to="/Signin"/>}
            let response = await fetch('https://localhost/auth/protected', {
                method: 'GET',
                headers: {
                    "Content-type": "application/json",
                    auth: token
                }
            })
            if (response.ok) {
                setAuth(true)
            }
        }
        auth()
    }, [])
    if(auth) {
        return children
    } else {
        return <Navigate to="/Signin"/>
    }
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={
                <ProtectedRoutes>
                    <Landing />
                </ProtectedRoutes>
            } />
            <Route path="/Signin" element={<ExistingUser />} />
            <Route path="/Signup" element={<NewUser />} />
            <Route path="/Home" element={<Home />} />
        </>
    )
)
function App() {
  return (
        <RouterProvider router={router}/>
  )
}
export default App
