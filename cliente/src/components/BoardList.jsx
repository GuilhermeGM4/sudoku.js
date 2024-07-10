import { useContext, useEffect, useState } from "react";
import { Context } from "../App";

export function BoardList(){
    const [token, setToken] = useContext(Context);
    const [boards, setBoards] = useState({});
    const [userType, setUserType] = useState(null);
    const [error, setError] = useState(null);

    setToken(localStorage.getItem("token"));

    useEffect(() =>{
        async function fetchBoards(){
            const response = await fetch("http://localhost:8000/board", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if(response.ok){
                setBoards(data);
                return;
            }
            if(data.error){
                setError(data.error.message);
            }
        }
        async function checkToken(){
            const response = await fetch("http://localhost:8000/checkToken", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if(response.ok){
                setUserType(data.user.type);
                return;
            }
            if(data.error){
                setError(data.error.message);
            }
        }
        fetchBoards();
        checkToken();
    },[token]);

    return(<>
        <div>
            <h2>Tabuleiros</h2>
            {userType === "admin" && <button><a href="http://localhost:5173/board/create">Criar tabuleiro</a></button>}
            {boards.boards?
                Object.entries(boards.boards).map(([boardId]) => (
                    <div key={boardId}>
                        <a href={`http://localhost:5173/board/${boardId}`}><h3>Tabuleiro {boardId}</h3></a>
                    </div>
                )):
                <div>
                    <h3>{error}</h3>
                </div>
            }
        </div>
    </>)
}

export default BoardList;