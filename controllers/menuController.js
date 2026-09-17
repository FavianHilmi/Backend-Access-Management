const db = require('../config/db');

function buildMenuTree(items, parentId = null) {
  return items
    .filter(item => item.parent_id === parentId)
    .sort((a, b) => a.order_index - b.order_index)
    .map(item => ({
      menu_id: item.menu_id,
      name: item.name,
      path: item.path,
      children: buildMenuTree(items, item.menu_id)
    }));
}

exports.getUserMenus = async (req, res) => {
  const roleId = req.user.role_id;
  try {
    const userMenus = await db('menus')
      .join('role_access', 'menus.menu_id', '=', 'role_access.menu_id')
      .where('role_access.role_id', roleId)
      .select('menus.*');

    const menuTree = buildMenuTree(userMenus, null);

    return res.status(200).json({
      statusCode: 200,
      message: 'Berhasil mengambil menu',
      data: menuTree
    });

  } catch (error) {
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};