import { UpdateUserDTO, UserQuery } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { UserRepo } from '../repositories/userRepo';
import { v2 as cloudinary } from 'cloudinary';
import { RpcException } from '@nestjs/microservices';

cloudinary.config({
  cloud_name: 'hunghamhoc',
  api_key: '879146363472782',
  api_secret: 'QXzmcJ8YTysTEXVWvzOPvH_Yi9k',
  secure: true,
});

@Injectable()
export class UserService {
  private readonly logger = new Logger(`Micro-User.${UserService.name}`);
  constructor(private readonly userRepo: UserRepo) {}

  async adminGetUsers(query: UserQuery) {
    this.logger.log(`${this.adminGetUsers.name} called`);
    return this.userRepo.getUsers(query);
  }

  async uploadFile(file: any) {
    console.log({ file });
    try {
      const data = Buffer.from(file.buffer).toString('base64');
      const result = cloudinary.uploader.upload(`data:image/png;base64,${data}`, {
        filename_override: `thumbnail_${Date.now()}`,
        public_id: `thumbnail_${Date.now()}`,
        type: '',
        folder: 'aff_thumbnail',
      });

      return result;
    } catch (error) {
      console.log(error.message);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }

  async updateUser(data: UpdateUserDTO) {
    return this.userRepo.updateUser(data);
  }
}
