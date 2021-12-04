function userIsAdmin(user){
    return userHaveRole(user, "admin");
}

function userHaveRole(user, role){
    return user !== undefined && user.role === role;
}

module.exports.mustBeAdmin = (req, res, next) => {
    const user = req.session;

    if(userIsAdmin(user)){
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.canDoActionOnUser = (req, res, next) => {
    const user = req.session;
    console.log(user)
    console.log(req.body)

    if(userIsAdmin(user) || user.id === req.body?.id){
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.canDoActionOnEvent = (req, res, next) => {
    const user = req.session;
    const creator = req.body?.creator;

    if(userIsAdmin(user) || user.id === creator?.id || user.id === creator){
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.canDoActionOnReport = (req, res, next) => {
    const user = req.session;
    const reporter = req.body?.reporter;

    if(userIsAdmin(user) || user.id === reporter?.id || user.id === reporter){
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.canDoActionOnParticipation = (req, res, next) => {
    const user = req.session;
    const participant = req.body?.participant;

    if(userIsAdmin(user) || user.id === participant?.id || user.id === participant){
        next();
    } else {
        res.sendStatus(403);
    }
}