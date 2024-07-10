export function DocApi(){
    const apiDocumentation = [
        {
          endpoint: "/user/register",
          method: "POST",
          description: "Register a new user",
          body: {
            username: "string",
            password: "string",
            email: "string"
          },
          returns: [
            {
              code: 200,
              message: "Usuário criado"
            },
            {
              code: 400,
              message: "Usuário já cadastrado"
            }
          ]
        },
        {
          endpoint: "/user/login",
          method: "POST",
          description: "Authenticate a user",
          body: {
            username: "string",
            password: "string"
          },
          returns: [
            {
              code: 200,
              message: "Usuário autenticado"
            },
            {
              code: 401,
              message: "Usuário ou senha incorretos"
            }
          ]
        },
        {
          endpoint: "/user",
          method: "GET",
          description: "Get all users (admin only)",
          headers: {
            Authorization: "Bearer <token>"
          }
        },
        {
          endpoint: "/user/:id",
          method: "GET",
          description: "Get a specific user by ID",
          headers: {
            Authorization: "Bearer <token>"
          },
          returns: [
            {
              code: 200,
              message: "Objeto contendo usuário"
            },
            {
              code: 401,
              message: "Usuário não logado"
            },
            {
              code: 404,
              message: "Usuário não encontrado"
            }
          ]
        },
        {
          endpoint: "/board",
          method: "GET",
          description: "Get all boards",
          returns: [
            {
              code: 200,
              message: "Objeto contendo tabuleiros"
            },
            {
              code: 401,
              message: "Usuário não logado"
            },
            {
              code: 404,
              message: "Tabuleiro não encontrado"
            }
          ]
        },
        {
          endpoint: "/board/:id",
          method: "GET",
          description: "Get a specific board by ID",
          returns: [
            {
              code: 200,
              message: "Objeto contendo tabuleiro"
            },
            {
              code: 401,
              message: "Usuário não logado"
            },
            {
              code: 404,
              message: "Tabuleiro não encontrado"
            }
          ]
        },
        {
          endpoint: "/board",
          method: "POST",
          description: "Create a new board (admin only)",
          headers: {
            Authorization: "Bearer <token>"
          },
          body: {
            board: "object"
          }
        },
        {
          endpoint: "/board/:id",
          method: "DELETE",
          description: "Delete a specific board by ID (admin only)",
          headers: {
            Authorization: "Bearer <token>"
          }
        },
        {
          endpoint: "/checkToken",
          method: "GET",
          description: "Check if the token is valid",
          headers: {
            Authorization: "Bearer <token>"
          }
        }
      ];

    return(<>
      <h1>API Documentation</h1>
      {apiDocumentation.map((endpoint, index) => (
        <section key={index}>
          <h2>{endpoint.endpoint}</h2>
          <p>Method: {endpoint.method}</p>
          <p>Description: {endpoint.description}</p>
          {endpoint.headers && (
            <div>
              <h3>Headers:</h3>
              <ul>
                {Object.entries(endpoint.headers).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
          {endpoint.body && (
            <div>
              <h3>Body:</h3>
              <ul>
                {Object.entries(endpoint.body).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
          {endpoint.returns && (
            <div>
              <h3>Returns:</h3>
              {/* <ul>
                {endpoint.returns.map(({ code, message }) => (
                  <li key={code}>{code}: {message}</li>
                ))}
              </ul> */}
              <code>
                {endpoint.returns.map(({ code, message }) => (
                  <div key={code}>
                    {"{"}<br/>
                    <span>code: {code}</span><br/>
                    <span>message: {message}</span><br/>
                    {"}"}
                  </div>
                ))}
              </code><br/>
            </div>
          )}
        </section>
      ))}
    </>);
}

export default DocApi;