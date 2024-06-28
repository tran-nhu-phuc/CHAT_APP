import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { IRoomCreateResponse } from '../responses/roomCreate.response';
import { IRoomCreate } from '../types/room.type';
import { SelectData } from 'src/common/param';
import { RoomResponse } from '../responses/room.response';
const logger = new Logger('Room Repository');

class RoomRepository {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  /**
   *
   * @param dataRoomQuery {
   * ...query
   * }
   * @returns Promise[]
   * describe: find all room
   */
  async getAll(dataRoomQuery: SelectData): Promise<RoomResponse[]> {
    try {
      return await this.roomRepository.find(dataRoomQuery);
    } catch (error) {
      logger.error(error.message);

      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Create new rooms
   *
   * @param data - IRoomCreate[]
   * @returns - IRoomCreateResponse[]
   */
  async create(data: IRoomCreate[]): Promise<IRoomCreateResponse[]> {
    try {
      return await this.roomRepository.save(data);
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Find one by id
   *
   * @param id - number
   * @returns IRoomCreateResponse
   */
  async findOne(id: number): Promise<IRoomCreateResponse> {
    try {
      return await this.roomRepository.findOne({ where: { id } });
    } catch (error) {
      logger.error(error.message);

      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Update room by roomId
   *
   * @param name - name of the room
   * @param roomId - id of the room
   * @returns UpdateResult
   */
  async updateRoom(id: number, data: any): Promise<UpdateResult> {
    try {
      return await this.roomRepository.update(id, data);
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
export default RoomRepository;
