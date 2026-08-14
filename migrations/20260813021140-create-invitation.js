'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invitations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      workspaceId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'workspaces',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      invitedBy: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      status: {
        type: Sequelize.ENUM(
          'pending',
          'accepted',
          'rejected',
          'expired',
        ),
        allowNull: false,
        defaultValue: 'pending',
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invitations');

    // PostgreSQL requires the ENUM type to be removed separately.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_invitations_status";',
    );
  },
};