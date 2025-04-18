import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function Settings() {
    const{setAuth} = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        setAuth(undefined)
        navigate("/login")
    }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Settings</h2>
      <button
        onClick={handleLogout}
        style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}
      >
        Logout
      </button>
      </div>
  )
}

export default Settings