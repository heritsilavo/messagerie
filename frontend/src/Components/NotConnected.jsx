import './css/NotConnected.css'
import {Link} from 'react-router-dom'

function NotConnected() {
   return <div id="container">
      <div className="row m-5 d-flex justify-content-center">
        <div className='bg-light d-flex justify-content-center align-items-center text-black' style={{backgroundColor:"transparent",height:"150px",width:"150px",borderRadius:"50%"}}>
          <span style={{fontSize:"150px"}}>😃</span>
        </div>
      </div>
      <h2 className='text-center fw-bold mb-5'>Bienvenue dans cet application de messagerie</h2>
      <div className="container">
        <div className="row d-flex justify-content-center">
            <button className="p-0 col col-md-3 m-1 btn btn-success">
              <Link className='link-light p-1' to="/login">Se Connecter</Link>
            </button>
            <button className="p-0 col col-md-3 m-1 btn btn-primary">
              <Link className='link-light p-1' to="/signup">S'inscrire</Link>
            </button>
        </div>
      </div>
   </div> 
}

export default NotConnected;