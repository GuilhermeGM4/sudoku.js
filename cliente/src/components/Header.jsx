import { useContext, useEffect, useState } from "react";
import { Context } from "../App";

export function Header(){
    const [token] = useContext(Context);
    // const [userId, setUserId] = useContext(Context);
    // const userId = localStorage.getItem("userId");
    const [userId, setUserId] = useState("");

    const domain = "http://localhost:5173";
    const boardPath = "/board";
    const loginPath = "/login";
    const registerPath = "/register";
    // const apiDomain = "http://localhost:8000";

    useEffect(()=>{
        setUserId(localStorage.getItem("userId"));
    }, [token, userId]);

    return(<>
    <header className="header">
        <h1><a href={domain}>Sudoku</a></h1>
        <a className="link" href={`${domain}${boardPath}`}>Tabuleiros</a>
        {(!token || !userId)? <div>
            <button><a href={`${domain}${loginPath}`}>Login</a></button>
            <button><a href={`${domain}${registerPath}`}>Cadastro</a></button>
        </div>:
        <div>
            <button><a href={`${domain}/user/${userId}`}>Perfil</a></button>
        </div>}
        <hr />
    </header>
    
    </>);
}

export default Header;