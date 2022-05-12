import {
  CreateProductTemplateDTO,
  PagingProductResponse,
  PagingProductTemplateResponse,
  ProductTemplateDetailResponse,
  ProductTemplateQuery,
} from '@aff-services/shared/models/dtos';
import { Product, PRODUCT_PRODUCT, PRODUCT_TEMPLATE } from '@aff-services/shared/models/entities';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepo {
  private readonly logger = new Logger(`Micro-Crawl.${ProductRepo.name}`);

  constructor(
    @Inject('PRODUCT_REPOSITORY') private readonly productRepo: Repository<Product>,
    @Inject('PRODUCT_PRODUCT_REPOSITORY') private readonly productProductRepo: Repository<PRODUCT_PRODUCT>,
    @Inject('PRODUCT_TEMPLATE_REPOSITORY') private readonly productTemplateRepo: Repository<PRODUCT_TEMPLATE>
  ) {}

  async findAndCount() {
    this.logger.log(`${this.findAndCount.name} called`);
    const [data, total] = await this.productRepo.findAndCount();
    return PagingProductResponse.from(total, data);
  }

  async adminUpdateProductTemplate() {
    try {
      this.logger.log(`${this.adminUpdateProductTemplate.name} called`);

      // const result = await this.productService.getProducts();
      const total = await this.productRepo.count({ merchant: 'tiki' });
      const size = 10;
      let page = 1;
      const totalPage = Math.round(total / size) + 1;

      while (page < totalPage) {
        const skip = (page - 1) * size;
        const data = await this.productRepo
          .createQueryBuilder()
          .where(`merchant = :merchant`, { merchant: 'tiki' })
          .take(size)
          .skip(skip)
          .getMany();

        const tobeUpdate = CreateProductTemplateDTO.fromProducts(data);

        for (const update of tobeUpdate) {
          const { productId, ...data } = update;
          const { raw } = await this.productTemplateRepo
            .createQueryBuilder()
            .insert()
            .into(PRODUCT_TEMPLATE)
            .values(data)
            .orUpdate(['product_name', 'price', 'updated_at', 'thumbnail', 'average'], ['slug'])
            .returning('*')
            .execute();
          // break;
          await this.productProductRepo
            .createQueryBuilder()
            .insert()
            .into(PRODUCT_PRODUCT)
            .values({ productTemplateId: raw[0].product_template_id, productId })
            .orIgnore(true)
            .execute();
          this.logger.log(`PP[${raw[0].product_template_id}-${productId}]`);

          const relatedProducts = await this.productRepo
            .createQueryBuilder()
            .where('1 = 1')
            .andWhere('product_id != :productId')
            .andWhere(`(product_name like '%' || :productName || '%' or slug like  '%' || :slug || '%' )`)
            .setParameters({ productId, productName: data.productName, slug: data.slug })
            .getMany();

          if (relatedProducts.length) {
            const values = relatedProducts.map((product) => {
              return { productTemplateId: raw[0].product_template_id, productId: product.productId };
            });

            await this.productProductRepo
              .createQueryBuilder()
              .insert()
              .into(PRODUCT_PRODUCT)
              .values(values)
              .orIgnore(true)
              .execute();
          }
        }
        page = page + 1;
      }
    } catch (error) {
      this.logger.error(`${this.adminUpdateProductTemplate.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async getProductTemplate(query: ProductTemplateQuery) {
    try {
      this.logger.log(`${this.getProductTemplate.name} called`);
      const { page_size, skip, search } = query;
      const qr = this.productTemplateRepo
        .createQueryBuilder('pt')
        .leftJoinAndSelect('pt.productProducts', 'pp')
        .leftJoinAndSelect('pp.product', 'p')
        .where('1 = 1');

      if (search) qr.andWhere(`UPPER(pt.product_name) like '%' || UPPER(:search) || '%'`);

      const [data, total] = await qr
        .take(page_size)
        .skip(skip)
        .setParameters({ search })
        // .orderBy('pt.product_template_id', 'DESC') 
        .getManyAndCount();
      return PagingProductTemplateResponse.from(total, data);
    } catch (error) {
      this.logger.error(`${this.getProductTemplate.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async getProductTemplateDetail(id: number) {
    try {
      this.logger.log(`${this.getProductTemplateDetail.name} called`);

      const data = await this.productTemplateRepo
        .createQueryBuilder('pt')
        .leftJoinAndSelect('pt.productProducts', 'pp')
        .leftJoinAndSelect('pp.product', 'p')
        .where('pt.product_template_id = :id', { id })
        .getOne();

      if (!data) throw new BadRequestException('Không tìm thấy sản phẩm');

      return ProductTemplateDetailResponse.fromEntity(data);
    } catch (error) {
      this.logger.error(`${this.getProductTemplateDetail.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }
}
