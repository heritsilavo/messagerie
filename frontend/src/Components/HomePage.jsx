import { useEffect} from 'react';
import './css/HomePage.css'
import { accountServices } from '../_services/account.services';
import {  Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function HomePage(){
    const navigate = useNavigate();

    useEffect(()=>{
        const isLogged=accountServices.isLogged()
        
        if(isLogged)navigate('/Connected')
        else navigate('/NotConnected')
    },[])

    return<>
        <Outlet></Outlet>
    </>
}

export default HomePage;