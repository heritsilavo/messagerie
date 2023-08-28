import Nav from './utilities/Nav';
import { Outlet } from 'react-router-dom';
import io from "socket.io-client"

let socket=null;

function Connected() {
    socket=io.connect("http://localhost:3002/");
    const disconnect=()=>{
        socket.disconnect()
    }
    return<>
        <button onClick={disconnect}>disconnect</button>
        <Nav></Nav>
        <Outlet></Outlet>
    </>
}
export default Connected;