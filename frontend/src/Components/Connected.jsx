import { useEffect, useState } from 'react';
import Nav from './utilities/Nav';
import { Outlet } from 'react-router-dom';
import io from "socket.io-client"
import { accountServices } from '../_services/account.services';
import { useContext,createContext } from 'react';

let socket=null;

export const socketContext=createContext(null);
export const onlineUserContext=createContext(null);
export const themeContext=createContext(null);
export const currentUserContext=createContext(null);

const askFrequence=1000;

//COMPONNENT
function Connected() {
    const [theme,setTheme]=useState({dark:true})
    const [currentUser,setCurrUser]=useState({});

    function updateTheme(newValue) {
        setTheme(newValue)
    }

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
        //utilisateur courant initiale
        socket.on('localUser',(userLocale)=>{
            setCurrUser(userLocale);
        })
        //connecter au socket
        const tok=accountServices.getToken();
        if(tok){
            socket.emit("join",{
                token:tok
            })
        }

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
    
    return(<currentUserContext.Provider value={currentUser}>
            <themeContext.Provider value={[theme,updateTheme]}>
                <socketContext.Provider value={socket}>
                    <Nav></Nav>
                    <onlineUserContext.Provider value={onlineUsers}>
                        <Outlet></Outlet>
                    </onlineUserContext.Provider>
                </socketContext.Provider>
            </themeContext.Provider>
          </currentUserContext.Provider>
    )
}
export default Connected;