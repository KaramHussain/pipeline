var jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.authenticate = (req, res, next) => {
    var authorization = req.header("Authorization");
    if (authorization) {
        var token = authorization.split(" ");
        try {
            jwt.verify(token[1], process.env.JWT_SECRET, async (err, getuser) => {
                if (err) {
                    return res.json({
                        status: 0,
                        msg: "Failed to authenticate token.",
                    });
                } else {
                     const user = await User.findByPk(getuser.id)
                    if (user) {
                            req.user = user.dataValues;
                            next();
                    } else {
                        return res.json({
                            status: 0,
                            message: "Sorry your account not found",
                        });
                    }

                }
            });
        } catch (e) {
            return res.json({
                status: 0,
                message: e.message,
            });
        }
    }
};


