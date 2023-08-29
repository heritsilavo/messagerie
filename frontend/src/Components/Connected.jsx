import { useEffect } from 'react';
import Nav from './utilities/Nav';
import { Outlet } from 'react-router-dom';
import io from "socket.io-client"
import { accountServices } from '../_services/account.services';
import { useContext,createContext } from 'react';

let socket=null;

export const socketContext=createContext(null);

const askFrequence=1000;

//COMPONNENT
function Connected() {
    socket=io.connect("http://localhost:3002/");

    useEffect(()=>{
        socket.emit("join",{
            token:accountServices.getToken()
        })

        setInterval(() => {
            console.log("asking...");
            socket.emit("askOnlineUsers")
        }, askFrequence);
    },[])
    
    useEffect(()=>{
        socket.on('socketUsersUpdated',({users})=>{
            console.log(users);
        })

        socket.on('responseOnlineUsers',({users})=>{
            console.log(users);
        })
    },[socket])
    
    return <socketContext.Provider value={socket}>
        <Nav></Nav>
        <Outlet></Outlet>    
    </socketContext.Provider>
}
export default Connected;