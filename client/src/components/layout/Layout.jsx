import { Outlet,useNavigate } from "react-router-dom"
import "./Layout.css"

const Layout = () => {
    const navigate = useNavigate()
    return (
        <main className="App">
            <div className="top-bar">
                <h2>AmirMaster</h2>
                <button
                    className= "settings-btn"
                    onClick={() => navigate("/settings")}
                    >
                     ⚙️   
                </button>
                </div>
            <Outlet />
        </main>
    )
}

export default Layout