const db = require('../config/db');

exports.createMenu = async (req, res) => {
  const { name, path, parent_id, order_index } = req.body;

  try {
    const [newMenu] = await db('menus')
      .insert({
        name,
        path: path || null,
        parent_id: parent_id || null,
        order_index: order_index || 0
      })
      .returning('*');

    return res.status(201).json({
      statusCode: 201,
      message: 'Menu berhasil ditambahkan',
      data: newMenu
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan menu', error: error.message });
  }
};

exports.assignRoleAccess = async (req, res) => {
  const { role_id, menu_ids } = req.body;
  
  if (!Array.isArray(menu_ids)) {
    return res.status(400).json({ message: 'menu_ids harus berupa Array' });
  }

  try {
    await db.transaction(async (trx) => {
      await trx('role_access').where({ role_id }).del();

      if (menu_ids.length > 0) {
        const payload = menu_ids.map((menu_id) => ({
          role_id,
          menu_id
        }));
        await trx('role_access').insert(payload);
      }
    });

    return res.status(200).json({
      statusCode: 200,
      message: 'Akses role berhasil diperbarui'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui akses role', error: error.message });
  }
};