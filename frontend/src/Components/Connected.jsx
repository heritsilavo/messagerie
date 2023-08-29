import { useEffect, useState } from 'react';
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
    const [onlineUsers,setOnlineUsers]=useState([]);

    socket=io.connect("http://localhost:3002/");

    const arrangeOnlineUser=(users)=>{
        const res=[];
        const resId=[];
        users.forEach(element => {
            if(!resId.includes(element.user.uid)){
                res.push(element);
                resId.push(element.user.uid);
            }
        });
        return res;
    }

    useEffect(()=>{
        socket.emit("join",{
            token:accountServices.getToken()
        })

        setInterval(() => {
            socket.emit("askOnlineUsers")
        }, askFrequence);
    },[])
    
    useEffect(()=>{
        socket.on('socketUsersUpdated',({users})=>{
            setOnlineUsers(arrangeOnlineUser(users))
        })

        socket.on('responseOnlineUsers',({users})=>{
            setOnlineUsers(arrangeOnlineUser(users))
        })
    },[socket])
    
    return <socketContext.Provider value={socket}>
        <Nav></Nav>
        <Outlet></Outlet>
        <ul>
        {
            onlineUsers.map((el,indice)=><li key={indice}>{el.user.uid}</li>)
        }
        </ul>
    </socketContext.Provider>
}
export default Connected;