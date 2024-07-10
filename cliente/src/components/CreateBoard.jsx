import { useContext, useEffect, useState } from 'react';
import { Context } from '../App';

export function CreateBoard(){
    const [initialBoard] = useState(Array(9).fill().map(() => Array(9).fill(null)));
    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(null)));
    const [validationResult, setValidationResult] = useState('');
    const [token, setToken] = useContext(Context);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        async function checkToken(){
            const response = await fetch("http://localhost:8000/checkToken", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUserType(data.user.type);
                return;
            }
            if (data.error){
                setValidationResult(data.error.message);
                return;
            }
        }
        checkToken();
    }, [token, setToken]);

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

    function validateBoard() {
        const isValid = checkBoard();
        setValidationResult(isValid);
    }

    function checkBoard() {
        for(let rowIndex in board) {
            for(let cellIndex in board[rowIndex]) {
                const cell = board[rowIndex][cellIndex];
                if (cell !== null && (cell > 0 || cell < 10)) {
                    // Check if the cell value is already present in the row
                    if (board[rowIndex].filter(c => c === cell).length > 1) {
                        return `Erro: Valor duplicado ${cell} na linha ${rowIndex + 1}`;
                    }
    
                    // Check if the cell value is already present in the column
                    if (board.map(row => row[cellIndex]).filter(c => c === cell).length > 1) {
                        return `Erro: Valor duplicado ${cell} na coluna ${cellIndex + 1}`;
                    }
    
                    // Check if the cell value is already present in the 3x3 sub-grid
                    const subGridStartRow = Math.floor(rowIndex / 3) * 3;
                    const subGridStartCol = Math.floor(cellIndex / 3) * 3;
                    const subGridValues = board.slice(subGridStartRow, subGridStartRow + 3)
                       .map(row => row.slice(subGridStartCol, subGridStartCol + 3))
                       .flat();
                    if (subGridValues.filter(c => c === cell).length > 1) {
                        return `Error: Valor duplicado ${cell} no setor iniciando na linha ${subGridStartRow + 1} e coluna ${subGridStartCol + 1}`;
                    }
                }
            }
        }
        return 'Nenhum erro encontrado';
    }
    
    async function sendToServer(){
        const response = await fetch("http://localhost:8000/board",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                board: board
            })
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setValidationResult(data.message);
            return;
        }
        if (data.error){
            setValidationResult(data.error.message);
            return;
        }
    }

    function getClassNames(row, col) {
        let classNames = [];
        if ((row + 1) % 3 === 0 && row !== 8) classNames.push('border-bottom');
        if ((col + 1) % 3 === 0 && col !== 8) classNames.push('border-right');
        return classNames.join(' ');
    }
    
    function handleSubmit() {
        const result = validationResult;
        if (result === 'Nenhum erro encontrado') {
            sendToServer();
            return;
        }
        setValidationResult('Não é possível enviar um tabuleiro com erros');
    }

    return (<>
        {userType === "admin"? <>
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
                                        />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => validateBoard()} className="validate-button">Verificar</button>
            <button onClick={handleSubmit}>Cadastrar</button>
            {validationResult && <div className="validation-result">{validationResult}</div>}
        </>: <div>Você não tem acesso a esta página</div>}
    </>);

}

export default CreateBoard;