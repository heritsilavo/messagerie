import './css/UserListItem.css'
import { themeContext } from '../Connected';
import { useContext } from 'react';

function UserListItem({user,online}) {
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

    return <>
        {user?
            <li className={'list_item d-flex justify-content-between align-items-center m-1 rounded  border border-secondary'+calculateTheme()}>
            <span className='col-1 bg-danger rounded d-flex justify-content-center align-items-center m-1 h-75'>{user.uid}</span>
            <span className='col d-flex flex-column'>
                <span className='p-1 align-self-start'>{user.username}</span>
                <span className={'badge align-self-start'+calculateTheme()}>{user.email}</span>
            </span>
            <span className='point_cont'>
                {online?<span className='point'>.</span>:""}
            </span>
        </li>
        :
        <div>lodaing...</div>
        }
    </>
}

export default UserListItem;