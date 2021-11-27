module.exports.mustBeManager = (req, res, next) => {
    const user = req.session;
    if(user !== undefined && user.authLevel === "admin"){
        next();
    } else {
        res.sendStatus(403);
    }
}