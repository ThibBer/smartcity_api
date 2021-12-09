const jwt = require('jsonwebtoken');
const ADMIN_ROLE = "admin";

function userIsAdmin(user){
    return userHaveRole(user, ADMIN_ROLE);
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

/*USER*/
module.exports.canPatchUser = (req, res, next) => {
    const user = req.session;

    if(userIsAdmin(user) || (req.body?.role !== ADMIN_ROLE && user.id === parseInt(req.body?.id))){
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.canPostUser = (req, res, next) => {
    const role = req.body?.role;

    if(role === undefined){
        res.sendStatus(400);
    }else if(req.body?.role !== ADMIN_ROLE){
        next();
    } else {
        const headerAuth = req.get('authorization');

        if(headerAuth !== undefined && headerAuth.includes("Bearer")){
            const [_, jwtToken] =  headerAuth.split(' ');

            try{
                const decodedJwtToken = jwt.verify(jwtToken, process.env.SECRET_TOKEN);

                if(decodedJwtToken.user.role === ADMIN_ROLE){
                    next();
                }else{
                    res.sendStatus(403);
                }
            } catch (e) {
                console.error(e);
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(401);
        }
    }
}

module.exports.canGetUser = (req, res, next) => {
    const user = req.session;
    const id = parseInt(req.params.id)

    if(userIsAdmin(user) || user.id === id){
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.canDeleteUser = (req, res, next) => {
    const user = req.session;

    if(userIsAdmin(user) || user.id === req.body?.id){
        next();
    } else {
        res.sendStatus(403);
    }
}

/*REPORT*/
module.exports.canDoActionOnReport = (req, res, next) => {
    const user = req.session;
    const reporter = req.body?.reporter;

    if(userIsAdmin(user) && reporter === undefined || user.id === reporter?.id || user.id === parseInt(reporter)){
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.canGetReportsForUser = (req, res, next) => {
    const user = req.session;
    const userId = parseInt(req.params?.userId);

    if(isNaN(userId)){
        res.sendStatus(400);
    }else{
        if(userIsAdmin(user) || user.id === userId){
            next();
        } else {
            res.sendStatus(403);
        }
    }
}

/* PARTICIPATION */
module.exports.canDoActionOnParticipation = (req, res, next) => {
    const user = req.session;
    const participant = req.body?.participant;

    if(participant === undefined || (typeof participant === "number" && isNaN(participant))){
        res.sendStatus(400);
    }else{
        if(userIsAdmin(user) || user.id === participant?.id || user.id === parseInt(participant)){
            next();
        } else {
            res.sendStatus(403);
        }
    }
}

/* EVENT */
module.exports.canDoActionOnEvent = (req, res, next) => {
    const user = req.session;
    const creator = req.body?.creator;

    if((userIsAdmin(user) && creator === undefined) || user.id === creator?.id || user.id === parseInt(creator)){
        next();
    } else {
        res.sendStatus(403);
    }
}