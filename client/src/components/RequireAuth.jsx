import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RequireAuth({ allowedRoles }){
    const { auth } = useAuth();
    const location = useLocation();

// אם המשתמש קיים ויש לו תפקיד שמתאים לאחד מהתפקידים המותרים - אפשר לגשת לדף
if (auth?.user?.role && allowedRoles?.includes(auth.user.role)) {
    return <Outlet />; // מציג את תוכן הרכיב המבוקש
  }
  
  // אם המשתמש קיים אבל אין לו הרשאה לתפקיד הזה - מעבירים אותו לדף unauthorized
  if (auth?.user) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  // אם אין משתמש בכלל (לא מחובר) - מפנים אותו לעמוד ההתחברות
  return <Navigate to="/login" state={{ from: location }} replace />;
  
      
}
// גיל כתב
export default RequireAuth;