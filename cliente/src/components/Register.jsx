import { useState } from "react";

export function Register(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    function checkData(){
        if(username === "" || email === "" || (password === "" && confirmPassword === "")){
            setMessage("Existem campos sem preemcher");
            return false;
        }
        if(password !== confirmPassword){
            setMessage("Senha e confirmação de senha não coincidem");
            return false;
        }
        return true;
    }

    async function handleRegistration(){
        if(checkData()){
            const response = await fetch("http://localhost:8000/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            console.log(data);
            if(response.ok){
                setMessage(data.message);
                return;
            }
            setMessage(data.error.message);
            return;
        }
        // setMessage("Corrija o(s) problema(s)!");
        console.log("Mensagem "+message);
    }

    return(
        <div>
            <h2>Register</h2>
            <label htmlFor="username">Username</label><br/>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/><br/><br/>
            <label htmlFor="email">Email</label><br/>
            <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/><br/><br/>
            <label htmlFor="password">Password</label><br/>
            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)}/><br/><br/>
            <label htmlFor="confirmPassword">Confirmar Senha</label><br/>
            <input type="password" placeholder="Confirmar Senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/><br/>
            <button onClick={() => handleRegistration()}>Registrar</button>
            {message && <div>{message}</div>}
        </div>
    );
}

export default Register;