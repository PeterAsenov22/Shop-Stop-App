module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      // If not authenticated - login.
      res.redirect('/')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        // If not authorized - login with proper account.
        res.redirect('/')
      }
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user && req.user.roles.indexOf('Admin') > -1) {
      next()
    } else {
      // If not authorized - login with proper account.
      res.redirect('/')
    }
  }
}
