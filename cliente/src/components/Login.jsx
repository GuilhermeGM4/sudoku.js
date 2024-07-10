import { useContext, useState, useEffect } from "react";
import { Context } from "../App";

export function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useContext(Context);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            // localStorage.setItem("userId", data.id);
        }
    }, [token]);

    async function handleLogin() {
        if (!username && !password){
            setError("Usuário ou senha estão vazios");
            return;
        }
        const response = await fetch("http://localhost:8000/user/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password:  password
            })
        });
        const data = await response.json();
        if (response.ok) {
            setToken(data.token);
            localStorage.setItem("userId", data.id);
            setError(null)
            console.log(`Token: ${token}`);
            return;
        }
        setError(`${data.error.message} (${response.status})`);
    }

    return (
        <>
        <div>
            <h2>Login</h2>
            <label htmlFor="username">Username</label><br/>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} /><br/><br/>
            <label htmlFor="password">Password</label><br/>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
            <button onClick={handleLogin}>Login</button>
            {error? <div>Erro: {error}</div>:
                token? <div>Login realizado</div>:
                <></>
            }
        </div>
        </>
    );
}

export default Login;