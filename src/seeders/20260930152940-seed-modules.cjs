'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const modulesList = [
      { name: 'User Management', code: 'USER' },
      { name: 'Company Profiles', code: 'COMPANY' },
      { name: 'Job Pipelines', code: 'JOB' },
      { name: 'Candidate Applications', code: 'APPLICATION' },
      { name: 'Technical Assessments', code: 'ASSESSMENT' },
      { name: 'Question Bank', code: 'QUESTION' },
      { name: 'Interviews & Evaluations', code: 'INTERVIEW' },
      { name: 'System Notifications', code: 'NOTIFICATION' },
      { name: 'Analytics & Reports', code: 'REPORT' },
      { name: 'Roles & Permissions', code: 'ROLE' },
      { name: 'Security Audit Logs', code: 'AUDIT_LOG' }
    ];

    const records = modulesList.map(mod => ({
      name: mod.name,
      code: mod.code,
      status: true,
      is_deleted: false,
      created_at: new Date(),
      updated_at: new Date()
    }));

    // Use updateOnDuplicate to safely handle unique constraints if rows already exist
    await queryInterface.bulkInsert('modules', records, {
      updateOnDuplicate: ['name', 'status', 'is_deleted', 'updated_at']
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('modules', null, {});
  }
};
