/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  await knex('role_access').del();
  await knex('user_roles').del();
  await knex('menus').del();
  await knex('roles').del();
  await knex('users').del();

  const [roleAdmin, roleManager] = await knex('roles').insert([
    { name: 'Admin' },
    { name: 'Manager' }
  ]).returning('role_id');

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const [user1] = await knex('users').insert([
    { username: 'budi_admin', password: hashedPassword }
  ]).returning('user_id');

  const [user2] = await knex('users').insert([
    { username: 'andi_ganda', password: hashedPassword }
  ]).returning('user_id');

  await knex('user_roles').insert([
    { user_id: user1.user_id, role_id: roleAdmin.role_id },
    { user_id: user2.user_id, role_id: roleAdmin.role_id },
    { user_id: user2.user_id, role_id: roleManager.role_id }
  ]);

  const menuData = [
    { menu_id: 1, name: 'Menu 1', path: '/menu-1', parent_id: null, order_index: 1 },
    { menu_id: 2, name: 'Menu 1.1', path: '/menu-1/1', parent_id: 1, order_index: 1 },
    { menu_id: 3, name: 'Menu 1.2', path: '/menu-1/2', parent_id: 1, order_index: 2 },
    { menu_id: 4, name: 'Menu 1.2.1', path: '/menu-1/2/1', parent_id: 3, order_index: 1 },
    { menu_id: 5, name: 'Menu 1.2.2', path: '/menu-1/2/2', parent_id: 3, order_index: 2 },
    { menu_id: 6, name: 'Menu 1.3', path: '/menu-1/3', parent_id: 1, order_index: 3 },
    { menu_id: 7, name: 'Menu 1.3.1', path: '/menu-1/3/1', parent_id: 6, order_index: 1 },
    { menu_id: 8, name: 'Menu 2', path: '/menu-2', parent_id: null, order_index: 2 },
    { menu_id: 9, name: 'Menu 2.1', path: '/menu-2/1', parent_id: 8, order_index: 1 },
    { menu_id: 10, name: 'Menu 2.2', path: '/menu-2/2', parent_id: 8, order_index: 2 },
    { menu_id: 11, name: 'Menu 2.2.1', path: '/menu-2/2/1', parent_id: 10, order_index: 1 },
    { menu_id: 12, name: 'Menu 2.2.2', path: '/menu-2/2/2', parent_id: 10, order_index: 2 },
    { menu_id: 13, name: 'Menu 2.2.2.1', path: '/menu-2/2/2/1', parent_id: 12, order_index: 1 },
    { menu_id: 14, name: 'Menu 2.2.2.2', path: '/menu-2/2/2/2', parent_id: 12, order_index: 2 },
    { menu_id: 15, name: 'Menu 2.2.3', path: '/menu-2/2/3', parent_id: 10, order_index: 3 },
    { menu_id: 16, name: 'Menu 2.3', path: '/menu-2/3', parent_id: 8, order_index: 3 },
    { menu_id: 17, name: 'Menu 3', path: '/menu-3', parent_id: null, order_index: 3 },
    { menu_id: 18, name: 'Menu 3.1', path: '/menu-3/1', parent_id: 17, order_index: 1 },
    { menu_id: 19, name: 'Menu 3.2', path: '/menu-3/2', parent_id: 17, order_index: 2 }
  ];

  await knex('menus').insert(menuData);

  const accessData = menuData.map(m => ({
    role_id: roleAdmin.role_id,
    menu_id: m.menu_id
  }));

  await knex('role_access').insert(accessData);
};
