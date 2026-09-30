"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Find SUPER_ADMIN role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'SUPER_ADMIN' LIMIT 1;`
    );

    if (!roles || roles.length === 0) {
      throw new Error(
        "SUPER_ADMIN role not found. Please run the roles seeder first."
      );
    }

    const superAdminRoleId = roles[0].id;

    // 2. Super Admin user
    const superAdminUser = {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password:
        "$2b$10$L8LxEoMoDCTWkWOECixy/uo6nuE2Af5LkvWxfaN5DNK4yscbtYcJ2",
      is_verified: true,
      status: "ACTIVE",
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // 3. Insert / update Super Admin user
    await queryInterface.bulkInsert("users", [superAdminUser], {
      updateOnDuplicate: [
        "name",
        "is_verified",
        "status",
        "is_deleted",
        "updated_at",
      ],
    });

    // 4. Get Super Admin user ID
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'superadmin@gmail.com' LIMIT 1;`
    );

    if (!users || users.length === 0) {
      throw new Error("Super Admin user could not be created.");
    }

    const userId = users[0].id;

    // 5. Check whether SUPER_ADMIN role is already assigned
    const [existingUserRoles] = await queryInterface.sequelize.query(
      `SELECT id
       FROM user_roles
       WHERE user_id = ${userId}
       AND role_id = ${superAdminRoleId}
       LIMIT 1;`
    );

    // 6. Assign SUPER_ADMIN role if not already assigned
    if (existingUserRoles.length === 0) {
      await queryInterface.bulkInsert("user_roles", [
        {
          user_id: userId,
          role_id: superAdminRoleId,
          created_at: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    // Find Super Admin user
    const [users] = await queryInterface.sequelize.query(
      `SELECT id
       FROM users
       WHERE email = 'superadmin@gmail.com'
       LIMIT 1;`
    );

    if (users && users.length > 0) {
      const userId = users[0].id;

      // Remove role assignment
      await queryInterface.bulkDelete(
        "user_roles",
        {
          user_id: userId,
        },
        {}
      );

      // Remove user
      await queryInterface.bulkDelete(
        "users",
        {
          id: userId,
        },
        {}
      );
    }
  },
};