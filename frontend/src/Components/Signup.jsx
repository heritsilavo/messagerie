import { useRef, useState } from 'react';
import axios from 'axios';
import './css/Signup.css'
import { accountServices } from '../_services/account.services';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import image from '../assets/img.jpg'
import { Link } from 'react-router-dom';

function Signup() {
  const nomRef=useRef(null);
  const mailRef=useRef(null);
  const pass1Ref=useRef(null);
  const pass2Ref=useRef(null);

  const passErrRef=useRef(null);
  const longPassErr=useRef(null);
  const nomErrRef=useRef(null); 
  const mailErrRef=useRef(null); 

  const validMDP=useRef(false);
  const validMDPLong=useRef(false);
  const validNom=useRef(false);
  const validMail=useRef(false);

  const navigate = useNavigate();

  const [modelMessage,setModelMessage]=useState("");
  const [modelTittle,setModelTittle]=useState("");

  const [showModal,setShowModal]=useState(false);

  const verifyPassword=()=>{
    if (pass2Ref.current.value.trim()!="" && pass1Ref.current.value!=pass2Ref.current.value) {
      passErrRef.current.classList.remove("d-none");
      validMDP.current=false;
    }
    if(pass1Ref.current.value==pass2Ref.current.value){
      passErrRef.current.classList.add("d-none");
      validMDP.current=true;
    }
    if(pass2Ref.current.value.trim()==""){
      passErrRef.current.classList.remove("d-none");
      validMDP.current=false;
    }
  }

  const verifyMDPLong=()=>{
    if(pass1Ref.current.value.length<8){
      validMDPLong.current=false;
      longPassErr.current.classList.remove('d-none');
    }else{
      validMDPLong.current=true;
      longPassErr.current.classList.add('d-none');
    }
  }
  

  const verifyNom=()=>{
    if(nomRef.current.value.trim()!=""){
      nomErrRef.current.classList.add("d-none");
      validNom.current=true
    }
    else {
      nomErrRef.current.innerText="ce chaps est obligatoire!!"
      nomErrRef.current.classList.remove("d-none")
      validNom.current=false
    }
  }

  const verifyMail=()=>{
    if(mailRef.current.value.trim()!=""){
      mailErrRef.current.classList.add("d-none");
      if(mailRef.current.value.includes('@')){
        if(mailRef.current.value.split('@')[1].trim()!="")validMail.current=true
        else{
          validMail.current=false
          mailErrRef.current.innerText="mail invalide!!"
          mailErrRef.current.classList.remove("d-none")   
        }
      }
      else{
        validMail.current=false
        mailErrRef.current.innerText="un mail doit avoir le signe @!!"
        mailErrRef.current.classList.remove("d-none") 
      }
    }
    else {
      mailErrRef.current.innerText="ce chaps est obligatoire!!"
      mailErrRef.current.classList.remove("d-none")
      validMail.current=false
    }
  }
  
  async function handleSubmit(event){
    event.preventDefault();
    verifyMail()
    verifyNom()
    verifyPassword()
    verifyMDPLong();
    const valid=validMDP.current && validMail.current && validNom.current && validMDPLong.current;
    // informations valide!! envoy des informations au server
    if(valid){
      try {
        var id="";
        //Generer l'id suivant
        axios.get('/nextId')
          .then((reponse)=>{
            id=reponse.data;
            return axios.post('/signup', {
              uid: reponse.data,
              username: event.target['nom'].value,
              mail:event.target['mail'].value,
              password: event.target['pass1'].value
            })
          })
          .then(function(params) {
            if(params.data.error){//echec de l'inscription
              setModelTittle("echec de l'inscription");
              setModelMessage(params.data.error);
              setShowModal(true)
            }else if(params.data.success){//inscription reussi
              return new Promise((res,rej)=>{
                res(true);
              })
            }
          }).then(async (success)=>{//connection en cas de reussi
            if(success){
              const {data} =await axios.post('/login',{
                username:event.target['nom'].value,
                password:event.target['pass1'].value,
                materiel:navigator.userAgent
              })
              if(data.token){
                accountServices.logout();
                accountServices.saveToken(data.token);
                document.getElementById('__btn_annuler').click();
                navigate('/');
              }
              if(data.error){
                setModelTittle('erreur de connection')
                setModelMessage(data.error)
                setShowModal(true);
              }
            }
          })
        } catch (error) {
        // Handle error
        console.error('Signup failed', error.response.data);
      }
    }
  }
  
    return<>
        <Modal id="inscription_reusii" titre={modelTittle} affiche={showModal} setAffiche={setShowModal} >
          {modelMessage}
        </Modal>
        <div className='d-flex align-items-center justify-content-center' id="signup">
            <div style={{transition:"all .5s"}} className="border rounded border-success-subtle col-lg-3 col-md-4 col-sm-6 col-9 p-2">
                <div className="row d-flex justify-content-center align-items-center">
                    <div style={{height:"100px",width:"100px",borderRadius:"50%"}} className="bg-light mb-4 d-flex justify-content-center align-items-center">
                    <img src={image} style={{width:"100px",height:"100px",borderRadius:"50%"}} alt="image" />
                    </div>
                </div>

                <h2 className='text-center'>S'inscrire</h2>

                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="nom" className="form-label">Nom d'utilisateur <span className="text-danger">*</span> </label>
                    <input onBlur={verifyNom} ref={nomRef} type="text" id="nom" name="nom"  className="form-control" />
                    <div ref={nomErrRef} className="badge text-danger d-none"></div>
                  </div>

                  <div>
                    <label htmlFor="mail" className="form-label">Email<span className="text-danger">*</span></label>
                    <input onBlur={verifyMail} id="mail" ref={mailRef} type="email" className="form-control" name="mail" placeholder="abc@mail.com"/>
                    <div ref={mailErrRef} className="badge text-danger d-none"></div>
                  </div>
                  
                  <div>
                    <label htmlFor="pass1" className="form-label">Mots de passe<span className="text-danger">*</span></label>
                    <input onBlur={verifyMDPLong} onChange={verifyPassword} id="pass1" ref={pass1Ref} type="password" name="pass1"  className="form-control"/>
                    <div ref={longPassErr} className="badge text-danger text-wrap d-none">**les mots de passes doit contenir au moins huit caracteres</div>
                  </div>
                  
                  <label htmlFor="pass2" className="form-label">Confirmer le mots de passe<span className="text-danger">*</span></label>
                  <input onChange={verifyPassword} id="pass2" ref={pass2Ref} type="password" name="pass2"  className="form-control"/>
                  <div ref={passErrRef} className="badge text-danger d-none">**les mots de passes ne correspondent pas</div>
                  <div className="row d-flex justify-content-end">
                    <button id='__btn_annuler' type="reset" className="col btn btn-secondary m-2"> Anuler </button> 
                    <button type='submit' className="col btn btn-primary m-2"> S'inscrire </button>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <button type="reset" className="btn btn-success col m-2 p-0">
                      <Link className='link-light p-1' to="/login">j'ai deja un compte</Link> 
                    </button>
                  </div>
                </form>
            </div>
        </div>
    </>
}
export default Signup;