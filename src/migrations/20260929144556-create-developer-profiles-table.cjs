'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("developer_profiles", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      headline: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      location: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      experience_years: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: true,
      },

      resume_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      github_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      linkedin_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      portfolio_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      status:{
        type:Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_deleted:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("developer_profiles");
  }
};
