import { createContext, useState } from 'react'
import './App.css'
// import { Test } from './components/Test'
import { Outlet } from 'react-router-dom';
import Header from "./components/Header.jsx";
import Footer from './components/Footer.jsx';

export const Context = createContext();

function App() {
	const [token, setToken] = useState("");

	return (
		<Context.Provider value={[token, setToken]}>
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
		</Context.Provider>
	)
}

export default App
