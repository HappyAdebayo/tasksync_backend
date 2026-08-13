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
} from 'sequelize-typescript';

import { Workspace } from '../workspaces/workspace.model';
import { User } from '../users/users.model';

@Table({
  tableName: 'invitations',
})
export class Invitation extends Model {
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare invitedBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare token: string;

  @Column({
    type: DataType.ENUM(
      'pending',
      'accepted',
      'rejected',
      'expired',
    ),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'accepted' | 'rejected' | 'expired';

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiresAt: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}