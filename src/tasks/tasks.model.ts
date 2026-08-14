import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BoardList } from 'src/board_list/board_list.model';

@Table({
  tableName: 'tasks',
})
export class Task extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => BoardList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare boardListId: string;

  @BelongsTo(() => BoardList)
  declare boardList: BoardList;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare position: number;
}