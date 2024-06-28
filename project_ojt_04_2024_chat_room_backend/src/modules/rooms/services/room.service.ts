import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import RoomRepository from '../repositories/room.repository';
import { RoomCreateRequest } from '../requests/room.request';
import { EntityManager } from 'typeorm';
import UserInRoomRepository from 'src/modules/user-in-room/repositories/userInRoom.repository';
import { IRoomCreateResponse } from '../responses/roomCreate.response';
import { IMemberSocketResponse } from 'src/modules/user-in-room/responses/userInRoom.response';
import { RoomResponse } from '../responses/room.response';
import { Like } from 'typeorm';
import { QueryRequest } from 'src/common/queryRequest';
import { create } from 'lodash';

const logger = new Logger('Room Service');
@Injectable()
class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private memberRepository: UserInRoomRepository,
    private entityManager: EntityManager,
  ) {}

  /**
   * Create Room
   *
   * @param data
   * @returns IMemberSocketResponse[]
   */
  async create(
    data: RoomCreateRequest[],
    id: number,
  ): Promise<IMemberSocketResponse[]> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Set milliseconds to 0. Because mysql will round the milliseconds of the datetime data type, unexpected errors will occur.
      const date = Math.round(Date.now() / 1000) * 1000;

      // Add createdAt: datetime
      // Increase createdAt 1s to response of CreateRoom will have one key compare with data requested and get data for add members.
      const newData = data.map((item, index: number) => {
        return {
          ...item,
          createdAt: new Date(date + 1000 * index),
        };
      });

      // Handle request return array [{creatorId: value, name: value, createdAt: value},...]
      const roomData = newData.map((item) => {
        return {
          creatorId: id,
          name: item.name,
          createdAt: item.createdAt,
        };
      });

      // Create room
      const resultCreateRoom: any[] =
        await this.roomRepository.create(roomData);

      // Check response create Room
      if (resultCreateRoom.length !== newData.length) {
        queryRunner.rollbackTransaction();
        logger.error(`Error creating rooms`);
      }

      /**
       * Handle data for create members
       *
       * @input [{creatorId: value, name: value, createdAt: value},...]
       * @input [number[], number[], ...]
       *
       * @output [{roomId: value, userId: value}, ...]
       */
      const dataAddMembers = [];
      newData.forEach((item) => {
        // Find by createdAt
        const checkCreateRoom = resultCreateRoom.find(
          (element: IRoomCreateResponse) => {
            return (
              Date.parse(String(item.createdAt)) ===
              Date.parse(String(element.createdAt))
            );
          },
        );
        if (!checkCreateRoom) return;
        const result = item.membersId.map((memberId: number) => ({
          roomId: checkCreateRoom.id,
          userId: memberId,
        }));
        dataAddMembers.push(...result);
      });

      // Create members
      const resultCreateMembers =
        await this.memberRepository.addMember(dataAddMembers);

      // Check response when Create members. If don't have response then rollback Transaction and throw exception
      const dataCheckRooms = [];
      if (!resultCreateMembers) {
        logger.error('Error creating members');
        await queryRunner.rollbackTransaction();
        return;
      } else {
        /**
         * Handle @resultCreateMembers
         *
         * @input [{roomId: 1, userId: 2},{roomId: 1, userId: 6},{roomId: 3, userId: 4},{roomId: 3, userId: 19},{roomId: 3, userId:99}]
         * @output [{roomId: 1, membersId:[2, 6]},{roomId: 3, membersId:[4, 19, 99]}]
         */
        resultCreateMembers.forEach((item) => {
          const checkIndex = dataCheckRooms.findIndex(
            (element) => item.roomId === element.roomId,
          );
          if (checkIndex === -1) {
            dataCheckRooms.push({
              roomId: item.roomId,
              membersId: [item.userId],
            });
          } else {
            dataCheckRooms[checkIndex].membersId.push(item.userId);
          }
        });
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      // Return data for gateway
      return dataCheckRooms;
    } catch (error) {
      logger.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      logger.log('Finally Transaction');
      await queryRunner.release();
    }
  }

  /**
   * Update room by roomId
   *
   * @param name - name of the room
   * @param roomId - id of the room
   * @param id - id of Authentication
   * @param role - role of Authentication
   *
   * @returns - If update is successful return true.
   */
  async update(name: string, roomId: number, id: number, role: number) {
    try {
      // Check user is creator of room and role different 0 or not
      const room = await this.roomRepository.findOne(roomId);
      if (id !== room.creatorId && role === 1)
        throw new UnauthorizedException();

      // Update room by roomId
      const result = await this.roomRepository.updateRoom(roomId, {
        name: name,
      });
      if (result.affected !== 0) {
        return true;
      } else {
        logger.error('Updating room error');
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   *
   * @param sort {FindOptionsOrderValue} The value to order
   * @param limit {number} the value to limit
   * @param page {number} the value to get count page
   * @param search {string} the value to search
   * @returns Promise[]
   * describe : get all room
   */
  async getAll(query: QueryRequest): Promise<RoomResponse[]> {
    try {
      const sort = query.sort || 'DESC';

      const limit = Number(query.limit) || 20;

      const page = Number(query.page) || 1;

      const search = query.search || '';

      const offset = (page - 1) * limit;

      const dataRoomQuery = {
        order: {
          createdAt: sort,
        },

        where: { name: Like(`%${search.toLocaleLowerCase()}%`) },

        take: limit,

        skip: offset,

        relations: {
          userInRoom: {
            user: true,
          },
          creator: true,
        },
      };
      return await this.roomRepository.getAll(dataRoomQuery);
    } catch (error) {
      logger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   *
   * @param id - id of the room
   * @returns boolean
   */
  async delete(id: number) {
    try {
      const result = await this.roomRepository.updateRoom(id, { isDelete: 1 });
      if (result.affected !== 0) {
        return true;
      } else {
        logger.error('Deleting room error');
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
export default RoomService;
