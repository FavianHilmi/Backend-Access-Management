/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("user_id").primary();
      table.string("username", 100).notNullable().unique();
      table.string("password", 255).notNullable();
      table.timestamps(true, true);
    })
    .createTable("roles", (table) => {
      table.increments("role_id").primary();
      table.string("name", 100).notNullable();
    })
    .createTable("user_roles", (table) => {
      table
        .integer("user_id")
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("role_id")
        .unsigned()
        .references("role_id")
        .inTable("roles")
        .onDelete("CASCADE");
      table.primary(["user_id", "role_id"]);
    })
    .createTable("menus", (table) => {
      table.increments("menu_id").primary();
      table.string("name", 150).notNullable();
      table.string("path", 150).nullable();
      table
        .integer("parent_id")
        .unsigned()
        .references("menu_id")
        .inTable("menus")
        .onDelete("CASCADE")
        .nullable();
      table.integer("order_index").defaultTo(0);
    })
    .createTable("role_access", (table) => {
      table
        .integer("role_id")
        .unsigned()
        .references("role_id")
        .inTable("roles")
        .onDelete("CASCADE");
      table
        .integer("menu_id")
        .unsigned()
        .references("menu_id")
        .inTable("menus")
        .onDelete("CASCADE");
      table.primary(["role_id", "menu_id"]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("role_access")
    .dropTableIfExists("menus")
    .dropTableIfExists("user_roles")
    .dropTableIfExists("roles")
    .dropTableIfExists("users");
};
