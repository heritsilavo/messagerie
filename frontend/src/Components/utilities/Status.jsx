import './css/Status.css'
import { onlineUserContext } from '../Connected';
import { useContext } from 'react';

function Status(){
    const onlineUsers=useContext(onlineUserContext);
    return<>
    <ul style={{overflowX:"auto"}} className="border nav d-flex flex-nowrap align-items-end justify-content-start bg-light">
        <li className="a nav-item m-1  col-2 bg-primary-subtle rounded d-flex flex-column justify-content-center align-items-center border border-dark">C<span className="badge text-success">GPT</span></li>
        {(onlineUsers)?onlineUsers.map((el,index)=>(
            <li key={index} className="a nav-item m-1  col-2 bg-danger-subtle rounded d-flex flex-column justify-content-center align-items-center border border-dark">
                {el.user.username[0].toUpperCase()}
                <span className="badge text-success">{el.user.username}</span>
            </li>
        )):""}
    </ul>
    </>
}
export default Status;
