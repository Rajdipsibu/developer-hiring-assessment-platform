"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("otp_verification", {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      otp_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      purpose: {
        type: Sequelize.ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE', 'LOGIN', 'MFA'),
        allowNull: false,
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      used_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
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

    // Find OTP records belonging to a user.
    await queryInterface.addIndex("otp_verification", ["user_id"], {
      name: "otp_verification_user_id_index",
    });

    // Useful for finding expired OTPs.
    await queryInterface.addIndex("otp_verification", ["expires_at"], {
      name: "otp_verification_expires_at_index",
    });

    // Useful when filtering OTPs by purpose.
    await queryInterface.addIndex(
      "otp_verification",
      ["user_id", "purpose"],
      {
        name: "otp_verification_user_id_purpose_index",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("otp_verification");
  },
};