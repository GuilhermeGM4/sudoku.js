export function UserManual(){
    return(<>
        <div>
            <p><b>Atenção</b></p>
            <p>Para jogar e ver os tabuleiros de Sudoku é necessário estar logado!</p>
        </div>
        <br/>
        <div>
            <h2><b>Regras</b></h2>
            <p><b>Limite de erros:</b> O jogo possui um limite de 5 erros que você pode cometer. Caso você chegue neste limite, o tabuleiro será bloqueado.</p>
            <p><b>Fixagem de valor:</b> Ao fazer a checagem e o sistema não detecta nenhum erro no tabuleiro atual, ele irá fixar o(s) valor(s) atual(is) mesmo se não estiverem corretos.</p>
        </div>
    </>);
}

export default UserManual;