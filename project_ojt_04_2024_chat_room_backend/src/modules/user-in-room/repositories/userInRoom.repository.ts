import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IMemberResponse } from '../responses/userInRoom.response';
import { UserInRoom } from '../entities/user-in-room.entity';
import { ICreateMembers } from '../types/createMembers.type';
import { RemoveMembersRequest } from '../requests/userInRoom.request';
import { UserInRoomResponse } from '../responses/userInRoom.response';
import { SelectData } from 'src/common/param';
const logger = new Logger('UserInRoom Repository ');
class UserInRoomRepository {
  constructor(
    @InjectRepository(UserInRoom)
    private userInRoomRepository: Repository<UserInRoom>,
  ) {}

  /**
   * Find all users in the room
   *
   * @param data - number[]
   * @returns IMemberResponse[]
   */
  async getAllByRoomId(roomId: number): Promise<IMemberResponse[]> {
    try {
      return await this.userInRoomRepository.find({ where: { roomId } });
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getByRoomIdAndUserId(
    data: RemoveMembersRequest,
  ): Promise<IMemberResponse[]> {
    try {
      return await this.userInRoomRepository.find({
        where: {
          roomId: data.roomId,
          userId: In(data.membersId),
        },
      });
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Add members
   *
   * @param newData - UserInRoomRequest[]
   * @returns IMemberResponse[]
   */
  async addMember(newData: ICreateMembers[]): Promise<IMemberResponse[]> {
    try {
      return await this.userInRoomRepository.save(newData);
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Remove members
   *
   * @param data - number[]
   * @returns DeleteResult
   */
  async removeMembers(data: number[]): Promise<DeleteResult> {
    try {
      return await this.userInRoomRepository.delete(data);
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * @param dataUserInRoomQuery // used to write query from service
   * @returns Promise[]
   * describe:Get data list member from database by  query roomId for room chat
   */
  async getAllUserByRoom(
    dataUserInRoomQuery: SelectData,
  ): Promise<UserInRoomResponse[]> {
    try {
      return await this.userInRoomRepository.find(dataUserInRoomQuery);
    } catch (error) {
      logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *
   * @param dataUserInRoomQuery
   * @returns Promise[]
   * describe: find all data list room by userId with query from service
   */
  async getAllByUser(
    dataUserInRoomQuery: SelectData,
  ): Promise<UserInRoomResponse[]> {
    try {
      return await this.userInRoomRepository.find(dataUserInRoomQuery);
    } catch (error) {
      logger.error(error.message);

      throw new InternalServerErrorException(error);
    }
  }

  /**
   *
   * @param userId
   * @param roomId
   * @returns Promise{}
   * describe: find one where userId and roomId
   */
  async findOneByRoomByUser(
    userId: number,
    roomId: number,
  ): Promise<UserInRoomResponse> {
    try {
      return await this.userInRoomRepository.findOne({
        where: {
          userId,
          roomId,
        },
      });
    } catch (error) {
      logger.error(error.message);

      throw new InternalServerErrorException(error);
    }
  }
}

export default UserInRoomRepository;
