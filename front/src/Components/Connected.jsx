import Nav from './utilities/Nav';
import { Outlet } from 'react-router-dom';

function Connected() {
    return<>
        <Nav></Nav>
        <Outlet></Outlet>
    </>
}
export default Connected;