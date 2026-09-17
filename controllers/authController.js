const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db('users').where({ username }).first();
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const roles = await db('user_roles')
      .join('roles', 'user_roles.role_id', '=', 'roles.role_id')
      .where('user_roles.user_id', user.user_id)
      .select('roles.role_id', 'roles.name');

    if (roles.length === 0) {
      return res.status(403).json({ message: 'User tidak memiliki akses role' });
    }

    if (roles.length > 1) {
      return res.status(200).json({
        statusCode: 200,
        message: 'Silakan pilih role untuk melanjutkan',
        data: {
          is_multiple_role: true,
          user_id: user.user_id,
          roles: roles
        }
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role_id: roles[0].role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      statusCode: 200,
      message: 'Login berhasil',
      data: {
        is_multiple_role: false,
        token: token,
        active_role: roles[0]
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

exports.selectRole = async (req, res) => {
  const { user_id, role_id } = req.body;

  try {
    const hasRole = await db('user_roles')
      .where({ user_id, role_id })
      .first();

    if (!hasRole) {
      return res.status(403).json({ message: 'Role tidak valid untuk user ini' });
    }

    const user = await db('users').where({ user_id }).first();
    const role = await db('roles').where({ role_id }).first();

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role_id: role.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      statusCode: 200,
      message: 'Role berhasil dipilih',
      data: {
        token: token,
        active_role: role
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};