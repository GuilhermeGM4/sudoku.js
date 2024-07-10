import { useContext, useEffect, useState } from "react";
import { Context } from "../App";

export function Profile(){
    const [token, setToken] = useContext(Context);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");

    setToken(localStorage.getItem("token"));
    
    useEffect(() => {
        async function fetchData() {
            try {
                const path = window.location.pathname; // already includes the first '/'
                const response = await fetch(`http://localhost:8000${path}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUsername(data.user.username);
                    if (data.isUser){
                        setEmail(data.user.email);
                    }
                    setType(data.user.type);                    
                } else {
                    console.error("Falha em recuperar usuário");
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchData();
    }, [token]);

    function logout(){
        localStorage.removeItem("token");
        setToken(null);
        setEmail(null);
    }

    return(<>
        <div>
            <h2>Perfil</h2>
            <p>Usuário: {username}  {type === "admin" && <b>{type}</b>}</p>
            {email && <>
                <p>Email: {email}</p>
                <button onClick={logout}>Logout</button>
            </>}
        </div>
    </>);
}

export default Profile;