import UserInRoomRepository from '../repositories/userInRoom.repository';
import { UserInRoomResponse } from '../responses/userInRoom.response';
import { Like } from 'typeorm';
import { QueryRequest } from 'src/common/queryRequest';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  IMemberResponse,
  IMemberSocketResponse,
} from '../responses/userInRoom.response';
import {
  CreateMembersRequest,
  RemoveMembersRequest,
} from '../requests/userInRoom.request';
import RoomRepository from 'src/modules/rooms/repositories/room.repository';

const logger = new Logger('UserInRoom Service');

@Injectable()
class UserInRoomService {
  constructor(
    private userInRoomRepository: UserInRoomRepository,
    private roomRepository: RoomRepository,
  ) {}

  /**
   * Add members if had room
   *
   * @param data - CreateMembersRequest
   * @req - ParameterDecorator
   * @return IMemberSocketResponse
   */
  async addMembers(
    data: CreateMembersRequest,
    id: number,
    role: number,
  ): Promise<IMemberSocketResponse> {
    try {
      // Check user adding
      const roomId = data.roomId;
      const check = await this.roomRepository.findOne(roomId);
      if (check.creatorId !== id && role === 1)
        throw new UnauthorizedException();

      // Convert data for Add Members
      const dataMembers = data.membersId.map((item: number) => ({
        roomId,
        userId: item,
      }));

      // Add members
      const result = await this.userInRoomRepository.addMember(dataMembers);

      // Convert Array to IMemberSocketResponse
      const membersId = result.map((member: IMemberResponse) => member.userId);
      const dataGateway = { roomId, membersId };
      if (!result) {
        logger.error('Error adding members');
      } else {
        logger.log('Members added');

        // Return data for Gateway
        return dataGateway;
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /**
   *
   * @param limit {number} the value to limit
   * @param page {number} the value to get count page
   * @param search {string} the value to search
   * @param roomId {number} the id value room entity
   * @returns Promise []
   * describe: get all value users in room with relationship room
   */
  async getAllUserByRoom(
    query: QueryRequest,
    roomId: number,
  ): Promise<UserInRoomResponse[]> {
    try {
      const limit = query.limit || 20;

      const page = query.page || 1;

      const search = query.search || '';

      const offset = (page - 1) * limit;

      const dataUserInRoomQuery = {
        where: {
          roomId,
          user: {
            lastName: Like(`%${search}%`),
          },
        },

        relations: {
          user: true,
        },

        select: {
          user: {
            firstName: true,
            lastName: true,
            id: true,
            avatar: true,
            role: true,
          },
        },

        take: limit,
        skip: offset,
      };

      return await this.userInRoomRepository.getAllUserByRoom(
        dataUserInRoomQuery,
      );
    } catch (error) {
      logger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   * Removes members from the room
   *
   * @param data
   * @return IMemberSocketResponse
   */
  async removeMembers(
    data: RemoveMembersRequest,
    id: number,
    role: number,
  ): Promise<boolean> {
    try {
      // Find one room by roomId
      const roomId = data.roomId;
      const room = await this.roomRepository.findOne(roomId);

      // Check user removing
      if (id !== room.creatorId && role === 1)
        throw new UnauthorizedException();

      // Convert data for Remove Members
      const userInRoomData =
        await this.userInRoomRepository.getByRoomIdAndUserId(data);
      const dataRemove = userInRoomData.map((item: IMemberResponse) => item.id);

      // Remove members
      const result = await this.userInRoomRepository.removeMembers(dataRemove);
      if (result.affected === 0) {
        logger.error('Error removing members');
      } else {
        logger.log('Members removed');
        return true;
      }
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  /** @param sort {FindOptionsOrderValue} The value to order
   * @param limit {number} the value to limit
   * @param page {number} the value to get count page
   * @param search {string} the value to search
   * @param userId {number} the id value user entity
   * @returns Promise[]
   * describe: get all value room with relationship user
   */
  async getAllByUser(
    query: QueryRequest,
    userId: number,
  ): Promise<UserInRoomResponse[]> {
    try {
      const sort = query.sort || 'DESC';

      const limit = query.limit || 20;

      const page = query.page || 1;

      const search = query.search || '';

      const offset = (page - 1) * limit;

      const dataUserInRoomQuery = {
        where: {
          userId,
          room: {
            name: Like(`%${search.toLocaleLowerCase()}%`),
            isDelete: 0,
          },
        },

        relations: {
          room: {
            lastMessage: {
              user: true,
            },
          },
        },

        select: {
          user: {
            firstName: true,
            lastName: true,
            id: true,
            createdAt: true,
            avatar: true,
            role: true,
          },
        },

        take: limit,

        skip: offset,

        order: {
          room: {
            updatedAt: sort,
          },
        },
      };

      return await this.userInRoomRepository.getAllByUser(dataUserInRoomQuery);
    } catch (error) {
      logger.error(error.message);
      throw new Error(error.message);
    }
  }
}
export default UserInRoomService;
