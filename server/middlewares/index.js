// 🔐 Middleware לווידוא שהמשתמש הוא אדמין
// (פונקציה לדוגמה – אפשר להחליף בהתממשקות ל-Firebase)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied: Admins only.' });
    }
  };

  // 🔐 Middleware לווידוא שהמשתמש הוא אדמין
// (פונקציה לדוגמה – אפשר להחליף בהתממשקות ל-Firebase)
const getUser = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied: Admins only.' });
    }
  };