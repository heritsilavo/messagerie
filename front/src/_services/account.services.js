
let saveToken=(token)=>{
    localStorage.setItem('token',token);
}

let logout=async ()=>{
    if(isLogged)localStorage.removeItem('token');
}

let getToken=()=>{
    return localStorage.getItem('token');
}

let isLogged=()=>{
    let token=localStorage.getItem('token');
    return !!token;
}

export const accountServices={
    saveToken,logout,isLogged,getToken
}