const express=require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const jwt=require("jsonwebtoken");
const mysql=require('mysql2/promise');
const http=require('http');
const { Server} = require("socket.io");

const app=express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:"http://localhost:5173",
        methods:["POST","G"]
    }
})

server.listen(3002,function() {
    console.log("server running on port 3002(socket.io)");
})

let socketUsers=[];

io.on("connection",function(socket) {
    socket.on("join",({token})=>{
        const userInfo=jwt.decode(token,secretKey);
        socketUsers.push({
            user:userInfo,
            socketId:socket.id
        })
        console.log("user join: ",userInfo.uid);
        //socket user updates
        socket.emit('socketUsersUpdated',{
            users:socketUsers
        })
        socket.broadcast.emit('socketUsersUpdated',{
            users:socketUsers
        })
    })

    socket.on('askOnlineUsers',function() {
        const connectesListMap=io.sockets.adapter.sids;
        var connectesList=Array.from(connectesListMap);
        connectesList=connectesList.map(el=>el[0])
        const removeIndex=[];
        

        socketUsers.forEach((SU,index) => {
            const i=connectesList.indexOf(SU.socketId)
            if(i==-1)removeIndex.push(index);
        });
    

        removeIndex.forEach(el => {
            socketUsers.splice(el,1);
        });
        if(removeIndex.length>0){
            setTimeout(() => {
                socket.emit('responseOnlineUsers',{
                    users:socketUsers
                })
            }, 1000);
        }
    })

    socket.on('disconnect',function() {
        deconnectOneUser(socket.id);
        //socket user updates
        socket.emit('socketUsersUpdated',{
            users:socketUsers
        })
        socket.broadcast.emit('socketUsersUpdated',{
            users:socketUsers
        })
    })
})

function deconnectOneUser(socketid) {
    const socketIdList=socketUsers.map((s)=>s.socketId)
    const index=socketIdList.indexOf(socketid);
    console.log("deconnecte:",index);
    if(index!=-1)socketUsers.splice(index,1);
}

/*
async function getUIDBySocket(socketId) {
    const conn = await mysql.createConnection(connInfo);
    const value=await conn.execute("SELECT uid from connection where socketid like ?",["%"+socketId+"%"])
    console.log(value);
    return (value[0][0])? value[0][0].uid:'';
}

async function getSocketIdLists(uid) {
    const conn = await mysql.createConnection(connInfo);
    const [result,fields]=await conn.execute("SELECT socketid from connection where uid=?",[uid])
    return (result.length>0) ? JSON.parse(((result.map(el=>el.socketid))[0])) : JSON.parse('["."]');
}

async function addSocketId(uid,socket) {
    let currList=[];
    currList=await getSocketIdLists(uid);
    currList.push(socket)
    const conn=await mysql.createConnection(connInfo);
    conn.execute("UPDATE connection SET socketid = ? WHERE connection.uid = ?",[JSON.stringify(currList),uid])
}

async function removeSocketId(socket) {
    const uid=await getUIDBySocket(socket.id)
    let currList=[];
    currList=await getSocketIdLists(uid);
    const newList=currList.splice(currList.indexOf(socket),1)
    const conn=await mysql.createConnection(connInfo);
    conn.execute("UPDATE connection SET socketid = ? WHERE connection.uid = ?",[JSON.stringify(newList),uid])
}
*/

const connInfo={
    host:'localhost',
    user:'tsila',
    password:'12345',
    database:'messagerie'
}


const secretKey='**$my$*$secret§§=⁺¨^key'

app.post('/',async (req,res)=>{
    const value=req.body;
    
    const decrypted=jwt.decode(value.token,secretKey);
    //verifier les informations de connection
    
    //resultat, connection encore valide ou pas(dans la base)
    var valid=true;
    //...
    res.send(valid)
})

app.post('/signup',async (req,res)=>{
    const exist= await verifierSiExiste(req.body.username);
    if(exist){
        console.log("L'utilisateur existe deja");
        res.json({error:"Ce nom d'utilisateur est deja prise"})
    }else{
        //ajout dans la base
        const conn =await mysql.createConnection(connInfo)
        const user=req.body;
        const sql="insert into user values(?,?,?,?)"
        const values=[user.uid,user.username,user.mail,user.password]
        const success = await conn.execute(sql,values)
        res.json({success})
    }
}
)

app.get('/nextId',async function(req,res){
    const connSync= await mysql.createConnection(connInfo);
    const [rows,fields]=await connSync.execute("select max(uid) as maxId from user")
    var next="U0"
    if(!!rows[0].maxId){
        const last = parseInt(rows[0].maxId.substring(1))
        next="U"+(last+1);
    }
    res.send(next)

})

async function verifierSiExiste(nom) {
    const conn =await mysql.createConnection(connInfo)
    const [result,fields]= await conn.execute("select * from user where username=?",[nom])
    conn.end();
    return (result.length>=1)

}

async function getUID(nom) {
    const conn =await mysql.createConnection(connInfo)
    const [result,fields]= await conn.execute("select uid from user where username=?",[nom])
    conn.end();
    return ( (!!result[0])?result[0].uid:null)
}

async function connectionAccepted(uid) {
    const conn = await mysql.createConnection(connInfo)
    const [result,fields]= await conn.execute("select * from connection where uid=?",[uid])
    
    return{
        accepted:(result.length<=0),
        materiel:(result.length<=0)?"":result[0].conninfo
    }

}

app.post('/login',async (req,res)=>{
    try {
        const {username,password,materiel}=req.body;
        const uid=await getUID(username);
        if(!(await verifierSiExiste(username))){//l'user n'existe pas
            res.json({error:"L'utilisateur n' existe pas"});
        }else if((await connectionAccepted(uid)).accepted){ //connection valide
            const conn = await mysql.createConnection(connInfo)
            const [result,fields]= await conn.execute("select * from user where username=? and mdp=?",[username,password])
            if((result.length>=1)){//connection valide et mot de passe correct
                conn.execute('insert into connection values(?,?,1,?)',[uid,materiel,JSON.stringify(["."])]);
                //generer un token de connection
                const token=jwt.sign({uid,username,password},secretKey,{expiresIn:"15d"})
                res.json({token})
            }else{//mot de passe incorrect
                return res.json({error:"Mot de passe incorrect"});    
            }
        }else{//connection refusée
            if((await connectionAccepted(uid)).materiel===materiel) return res.json({error:"veillez vous deconnecter d'abord de cet appareil puis réessayez😅"});
            return res.json({error:"L'utilisateur est deja connectée a cet appareil:    "+(await connectionAccepted(uid)).materiel});
        }
    } catch (error) {
        console.log(error);
    }


})

app.post('/notonline',(req,res)=>{
    const uid=jwt.decode(req.body.token,secretKey).uid;
    console.log("plus en ligne!!",uid);
})

app.post('/logout', async (req,res)=>{
    const token=req.body.token;
    const decrypted=jwt.decode(token,secretKey);
    if(decrypted.uid){
        const conn =await mysql.createConnection(connInfo)
        const [result,fields]=await conn.execute("delete from connection where uid=?",[decrypted.uid])
        conn.end();
        res.json({result})
    }
});

app.listen(3001,()=>{
    console.log("server running on port 3001");
})