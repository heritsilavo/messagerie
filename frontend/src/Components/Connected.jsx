import { useEffect, useState } from 'react';
import Nav from './utilities/Nav';
import { Outlet } from 'react-router-dom';
import io from "socket.io-client"
import { accountServices } from '../_services/account.services';
import { useContext,createContext } from 'react';

let socket=null;

export const socketContext=createContext(null);
export const onlineUserContext=createContext(null);


const askFrequence=5000;

//COMPONNENT
function Connected() {
    
    const [onlineUsers,setOnlineUsers]=useState([]);
    
    socket=io.connect("http://localhost:3002/");

    //supprimer les redondances dans la liste des utilisateurs
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

    //quand le composant est montee, socket.io est connectée 
    useEffect(()=>{
        socket.emit("join",{
            token:accountServices.getToken()
        })

        //actualiser la liste des utilisateur connectes a chaque 1000secondes
        setInterval(() => {
            socket.emit("askOnlineUsers")
        }, askFrequence);
    
        return function() {
            socket.emit("logout")
        }
    },[])
    
    //capturer le evenements de socket.io
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

        <onlineUserContext.Provider value={onlineUsers}>
            <Outlet></Outlet>
        </onlineUserContext.Provider>
    </socketContext.Provider>
}
export default Connected;