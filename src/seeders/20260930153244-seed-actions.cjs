'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const actionsList = [
      { name: 'Create', code: 'CREATE' },
      { name: 'Read', code: 'READ' },
      { name: 'Update', code: 'UPDATE' },
      { name: 'Delete', code: 'DELETE' },
      { name: 'Approve', code: 'APPROVE' },
      { name: 'Reject', code: 'REJECT' },
      { name: 'Assign', code: 'ASSIGN' },
      { name: 'Submit', code: 'SUBMIT' },
      { name: 'Publish', code: 'PUBLISH' },
      { name: 'Shortlist', code: 'SHORTLIST' },
      { name: 'Schedule', code: 'SCHEDULE' },
      { name: 'Cancel', code: 'CANCEL' }
    ];
    const records = actionsList.map(action => ({
      name: action.name,
      code: action.code,
      created_at: new Date(),
      updated_at: new Date()
    }));
    await queryInterface.bulkInsert('actions', records, {
      updateOnDuplicate: ['name', 'updated_at']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('actions', {
      code: [
        'CREATE',
        'READ',
        'UPDATE',
        'DELETE',
        'APPROVE',
        'REJECT',
        'ASSIGN',
        'SUBMIT',
        'PUBLISH',
        'SHORTLIST',
        'SCHEDULE',
        'CANCEL'
      ]
    }, {});
  }
};
