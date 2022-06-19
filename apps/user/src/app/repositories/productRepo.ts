import {
  BaseResponse,
  CrawlProductQuery,
  CreateProductTemplateDTO,
  PagingProductResponse,
  PagingProductTemplateResponse,
  ProductCommentResponseDTO,
  ProductTemplateDetailResponse,
  ProductTemplateQuery,
  ProductTemplateResponse,
  SaveProductTemplateParamDTO,
} from '@aff-services/shared/models/dtos';
import {
  Product,
  PRODUCT_COMMENT,
  PRODUCT_PRODUCT,
  PRODUCT_TEMPLATE,
  USER_SAVE_PRODUCT,
} from '@aff-services/shared/models/entities';
import { BadRequestException, HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepo {
  private readonly logger = new Logger(`Micro-User.${ProductRepo.name}`);

  constructor(
    @Inject('PRODUCT_REPOSITORY') private readonly productRepo: Repository<Product>,
    @Inject('PRODUCT_PRODUCT_REPOSITORY') private readonly productProductRepo: Repository<PRODUCT_PRODUCT>,
    @Inject('PRODUCT_TEMPLATE_REPOSITORY') private readonly productTemplateRepo: Repository<PRODUCT_TEMPLATE>,
    @Inject('PRODUCT_COMMENT_REPOSITORY') private readonly productCommentRepo: Repository<PRODUCT_COMMENT>,
    @Inject('USER_SAVE_PRODUCT_REPOSITORY') private readonly userSaveProductRepo: Repository<USER_SAVE_PRODUCT>,
    private httpService: HttpService
  ) {}

  async findAndCount(query: CrawlProductQuery) {
    const { skip, search, merchant, pageSize } = query;
    this.logger.log(`${this.findAndCount.name} called`);
    const qr = this.productRepo.createQueryBuilder('p').where('1=1');

    if (merchant) qr.andWhere('UPPER(p.merchant) = UPPER(:merchant)');
    if (search) qr.andWhere(`UPPER(p.name) like "%" || UPPER(:search) || "%"`);

    const [data, total] = await qr
      .take(pageSize)
      .skip(skip)
      .setParameters({ skip, search, merchant, pageSize })
      .getManyAndCount();
    return PagingProductResponse.from(total, data);
  }

  async adminUpdateProductTemplate() {
    try {
      this.logger.log(`${this.adminUpdateProductTemplate.name} called`);

      // const result = await this.productService.getProducts();
      const total = await this.productRepo
        .createQueryBuilder('p')
        // .where(`p.merchant = 'tiki'`)
        .andWhere('length(p.slug) > 13')
        .getCount();
      const size = 10;
      let page = 1;
      const totalPage = Math.round(total / size) + 1;

      console.log({ total, totalPage });
      while (page < totalPage) {
        try {
          const skip = (page - 1) * size;
          const data = await this.productRepo
            .createQueryBuilder('p')
            // .where(`p.merchant = 'tiki'`)
            .andWhere('length(p.slug) > 13')
            .take(size)
            .skip(skip)
            .getMany();

          for (const update of data) {
            // const { productId, ...data } = update;
            // let needUpdate = false;
            const tobeUpdate = CreateProductTemplateDTO.fromProduct(update);
            // console.log({ tobeUpdate });
            let productTemplate: PRODUCT_TEMPLATE;

            // const { raw } = await this.productTemplateRepo
            //   .createQueryBuilder()
            //   .insert()
            //   .into(PRODUCT_TEMPLATE)
            //   .values(tobeUpdate)
            //   .orUpdate(
            //     ['product_name', 'product_short_name', 'thumbnail', 'slug', 'updated_at'],
            //     ['product_template_id']
            //   )
            //   // .orIgnore(true)
            //   .returning('*')
            //   .execute();

            this.logger.log(`${this.adminUpdateProductTemplate.name} 1`);
            productTemplate = await this.productTemplateRepo
              .createQueryBuilder()
              .where('slug1 = :slug', { slug: tobeUpdate.slug1 })
              .getOne();

            this.logger.log(`${this.adminUpdateProductTemplate.name} 2`);
            if (!productTemplate) {
              const { generatedMaps } = await this.productProductRepo
                .createQueryBuilder()
                .insert()
                .into(PRODUCT_TEMPLATE)
                .values(tobeUpdate)
                .returning('*')
                .execute();

              productTemplate = generatedMaps[0] as PRODUCT_TEMPLATE;
              this.logger.log(`${this.adminUpdateProductTemplate.name} 3`);
            } else {
              this.logger.log(`${this.adminUpdateProductTemplate.name} 4`);
              await this.productTemplateRepo.update(
                { productTemplateId: productTemplate.productTemplateId },
                {
                  productName: tobeUpdate.productName,
                  productShortName: tobeUpdate.productShortName,
                  thumbnail: tobeUpdate.thumbnail,
                  updatedAt: new Date(),
                }
              );
            }

            // const a = await this.productTemplateRepo.save(await this.productTemplateRepo.create({ ...tobeUpdate }));
            // console.log({ a, count });
            // count = count + 1;
            // console.log({a});
            // return;

            if (productTemplate) {
              this.logger.log(`${this.adminUpdateProductTemplate.name} 5`);
              try {
                await this.productProductRepo
                  .createQueryBuilder()
                  .insert()
                  .into(PRODUCT_PRODUCT)
                  .values({ productTemplateId: productTemplate.productTemplateId, productId: update.productId })
                  // .orUpdate(['product_template_id', 'product_id'], ['product_template_id', 'product_id'])
                  .orIgnore(true)
                  .execute();
              } catch (error) {
                this.logger.error(`Update Exits:${error.message}`);
              }

              // this.logger.log(`PP[${raw[0].product_template_id}-${productId}]`);

              this.logger.log(`${this.adminUpdateProductTemplate.name} 6`);

              const relatedProducts = await this.productRepo
                .createQueryBuilder()
                .where('1 = 1')
                .andWhere('product_id != :productId')
                .andWhere(
                  `(name like '%' || :name || '%' or slug like  '%' || :slug || '%' or slug like '%' || :shortName || '%' )`
                )
                .andWhere('length(slug) > 13')
                .setParameters({
                  productId: update.productId,
                  name: update.name,
                  slug: update.slug,
                  shortName: productTemplate.productShortName,
                })
                .getMany();

              console.log(
                'relatived',
                relatedProducts?.[0] ? { product: relatedProducts?.[0], template: productTemplate } : ''
              );

              if (relatedProducts.length) {
                const values = relatedProducts.map((product) => {
                  return { productTemplateId: productTemplate.productTemplateId, productId: product.productId };
                });

                try {
                  this.logger.log(`${this.adminUpdateProductTemplate.name} 7`);
                  await this.productProductRepo
                    .createQueryBuilder()
                    .insert()
                    .into(PRODUCT_PRODUCT)
                    .values(values)
                    .orIgnore(true)
                    .execute();
                } catch (error) {
                  this.logger.error(`Update Exits:${error.message}`);
                }
              }
            }
            // if (a) {
            //   await this.productProductRepo
            //     .createQueryBuilder()
            //     .insert()
            //     .into(PRODUCT_PRODUCT)
            //     .values({ productTemplateId: a.productTemplateId, productId: update.productId })
            //     .orIgnore(true)
            //     .execute();
            //   // this.logger.log(`PP[${a.productTemplateId}-${productId}]`);

            //   const relatedProducts = await this.productRepo
            //     .createQueryBuilder()
            //     .where('1 = 1')
            //     .andWhere('product_id != :productId')
            //     .andWhere(`(name like '%' || :name || '%' or slug like  '%' || :slug || '%' )`)
            //     .andWhere('length(slug) > 13')
            //     .setParameters({ productId: update.productId, name: update.name, slug: update.slug })
            //     .getMany();

            //   if (relatedProducts.length) {
            //     const values = relatedProducts.map((product) => {
            //       return { productTemplateId: a.productTemplateId, productId: product.productId };
            //     });

            //     await this.productProductRepo
            //       .createQueryBuilder()
            //       .insert()
            //       .into(PRODUCT_PRODUCT)
            //       .values(values)
            //       .orIgnore(true)
            //       .execute();
            //   }
            // }
          }
        } catch (error) {
          this.logger.error(`Update Error:${error.message}`);
        }

        page = page + 1;
      }
      return;
    } catch (error) {
      this.logger.error(`${this.adminUpdateProductTemplate.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async getProductTemplate(query: ProductTemplateQuery) {
    try {
      this.logger.log(`${this.getProductTemplate.name} called`);
      const { pageSize, skip, search } = query;
      const qr = this.productTemplateRepo
        .createQueryBuilder('pt')
        .leftJoinAndSelect('pt.productProducts', 'pp')
        .leftJoinAndSelect('pp.product', 'p')
        .where('1 = 1');

      if (search) qr.andWhere(`UPPER(pt.product_name) like '%' || UPPER(:search) || '%'`);

      const [data, total] = await qr
        .take(pageSize)
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

  async getProductTemplateV2(query: ProductTemplateQuery) {
    try {
      this.logger.log(`${this.getProductTemplate.name} called`);
      const { pageSize, skip, search, categoryId } = query;
      const qr = this.productTemplateRepo
        .createQueryBuilder('pt')
        .leftJoin('pt.productProducts', 'pp')
        .leftJoin('pp.product', 'p')
        .leftJoin('p.variants', 'va')
        .leftJoin('va.images', 'vai')
        .leftJoin('p.crawlCategory', 'cc')
        .leftJoin('cc.mappingCategory', 'mc')
        .leftJoin('mc.category', 'c')
        .where('1 = 1')
        .andWhere('p.is_complete_update = true')
        .andWhere('p.is_complete_crawl = true');

      if (search) qr.andWhere(`UPPER(pt.product_name) like '%' || UPPER(:search) || '%'`);
      if (categoryId) qr.andWhere(`c.category_id in (:...categoryIds)`);

      const [data, total] = await qr
        .take(pageSize)
        .skip(skip)
        .setParameters({ search, categoryIds: [categoryId] })
        .orderBy('pt.productTemplateId', 'ASC')
        .getManyAndCount();
      return PagingProductTemplateResponse.from(total, data);
      // return { total, data };
    } catch (error) {
      this.logger.error(`${this.getProductTemplate.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async getProductTemplateDetailV2(productTemplateId) {
    try {
      this.logger.log(`${this.getProductTemplateDetailV2.name} called productTemplateId:${productTemplateId}`);
      const productDetail = await this.productTemplateRepo
        .createQueryBuilder('pt')
        .leftJoinAndSelect('pt.productProducts', 'pp')
        .leftJoinAndSelect('pp.product', 'p')
        .leftJoinAndSelect('p.variants', 'va')
        .leftJoinAndSelect('va.images', 'vai')
        // .leftJoin('p.crawlCategory', 'cc')
        // .leftJoin('cc.mappingCategory', 'mc')
        // .leftJoin('mc.category', 'c')
        .where('1 = 1')
        .andWhere('p.is_complete_update = true')
        .andWhere('p.is_complete_crawl = true')
        .andWhere('pt.product_template_id = :productTemplateId')
        .setParameters({ productTemplateId })
        .getOne();

      if (!productDetail) throw new BadRequestException('Không tìm thấy sản phẩm');

      return ProductTemplateDetailResponse.fromEntity(productDetail);
    } catch (error) {
      this.logger.error(`${this.getProductTemplateDetailV2.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    } finally {
      this.logger.log(`${this.getProductTemplateDetailV2.name} Done!.`);
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

  async getEcommerceProductComment(productId: string) {
    try {
      this.logger.log(`${this.getEcommerceProductComment.name} called productId:${productId}`);

      const data = await this.productCommentRepo
        .createQueryBuilder('pc')
        .leftJoinAndSelect('pc.images', 'i')
        .where('1=1')
        .andWhere('pc.product_id = :productId')
        .setParameters({ productId })
        .getMany();

      return data?.map((element) => ProductCommentResponseDTO.fromEntity(element));
    } catch (error) {
      this.logger.error(`${this.getProductTemplateDetail.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    } finally {
      this.logger.log(`${this.getEcommerceProductComment.name} Done`);
    }
  }

  async userSaveProduct(data: SaveProductTemplateParamDTO): Promise<BaseResponse> {
    try {
      let insert = true;
      const { productId, userId } = data;
      this.logger.log(`${this.userSaveProduct.name} called Data:${JSON.stringify(data)}`);

      const exists = await this.userSaveProductRepo.findOne({ productTemplateId: productId, userId });

      if (exists) {
        insert = false;
        await this.userSaveProductRepo
          .createQueryBuilder()
          .delete()
          .from(USER_SAVE_PRODUCT)
          .where('user_id = :userId')
          .andWhere('product_template_id = :productId')
          .setParameters({ productId, userId })
          .execute();
      } else {
        const existsProductTemplate = await this.productTemplateRepo.findOne({ productTemplateId: productId });
        if (!existsProductTemplate) throw new BadRequestException('Không tìm thấy sản phẩm');

        await this.userSaveProductRepo
          .createQueryBuilder()
          .insert()
          .into(USER_SAVE_PRODUCT)
          .values({ userId, productTemplateId: productId })
          .execute();
      }

      return { status: 200, message: `${insert ? 'Lưu' : 'Xóa'} thành công` };
    } catch (error) {
      this.logger.error(`${this.userSaveProduct.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    } finally {
      this.logger.log(`${this.userSaveProduct.name} Done`);
    }
  }

  async getSaveProduct(userId: number) {
    try {
      this.logger.log(`${this.getSaveProduct.name} called userId:${userId}`);
      const [data, total] = await this.productTemplateRepo
        .createQueryBuilder('pt')
        .leftJoin('pt.saveProducts', 'sp')
        .where('1=1')
        .andWhere('sp.user_id = :userId')
        .setParameters({ userId })
        .getManyAndCount();

      return { total, data: ProductTemplateResponse.fromEntities(data) };
    } catch (error) {
      this.logger.error(`${this.getSaveProduct.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    } finally {
      this.logger.log(`${this.getSaveProduct.name} Done`);
    }
  }

  async getLinkAffiliate() {
    try {
      this.logger.log(`${this.getLinkAffiliate.name} called`)
    } catch (error) {
      this.logger.error(`${this.getLinkAffiliate.name} Error:${error.message}`);
    } finally {
      this.logger.log(`${this.getLinkAffiliate.name} DONE ✅`);
    }
  }
}
