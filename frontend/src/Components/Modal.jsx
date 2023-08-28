import { useRef } from 'react';

function Modal({titre,id,affiche,sauve,setAffiche,children}) {
    const btnRef=useRef(null);
    const closeBtnRef=useRef(null);

    const hide=()=>{
        setAffiche(false);
    }

    if(affiche){
        if(btnRef.current)btnRef.current.click();
    }
    return<>
        <button ref={btnRef} style={{display:"none"}} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#"+id}>
            Launch static backdrop modal
        </button>

        <div className="modal fade" id={id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby={id+"Label"} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-titre" id={id+"Label"}>{titre?titre:"Modal titre"}</h5>
                    <button  onClick={hide}  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button ref={closeBtnRef} onClick={hide}  type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button onClick={()=>{if(sauve)sauve();if(closeBtnRef.current)closeBtnRef.current.click()}} type="button" className="btn btn-primary">Understood</button>
                </div>
                </div>
            </div>
        </div>
    </>
}

export default Modal;