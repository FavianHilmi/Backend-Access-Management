import React from 'react';

export default function SidebarMenu({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="pl-2 border-l border-gray-300">
      {items.map((menu) => (
        <li key={menu.menu_id} className="my-1">
          <span className="block p-1 hover:bg-gray-200 rounded">
            {menu.name}
          </span>
          
          {menu.children && menu.children.length > 0 && (
            <SidebarMenu items={menu.children} />
          )}
        </li>
      ))}
    </ul>
  );
}