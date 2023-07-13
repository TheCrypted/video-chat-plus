import './App.css'
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider} from "react-router-dom";
import {Home} from "./pages/Home.jsx";
import {NewUser} from "./pages/NewUser.jsx";
import {ExistingUser} from "./pages/ExistingUser.jsx";
import {Landing} from "./pages/Landing.jsx";
import {useEffect, useState} from "react";


const SkippablePage = ({children}) => {
    const [auth, setAuth] = useState(false)
    useEffect(()=>{
        const checkAuth = async()=>{
            const token = localStorage.getItem("token")
            let response = await fetch("http://localhost:3000/auth/protected", {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    auth: token
                }
            })
            if(response.ok){
                setAuth(true)
            }
        }
        checkAuth()
    }, [])
    if(!auth){
        return children
    } else {
        return <Navigate to="/Home"/>
    }
}
const ProtectedRoutes = ({children}) => {
    const [auth, setAuth] = useState(true)
    useEffect(()=>{
        const checkAuth = async()=>{
            const token = localStorage.getItem("token")
            if(!token){
                setAuth(false)
                return;
            }
            let response = await fetch("http://localhost:3000/auth/protected", {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    auth: token
                }
            })
            if(!response.ok){
                setAuth(false)
            }
        }
        checkAuth()
    }, [])
    if(auth){
        return children
    } else {
        return <Navigate to="/Signin"/>
    }
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Home />} />
            <Route path="/Signin" element={
                <SkippablePage>
                    <ExistingUser />
                </SkippablePage>
            } />
            <Route path="/Signup" element={
                <SkippablePage>
                    <NewUser />
                </SkippablePage>
            } />
            <Route path="/Home" element={
                <ProtectedRoutes>
                    <Landing />
                </ProtectedRoutes>
            } />
        </>
    )
)

function App() {

  return (
        <RouterProvider router={router}/>
  )
}

export default App
