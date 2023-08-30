import './css/UserList.css'
import axios from 'axios';
import { socketContext, themeContext } from '../Connected';
import { useContext, useEffect, useState } from 'react';
import UserListItem from './UserListItem';
import { onlineUserContext } from '../Connected';
import { currentUserContext } from '../Connected';

function UserList() {
    //utilisateur courant
    const currentUser=useContext(currentUserContext);
    //theme
    const [theme,setTheme]=useContext(themeContext)
    const changeTheme=()=>{
        setTheme({dark:(!theme.dark)})
    }
    const calculateTheme=()=>{
        let classe=" "
        if (theme.dark) {
            classe=" "+" bg-dark text-light"
        }else{
            classe=" "+" text-dark bg-light"
        }
        return classe;
    }
    //online users
    const onlineUsers=useContext(onlineUserContext);
    const onlineUsersUid=onlineUsers.map((el)=>el.user.uid)
    //states
    const [userList,setUserList]=useState([]);
    //socket
    const socket=useContext(socketContext);
    useEffect(()=>{
        socket.emit('getAllUserList')
    },[])
    useEffect(() => {
      socket.on('updateAllUsersList',(liste)=>{
        setUserList(liste)
    })
    }, [socket])

    //supprimer l'utilisateur courant de la liste
    const uidList=userList.map(user=>user.uid);
    const i=uidList.indexOf(currentUser.uid);
    if(i!=-1){
        userList.splice(i,1);
    }
    //RENDER 
    return <div id="UList_contailer" className={calculateTheme()}>
        <ul id='ul' className='row container-fluid m-0 p-0 d-flex flex-column flex-nowrap align-items-center'>
            {
                userList.map((user)=><UserListItem online={onlineUsersUid.includes(user.uid)} key={user.uid} user={user}></UserListItem>)
            }           
        </ul>
    </div>
}

export default UserList;