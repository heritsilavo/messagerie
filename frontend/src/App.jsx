import './App.css'
import Signup from './Components/Signup'
import Login from './Components/Login'
import HomePage from './Components/HomePage'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Connected from './Components/Connected'
import NotConnected from './Components/NotConnected'
import Profil from './Components/Profil'
import Messages from './Components/Messages'
import Parametres from './Components/Parametres'
import { useEffect } from 'react'
import axios from 'axios'
import { accountServices } from './_services/account.services'

const router=createBrowserRouter([
  {
    path:"/",
    element: <HomePage/>
  },
  {
    path:"Connected",
    element: <Connected/>,
    children:[
      {
        path:"Profil",
        element: <Profil/>        
      },
      {
        path:"Message",
        element: <Messages/>        
      },
      {
        path:"Parametre",
        element: <Parametres/>        
      },
      {
        path:"",
        element: <Messages/>        
      },
      {
        path:"*",
        element: <Messages/>        
      },
    ],
  },
  {
    path:"NotConnected",
    element: <NotConnected/>        
  },
  {
    path:"signup",
    element: <Signup/>
  },
  {
    path:"login",
    element: <Login/>
  },
  {
    path:"*",
    element: <HomePage/>
  }
])

function App() {
  useEffect(() => {
    const tabCount=parseInt(localStorage.getItem('tabCount') || 0);
    localStorage.setItem('tabCount',tabCount+1);
        
    const handleBeforeUnload=async ()=>{
      const tabcount=parseInt(localStorage.getItem('tabCount') || 0);
      if(tabcount>0){
        localStorage.setItem('tabCount',tabcount-1);
      }else{
        await axios.post('/notonline',{
          token:accountServices.getToken()
        })
      }
    }
    window.addEventListener('beforeunload',handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload',handleBeforeUnload);
    }
  }, [])
  
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
