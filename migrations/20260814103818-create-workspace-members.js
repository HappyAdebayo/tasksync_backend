'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspace_members', {
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

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      role: {
        type: Sequelize.ENUM(
          'owner',
          'editor',
          'viewer',
        ),
        allowNull: false,
        defaultValue: 'viewer',
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

    await queryInterface.addConstraint('workspace_members', {
      fields: ['workspaceId', 'userId'],
      type: 'unique',
      name: 'workspace_members_workspace_user_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('workspace_members');

    // PostgreSQL may retain the ENUM type after dropping the table.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_workspace_members_role";',
    );
  },
};