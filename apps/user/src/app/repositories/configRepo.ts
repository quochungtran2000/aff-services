import { ConfigPayload } from '@aff-services/shared/models/dtos';
import { CONFIG } from '@aff-services/shared/models/entities';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigRepo {
  private readonly logger = new Logger(`Micro-User.${ConfigRepo.name}`);
  constructor(@Inject('CONFIG_REPOSITORY') private readonly configRepository: Repository<CONFIG>) {}

  async getConfigs() {
    try {
      this.logger.log(`${this.getConfigs.name} called Query`);
      const [data, total] = await this.configRepository
        .createQueryBuilder('c')
        .where('1=1')
        .orderBy('c.created_at', 'DESC')
        .getManyAndCount();

      console.log({ data, total });

      return { total, data };
    } catch (error) {
      this.logger.error(`${this.getConfigs.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.getConfigs.name} Done `);
    }
  }

  async createConfig(data: ConfigPayload) {
    try {
      this.logger.log(`${this.createConfig.name} called Data:${JSON.stringify(data)}`);

      const exists = await this.configRepository
        .createQueryBuilder('c')
        .where('1=1')
        .andWhere('c.name = :name')
        .setParameters({ name: data.name })
        .getOne();

      if (exists) throw new BadRequestException('Đã tồn tại cấu hình');

      await this.configRepository.createQueryBuilder().insert().into(CONFIG).values(data).execute();
      return { message: 'Tạo thành công', status: 201 };
    } catch (error) {
      this.logger.error(`${this.createConfig.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.createConfig.name} Done `);
    }
  }

  async updateConfig(data: ConfigPayload) {
    try {
      this.logger.log(`${this.updateConfig.name} called Data:${JSON.stringify(data)}`);

      const exists = await this.configRepository
        .createQueryBuilder('c')
        .where('1=1')
        .andWhere('c.name = :name')
        .setParameters({ name: data.name })
        .getOne();

      if (!exists) throw new BadRequestException('Không tìm thấy cấu hình');

      await this.configRepository
        .createQueryBuilder()
        .update(CONFIG)
        .set({ value: data.value })
        .where('name = :name')
        .setParameters({ name: data.name })
        .execute();
      return { message: 'Cập nhật thành công', status: 200 };
    } catch (error) {
      this.logger.error(`${this.updateConfig.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.updateConfig.name} Done `);
    }
  }

  async deleteConfig(configName: string) {
    try {
      this.logger.log(`${this.deleteConfig.name} called Query:${JSON.stringify(configName)}`);

      const exists = await this.configRepository
        .createQueryBuilder('c')
        .where('1=1')
        .andWhere('c.name = :name')
        .setParameters({ name: configName })
        .getOne();

      if (!exists) throw new BadRequestException('Không tìm thấy cấu hình');

      await this.configRepository
        .createQueryBuilder()
        .delete()
        .from(CONFIG)
        .where('name = :name')
        .setParameters({ name: configName })
        .execute();
      return { message: 'Xóa thành công', status: 200 };
    } catch (error) {
      this.logger.error(`${this.deleteConfig.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.deleteConfig.name} Done `);
    }
  }

  async getOneByName(name: string) {
    try {
      this.logger.log(`${this.getOneByName.name} called Query:${JSON.stringify(name)}`);

      const exists = await this.configRepository
        .createQueryBuilder('c')
        .where('1=1')
        .andWhere('c.name = :name')
        .setParameters({ name })
        .getOne();

      if (!exists) throw new RpcException(`Không tìm thấy cấu hình có tên :${name}`);

      return exists.value;
    } catch (error) {
      this.logger.error(`${this.getOneByName.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }
}
