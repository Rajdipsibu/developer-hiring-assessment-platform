'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [modules] = await queryInterface.sequelize.query(`SELECT id, code FROM modules;`);
    const [actions] = await queryInterface.sequelize.query(`SELECT id, code FROM actions;`);

    const moduleMap = Object.fromEntries(modules.map(m => [m.code, m.id]));
    const actionMap = Object.fromEntries(actions.map(a => [a.code, a.id]));

    const relationships = {
      JOB: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH'],
      APPLICATION: ['READ', 'UPDATE', 'SHORTLIST', 'REJECT', 'ASSIGN'],
      ASSESSMENT: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'PUBLISH'],
      INTERVIEW: ['CREATE', 'READ', 'UPDATE', 'CANCEL', 'SCHEDULE'],
      USER: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      COMPANY: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      QUESTION: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      NOTIFICATION: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      REPORT: ['READ'],
      ROLE: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'ASSIGN'],
      AUDIT_LOG: ['READ']
    };

    // Declarative data transformation using flatMap
    const records = Object.entries(relationships).flatMap(([modCode, actionCodes]) => {
      const moduleId = moduleMap[modCode];
      if (!moduleId) return []; // Skips mapping safely if module missing

      return actionCodes
        .map(actCode => {
          const actionId = actionMap[actCode];
          if (!actionId) return null; // Flag missing actions

          return {
            name: `${modCode}_${actCode}`,
            code: `${modCode}:${actCode}`,
            module_id: moduleId,
            action_id: actionId,
            description: `Allows executing ${actCode.toLowerCase()} operations on the ${modCode.toLowerCase()} module.`,
            status: true,
            is_deleted: false,
            created_at: new Date(),
            updated_at: new Date()
          };
        })
        .filter(Boolean); // Filters out any null instances safely
    });

    if (records.length > 0) {
      await queryInterface.bulkInsert('module_actions', records, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('module_actions', null, {});
  }
};
