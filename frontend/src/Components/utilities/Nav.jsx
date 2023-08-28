import './css/Nav.css'
import { accountServices } from '../../_services/account.services';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import {Link} from 'react-router-dom'

function Nav() {
const navigate=useNavigate();

    const deconnexion=async ()=>{
        if(accountServices.isLogged()){
            await axios.post('/logout',{
                token:accountServices.getToken()
            })
        }
        accountServices.logout();
        navigate('/');
    }

    return<>
        <ul id="_nav_ul" className="bg-light text-dark nav d-flex align-items-center justify-content-end">
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
                <label className='badge text-dark' htmlFor="_theme">Theme Sombre</label>
                <input type="checkbox" name="_theme" id="_theme" />
            </li>
            <li className="nav-item">
                <button className='p-1 btn btn-primary' onClick={deconnexion}>Se deconnecter</button>
            </li>
        </ul>
    </>
}

export default Nav;