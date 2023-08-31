const Users = require('../models/User');
const constant = require('../config/constant');
const { Op } = require('sequelize');
const jwt_decode = require('jwt-decode');

const { isPasswordMatch, signAccessToken } = require('../helpers/hash.helper');
const logUserActivity = require('../helpers/userActivityLogger');

module.exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await Users.findOne({
			where: { email: email.toLowerCase() },
		});
		if (!user) {
			return res.status(201).json({ message: constant.ACCOUNT_NOT_FOUND });
		}
		const isMatch = await isPasswordMatch(password, user.password);
		if (!isMatch) {
			return res.status(201).json({ message: constant.INVALID_PASSWORD });
		}

		await Users.update(
			{ lastLogin: new Date() },
			{
				where: { id: user.id },
			}
		);
		const token = await signAccessToken(user);
		res.json({
			success: true,
			token: token,
			user: user,
		});
	} catch (e) {
		return res.status(500).json({ message: e.message, status: 0 });
	}
};
module.exports.UserCreation = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			throw { status: 400, message: 'Required fields cannot be empty' };
		}
		const getuser = await Users.findOne({
			where: { email: email },
		});
		if (getuser) {
			return res.json({ message: constant.EMAIL_ALREADY_EXIST, status: 0 });
		}
		let userNew = await Users.create({
			name: name,
			email: email,
			password: password,
		});
		const user = await Users.findByPk(userNew.dataValues.id);
		return res
			.status(200)
			.json({ user, message: 'User created succcessfully' });
	} catch (e) {
		return res.status(500).json({ message: e.message, status: 0 });
	}
};

module.exports.findAll = async (req, res) => {
	try {
		const { userRoles } = constant;
		const users = await Users.findAll({
			where: { role: { [Op.ne]: userRoles.SUPER_ADMIN } },
		});
		return res.json(users);
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
};

module.exports.getallUsers = async (req, res) => {
	try {
		const users = await Users.findAll({
			where: { id: { [Op.ne]: req.user.id } },
		});
		return res.json(users);
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
};
``;

module.exports.updateProfile = async (req, res) => {
	try {
		const userId = req.user.id; // Assuming you have a user object available in the request
		const route = req.originalUrl;
		const userBody = req.body;
		if (req.file) {
			userBody['profile'] = req.file.filename;
		}
		const finduser = await Users.findOne({ where: { id: req.user.id } });
		const beforeChanges = finduser.dataValues;
		await Users.update({ ...userBody }, { where: { id: req.user.id } });
		const result = await Users.findByPk(req.user.id);
		const afterChanges = result.dataValues;

		logUserActivity(userId, route, beforeChanges, afterChanges);

		return res.json({ result, message: 'Profile updated successfully' });
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
};

module.exports.updateRole = async (req, res) => {
	try {
		await Users.update(
			{ role: req.body.role },
			{ where: { id: req.params.id } }
		);
		const user = await Users.findByPk(req.params.id);
		return res.status(200).json(user);
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
};

module.exports.currentUser = async (req, res) => {
	try {
		const user = await Users.findByPk(req.user.id);
		return res.json(user);
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
};

module.exports.deleteUser = async (req, res) => {
	try {
		const user = await Users.destroy({
			where: { id: req.params.id },
		});
		if (!user) {
			return res.json({ message: 'User not found', status: 0 });
		}
		return res.json({
			message: 'User deleted successfully',
			id: req.params.id,
		});
	} catch (e) {
		return res.json({ message: e.message, status: 0 });
	}
};

module.exports.loginMicrosoft = async (req, res) => {
	try {
		const { accessToken } = req.body;

		if (!accessToken) {
			return res.status(201).json({ message: 'Token is required' });
		}
		var decoded = jwt_decode(accessToken);
		const { name, oid, unique_name, upn, tid, sub } = decoded;
		const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
		if (decoded.exp > currentTime) {
			console.log('JWT is valid and has not expired.');

			const user = await Users.findOne({
				where: { msId: oid },
			});
			if (user) {
				await Users.update(
					{ lastLogin: new Date() },
					{
						where: { id: user.id },
					}
				);
				const token = await signAccessToken(user);
				res.json({
					success: true,
					token: token,
					user: user,
				});
			} else {
				const checkuser = await Users.findOne({
					where: { email: unique_name.toLowerCase() },
				});
				if (checkuser) {
					await Users.update(
						{ msId: oid, lastLogin: new Date() },
						{
							where: { id: checkuser.id },
						}
					);
					const token = await signAccessToken(user);
					res.json({
						success: true,
						token: token,
						user: user,
					});
				} else {
					return res
						.status(500)
						.json({ message: 'Sorry you have no access', status: 0 });
				}
			}
		} else {
			return res.status(500).json({ message: 'Token is expired', status: 0 });
		}
	} catch (e) {
		return res.status(500).json({ message: e.message, status: 0 });
	}
};
