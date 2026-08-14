import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Workspace } from '../workspaces/workspace.model';
import { User } from '../users/users.model';

@Table({
  tableName: 'workspace_members',
})
export class WorkspaceMember extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Workspace)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare workspaceId: string;

  @BelongsTo(() => Workspace)
  declare workspace: Workspace;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'viewer',
  })
  declare role: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}