'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Fetch live IDs from dependencies
    const [roles] = await queryInterface.sequelize.query(`SELECT id, name FROM roles;`);
    const [moduleActions] = await queryInterface.sequelize.query(`SELECT id, code FROM module_actions;`);

    // Create fast lookup maps
    const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));
    const actionMap = Object.fromEntries(moduleActions.map(ma => [ma.code, ma.id]));

    // 2. Define the requested mapping rules using your precise "MODULE:ACTION" codes
    const permissionMapping = {
      DEVELOPER: [
        'APPLICATION:CREATE',
        'APPLICATION:READ',
        'ASSESSMENT:READ',
        'ASSESSMENT:SUBMIT',
        'INTERVIEW:READ'
      ],
      RECRUITER: [
        'JOB:CREATE',
        'JOB:READ',
        'JOB:UPDATE',
        'JOB:PUBLISH',
        'APPLICATION:READ',
        'APPLICATION:SHORTLIST',
        'APPLICATION:REJECT',
        'INTERVIEW:SCHEDULE'
      ],
      ADMIN: [
        'USER:READ',
        'USER:UPDATE',
        'COMPANY:READ',
        'COMPANY:APPROVE',
        'COMPANY:REJECT',
        'ROLE:READ',
        'AUDIT_LOG:READ'
      ],
      // SUPER_ADMIN dynamically receives absolutely everything mapped in module_actions
      SUPER_ADMIN: moduleActions.map(ma => ma.code)
    };

    // 3. Transform configurations into database insert rows
    const records = Object.entries(permissionMapping).flatMap(([roleName, actionCodes]) => {
      const roleId = roleMap[roleName];
      if (!roleId) return []; // Skip safely if role doesn't exist in DB yet

      return actionCodes
        .map(actionCode => {
          const moduleActionId = actionMap[actionCode];
          if (!moduleActionId) return null; // Skip if action hasn't been seeded in module_actions

          return {
            role_id: roleId,
            module_action_id: moduleActionId,
            status: true,
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date()
          };
        })
        .filter(Boolean); // Eliminate missing permissions safely
    });

    if (records.length > 0) {
      // Safely apply upsert logic to match unique key constraint requirements
      await queryInterface.bulkInsert('role_permissions', records, {
        updateOnDuplicate: ['status', 'is_deleted', 'updated_at']
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Truncate the table clean on database seed rollbacks
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
