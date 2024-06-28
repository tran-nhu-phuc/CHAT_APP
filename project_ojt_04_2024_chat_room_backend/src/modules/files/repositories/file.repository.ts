import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { Repository } from 'typeorm';

class FileRepository {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}
}
export default FileRepository;
