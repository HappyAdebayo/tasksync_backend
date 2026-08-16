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
  HasMany,
} from 'sequelize-typescript';
import { Board } from 'src/boards/boards.model';
import { Task } from 'src/tasks/tasks.model';

@Table({
  tableName: 'board_lists',
})
export class BoardList extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '#4C5FD5',
  })
  declare color: string;

  @ForeignKey(() => Board)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare boardId: string;

  @BelongsTo(() => Board)
  declare board?: Board;

  @HasMany(() => Task)
  declare tasks?: Task[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}