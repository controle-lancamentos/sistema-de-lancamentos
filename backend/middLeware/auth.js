module.exports = function authUser(req, res, next) {

    req.user = { id: 1, name: 'control system' };

    next();

}