import './css/Messages.css'
import Status from './utilities/Status';
import { themeContext } from './Connected';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

function Messages() {
    const [mytheme,setTheme]=useContext(themeContext)
    const changeTheme=()=>{
        setTheme({dark:(!mytheme.dark)})
    }
    const calculateTheme=()=>{
        let classe=" "
        if (mytheme.dark) {
            classe=" "+" bg-dark text-light"
        }else{
            classe=" "+" text-dark bg-light"
        }
        return classe;
    }

    return <>
        <Status></Status>
        <div id="message_container" className={calculateTheme()}>
            <Outlet></Outlet>
        </div>
    </>    
}

export default Messages;