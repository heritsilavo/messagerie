import './css/Login.css'
import image from '../assets/img.jpg'
import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { accountServices } from '../_services/account.services';
import Modal from './Modal'

function Login() {
    const infoErrRef=useRef(null);
    const connErrRef=useRef(null);
    const nomRef=useRef(null);
    const passRef=useRef(null);

    const [showModal,setShowModal]=useState(false);
    const [modalTittle,setModalTittle]=useState("");
    const [modalMessage,setModalMessage]=useState("");

    const navigate=useNavigate();
    const verifieInfos=()=>{
      const valid=!(nomRef.current.value.trim()=="" || passRef.current.value.trim()=="");
      if(!valid)infoErrRef.current.classList.remove("d-none");
      else infoErrRef.current.classList.add("d-none")
      return valid;
    }

    const handleSubmit=(event)=>{
      event.preventDefault();
      if(verifieInfos()){
        (async function() {
          try {
            const {data} =await axios.post('/login',{
              username:nomRef.current.value,
              password:passRef.current.value,
              materiel:navigator.userAgent
            })
            if(data.token){
              accountServices.logout();
              accountServices.saveToken(data.token);
              navigate('/');
            }
            if(data.error){
              if(data.errType){
                const token=accountServices.getToken();
                accountServices.logout();
                accountServices.saveToken(token);  
                navigate('/');
              }else{
                setModalTittle('erreur de connection')
                setModalMessage(data.error)
                setShowModal(true);
              }
              
            }
          } catch (error) {
            console.log(error);
          }
        })();
      }
    }

    return<>
        <Modal titre={modalTittle} affiche={showModal} setAffiche={setShowModal} id={"modal_bla_b_bla"}>
          {modalMessage}
        </Modal>
        <div className='d-flex align-items-center justify-content-center' id="login">
            <div style={{transition:"all .5s"}} className="border rounded border-success-subtle col-lg-3 col-md-4 col-sm-6 col-9 p-2">
                <div className="row d-flex justify-content-center align-items-center">
                    <div style={{height:"100px",width:"100px",borderRadius:"50%",backgroundColor:"transparent"}} className="bg-light mb-4 d-flex justify-content-center align-items-center">
                        <img src={image} style={{width:"100px",height:"100px",borderRadius:"50%"}} alt="image" />
                    </div>
                </div>

                <h2 className='text-center'>Se connecter</h2>

                <form onSubmit={handleSubmit}>
                  <label htmlFor="nom" className="form-label">Nom d'utilisateur</label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input ref={nomRef} type="text" name="nom" id="nom" className="form-control" />
                  </div>
                  
                  <label htmlFor="pass" className="form-label">Mots de passe</label>
                  <input ref={passRef} type="password" name="pass" id="pass" className="form-control"/>
                  
                  <span ref={infoErrRef} className="badge text-wrap text-danger d-none" >**informations invalide!!</span>
                  <span ref={connErrRef} className="badge text-wrap text-danger d-none" >**connection impossible!😥, mot de passe ou nom d'utilisateur incorrect</span>
                  
                  <div className="row d-flex justify-content-end mt-3">
                    <button type="reset" className="col btn btn-secondary m-2"> Anuler </button> 
                    <button type='submit' className="col btn btn-success m-2"> Se connecter</button>
                  </div>
                  
                  <div className="row d-flex justify-content-center">
                    <button type="reset" className="btn btn-primary col m-2 p-0">
                      <Link className='link-light p-1' to="/signup"> Je n'ai pas encore de compte</Link>
                    </button>
                  </div>
                </form>
            </div>
        </div>
    </>
}
export default Login;