export function Footer(){
    const domain = "http://localhost:5173";
    const paths ={
        docApi: "/apiDoc",
        userManual: "/userManual",
    }

    return(<>
        <footer>
            <hr />
            <div>
                <a href={`${domain}${paths.docApi}`}>Documentação api</a> &nbsp; &nbsp;
                <a href={`${domain}${paths.userManual}`}>Manual do usuário</a>
            </div>
            <p>Criado por: Guilherme Garcia Mancuso</p>
        </footer>
    </>);
}

export default Footer;