import './css/Nav.css'
import { accountServices } from '../../_services/account.services';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom'
import { useContext } from 'react';
import { socketContext, themeContext } from '../Connected';

function Nav() {
    const socket=useContext(socketContext);

    const navigate=useNavigate();

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

    const deconnexion=async ()=>{
        socket.disconnect();

        if(accountServices.isLogged()){
            await axios.post('/logout',{
                token:accountServices.getToken()
            })
        }
        accountServices.logout();
        navigate('/');
    } 
    return<>
        <ul id="_nav_ul" className={"nav d-flex align-items-center justify-content-end"+calculateTheme()}>
            <li className="nav-item flex-fill">
                <Link to="/" className="nav-link">
                    <img  src="#" alt="logo"/>  
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to='/Connected/Message'>Messages</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to='/Connected/Profil'>Profil</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to='/Connected/Parametre'>Parametre</Link>
            </li>
            <li className="nav-item m-2 d-flex align-items-center justify-content-center">
                <label className={'badge'+calculateTheme()} htmlFor="_theme">Theme Sombre</label>
                <input checked onChange={changeTheme} type="checkbox" name="_theme" id="_theme" />
            </li>
            <li className="nav-item">
                <button className='p-1 btn btn-primary' onClick={deconnexion}>Se deconnecter</button>
            </li>
        </ul>
    </>
}

export default Nav;