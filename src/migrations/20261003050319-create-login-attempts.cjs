"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("login_attempts", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },

      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("SUCCESS", "FAILED"),
        allowNull: false,
      },

      failure_reason: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("login_attempts", ["user_id"], {
      name: "login_attempts_user_id_index",
    });

    await queryInterface.addIndex("login_attempts", ["email"], {
      name: "login_attempts_email_index",
    });

    await queryInterface.addIndex("login_attempts", ["ip_address"], {
      name: "login_attempts_ip_address_index",
    });

    await queryInterface.addIndex("login_attempts", ["created_at"], {
      name: "login_attempts_created_at_index",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("login_attempts");
  },
};