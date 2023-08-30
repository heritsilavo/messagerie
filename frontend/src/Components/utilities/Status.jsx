import './css/Status.css'
import { onlineUserContext,themeContext } from '../Connected';
import { useContext } from 'react';

function Status(){
    const onlineUsers=useContext(onlineUserContext);
    const [theme,setTheme]=useContext(themeContext)
    const changeTheme=()=>{
        setTheme({dark:(!theme.dark)})
    }
    const calculateTheme=()=>{
        let classe=" "
        if (theme.dark) {
            classe=" "+" bg-dark text-light border-primary-subtle"
        }else{
            classe=" "+" text-dark bg-light border"
        }
        return classe;
    }   

    return<>
    <ul style={{overflowX:"auto"}} className={"nav d-flex flex-nowrap align-items-end justify-content-start"+calculateTheme()}>
        <li className={"a nav-item m-1  col-2 bg-primary-subtle rounded d-flex flex-column justify-content-center align-items-center border text-dark"}>C<span className="badge text-success">GPT</span></li>
        {(onlineUsers)?onlineUsers.map((el,index)=>(
            <li key={index} className={"a nav-item m-1  col-2 bg-danger-subtle rounded d-flex flex-column justify-content-center align-items-center border text-dark"}>
                {el.user.username[0].toUpperCase()}
                <span className={"badge text-success"}>{el.user.username}</span>
            </li>
        )):""}
    </ul>
    </>
}
export default Status;