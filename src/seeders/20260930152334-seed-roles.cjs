'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rolesList = [
      { name: 'SUPER_ADMIN', description: 'Highest access tier with total system control.' },
      { name: 'ADMIN', description: 'System administrator handling global operations.' },
      { name: 'COMPANY_ADMIN', description: 'Administrative owner of a specific corporate workspace.' },
      { name: 'HIRING_MANAGER', description: 'Oversees assessment lifecycles and final hiring processes.' },
      { name: 'RECRUITER', description: 'Manages candidate pipelines, job posts, and sourcing invitations.' },
      { name: 'INTERVIEWER', description: 'Conducts candidate evaluations and scores technical assessments.' },
      { name: 'DEVELOPER', description: 'Standard technical user completing assessments or profiles.' }
    ];

    const records = rolesList.map(role => ({
      name: role.name,
      description: role.description,
      status: true,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date()
    }));

    // Use bulkInsert with updateOnDuplicate to safely handle unique constraints
    await queryInterface.bulkInsert('roles', records, {
      updateOnDuplicate: ['description', 'status', 'is_deleted', 'updated_at']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
