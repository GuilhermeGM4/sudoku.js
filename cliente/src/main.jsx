// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Board from './components/board.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import BoardList from './components/BoardList.jsx'
import Profile from './components/Profile.jsx'
import DocApi from './components/DocApi.jsx'
import CreateBoard from './components/CreateBoard.jsx'
import UserManual from './components/UserManual.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "board",
                element: <BoardList />
            },
            {
                path: "board/:id",
                element: <Board />
            },
            {
                path: "board/create",
                element: <CreateBoard />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "user/:id",
                element: <Profile />
            },
            {
                path: "apiDoc",
                element: <DocApi />
            },
            {
                path: "userManual",
                element: <UserManual />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />,
)

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
