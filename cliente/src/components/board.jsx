import { useContext, useState, useEffect } from "react";
import { Context } from "../App";

export function Board(){
    // const initialBoard = [
    //     [null, null, null, 9, 1, null, 4, null, 7], //row 1
    //     [3, null, 4, 6, 8, null, null, 1, null], //row 2
    //     [null, 7, 9, null, 5, null, 6, null, 3], //row 3
    //     [9, null, 2, null, null, null, 8, null, 1], //row 4
    //     [null, 1, 5, null, null, 6, 3, 4, null], //row 5
    //     [null, 3, null, null, 9, null, null, 5, null], //row 6
    //     [2, null, null, 5, 3, null, 7, null, null], //row 7
    //     [null, null, 3, 1, null, null, null, 9, null], //row 8
    //     [6, null, null, 4, 7, null, 1, 3, null] //row 9
    // ];
    const [token, setToken] = useContext(Context);
    const [initialBoard, setInitialBoard] = useState([]);
    const [board, setBoard] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [userErrors, setUserErrors] = useState(0);

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
                if (response.ok) {
                    const data = await response.json();
                    setInitialBoard(data.board);
                    setBoard(data.board);
                    setIsAdmin(data.isAdmin);
                } else {
                    console.error('Failed to fetch board data');
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchData();
    }, [token]);

    function getClassNames(row, col) {
        let classNames = [];
        if ((row + 1) % 3 === 0 && row !== 8) classNames.push('border-bottom');
        if ((col + 1) % 3 === 0 && col !== 8) classNames.push('border-right');
        return classNames.join(' ');
    }

    function handleChange(rowIndex, cellIndex, value) {
        const updatedBoard = board.map((row, rIndex) =>
            row.map((cell, cIndex) => {
                if (rIndex === rowIndex && cIndex === cellIndex) {
                    return (value >= 1 && value <= 9) ? parseInt(value, 10) : null;
                }
                return cell;
            })
        );
        setBoard(updatedBoard);
    }

    function checkBoard() {
        for(let rowIndex in board) {
            for(let cellIndex in board[rowIndex]) {
                const cell = board[rowIndex][cellIndex];
                if (cell !== null && (cell > 0 || cell < 10)) {
                    // Check if the cell value is already present in the row
                    if (board[rowIndex].filter(c => c === cell).length > 1) {
                        userErrors < 5 && setUserErrors(userErrors + 1);
                        return userErrors < 5? `Erro: Valor duplicado ${cell} na linha ${rowIndex + 1}`:
                            "Você falhou em resolver o tabuleiro. Tente novamente.";
                    }
    
                    // Check if the cell value is already present in the column
                    if (board.map(row => row[cellIndex]).filter(c => c === cell).length > 1) {
                        userErrors < 5 && setUserErrors(userErrors + 1);
                        return userErrors < 5? `Erro: Valor duplicado ${cell} na coluna ${cellIndex + 1}`:
                            "Você falhou em resolver o tabuleiro. Tente novamente.";
                    }
    
                    // Check if the cell value is already present in the 3x3 sub-grid
                    const subGridStartRow = Math.floor(rowIndex / 3) * 3;
                    const subGridStartCol = Math.floor(cellIndex / 3) * 3;
                    const subGridValues = board.slice(subGridStartRow, subGridStartRow + 3)
                       .map(row => row.slice(subGridStartCol, subGridStartCol + 3))
                       .flat();
                    if (subGridValues.filter(c => c === cell).length > 1) {
                        userErrors < 5 && setUserErrors(userErrors + 1);
                        return userErrors < 5? `Erro: Valor duplicado ${cell} no setor iniciando na linha ${subGridStartRow + 1} e coluna ${subGridStartCol + 1}`:
                            "Você falhou em resolver o tabuleiro. Tente novamente.";
                    }
                }
            }
        }
        return 'Nenhum erro encontrado';
    }

    function validateBoard() {
        const isValid = checkBoard();
        setValidationResult(isValid);
        isValid === "Nenhum erro encontrado" && setInitialBoard(board);
    }

    async function deleteBoard() {
        try {
            const path = window.location.pathname; // already includes the first '/'
            const response = await fetch(`http://localhost:8000${path}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                window.location.href = "http://localhost:5173/board";
                return;
            }
            console.error(data.error.message);
        } catch (e) {
            console.error(e);
        }
    }

    return(
        <>
            <h2>Tabuleiro</h2>
            
            {initialBoard.length > 0?
                <>
                    <div>
                        <p>Erros: {userErrors} / 5</p>
                    </div>
                    <div>
                        {isAdmin && <button onClick={deleteBoard}>Deletar tabuleiro</button>}
                    </div>
                    <table className="sudoku-table" border="1" style={{ borderCollapse: 'collapse', margin: 'auto' }}>
                        <tbody>
                            {initialBoard.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className={`cell ${getClassNames(rowIndex, cellIndex)}`}>
                                            {cell !== null ? cell : (
                                                <input
                                                type="number"
                                                min="1"
                                                max="9"
                                                value={board[rowIndex][cellIndex] || ''}
                                                onChange={(e) => handleChange(rowIndex, cellIndex, e.target.value)}
                                                className="sudoku-input"
                                                disabled={userErrors >= 5}
                                                />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => validateBoard()} className="validate-button" disabled={userErrors >= 5}>Check Board</button>
                </>:
                <h3>Token expirado ou tabuleiro inválido</h3>
            }
            {validationResult && <div className="validation-result">{validationResult}</div>}
        </>
    );
}

export default Board;