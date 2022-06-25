import {
  CrawlUpdateProductCommentDTO,
  CrawlUpdateProductVariantsDTO,
  CreateProductDTO,
  CreateProductDTOV2,
  CreateProductTemplateDTO,
  ProductDetail,
} from '@aff-services/shared/models/dtos';
import {
  CRAWL_CATEGORY,
  Product,
  PRODUCT_COMMENT,
  PRODUCT_COMMENT_IMAGE,
  PRODUCT_PRODUCT,
  PRODUCT_TEMPLATE,
  PRODUCT_VARIANTS,
  PRODUCT_VARIANT_IMAGE,
} from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { FindConditions, In, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class ProductRepo {
  private readonly logger = new Logger(`Micro-Crawl.${ProductRepo.name}`);

  constructor(
    @Inject('PRODUCT_REPOSITORY') private readonly productRepo: Repository<Product>,
    @Inject('PRODUCT_VARIANT_IMAGE_REPOSITORY')
    private readonly productVariantImageRepo: Repository<PRODUCT_VARIANT_IMAGE>,
    @Inject('PRODUCT_VARIANTS_REPOSITORY') private readonly productVariantsRepo: Repository<PRODUCT_VARIANTS>,
    @Inject('PRODUCT_COMMENT_REPOSITORY') private readonly productCommentRepo: Repository<PRODUCT_COMMENT>,
    @Inject('PRODUCT_COMMENT_IMAGE_REPOSITORY')
    private readonly productCommentImageRepo: Repository<PRODUCT_COMMENT_IMAGE>,
    @Inject('CRAWL_CATEGORY_REPOSITORY') private readonly crawlCategoryRepo: Repository<CRAWL_CATEGORY>,

    @Inject('PRODUCT_PRODUCT_REPOSITORY') private readonly productProductRepo: Repository<PRODUCT_PRODUCT>,
    @Inject('PRODUCT_TEMPLATE_REPOSITORY') private readonly productTemplateRepo: Repository<PRODUCT_TEMPLATE>
  ) {}

  async insertData(data: CreateProductDTO[] | CreateProductDTOV2 | CreateProductDTOV2[]) {
    try {
      this.logger.log(`${this.insertData.name} called Data:${JSON.stringify(data)}`);
      return this.productRepo
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(data)
        .orUpdate(
          [
            'name',
            'is_complete_crawl',
            'is_complete_update',
            'original_url',
            'thumbnail',
            'average',
            'sold',
            'description',
            'merchant',
            'slug',
            'product_url',
            'updated_at',
            'lastest_crawl_at',
          ],
          ['product_id']
        )
        .orIgnore(true)
        .execute();
    } catch (error) {
      this.logger.error(`${this.insertData.name} error:${error.message}`);
    }
  }

  async findOne(query: FindConditions<Product>) {
    return await this.productRepo.findOneOrFail(query);
  }

  async insertProductDetail(parentProduct: Product, productDetail: ProductDetail) {
    try {
      const { categories, comments, description, productVariants } = productDetail;
      const { productId } = parentProduct;
      this.logger.log(`${this.insertProductDetail.name} called`);

      const dbCateogries = await this.crawlCategoryRepo.find({ crawlCategoryId: In(categories) });
      const insertCategory: string[] = [];
      categories.reverse().forEach((elm) => {
        const [category] = dbCateogries.filter((dbCategory) => dbCategory.crawlCategoryId === elm);
        if (category) insertCategory.push(category.crawlCategoryId);
      });

      const [childCategory] = insertCategory;
      if (!childCategory) throw new Error('Không tìm thấy danh mục');

      /** update product detail */
      await this.productRepo.update(
        { productId },
        {
          description,
          crawlCategoryId: childCategory,
          isCompleteUpdate: true,
          isCompleteCrawl: true,
          lastestCrawlAt: new Date(),
        }
      );

      // const tobeInsertVariants = productVariants.map((elm) => CrawlUpdateProductVariantsDTO.from(productId, elm));
      // console.log(tobeInsertVariants);

      for (const element of productVariants) {
        try {
          const { images, ...tobeValue } = element;
          const value = CrawlUpdateProductVariantsDTO.from(productId, tobeValue);
          this.logger.log(`Insert product variant called Data:${JSON.stringify(value)}`);
          const { generatedMaps } = await this.productVariantsRepo
            .createQueryBuilder('')
            .insert()
            .into(PRODUCT_VARIANTS)
            .values(value)
            .orUpdate(
              ['sale_price', 'list_price', 'is_sale', 'discount_percent', 'variant_image_url', 'variant_name'],
              ['product_id', 'sku']
            )
            .returning('*')
            .execute();

          const [inserted] = generatedMaps;
          if (inserted && images) {
            const imageValues = images.map((image) => {
              return { productId: value.productId, sku: value.sku, imageUrl: image };
            });
            await this.productVariantImageRepo
              .createQueryBuilder()
              .insert()
              .into(PRODUCT_VARIANT_IMAGE)
              .values(imageValues)
              .execute();
          }
        } catch (error) {
          this.logger.error(`Insert product variants Error:${error.message}`);
        }
      }

      /** insert product comment */

      // const tobeInsertComment = comments.map(comment => CrawlUpdateProductCommentDTO.from(productId, comment))

      for (const element of comments) {
        try {
          const { reviewImages, ...tobeValue } = element;
          const value = CrawlUpdateProductCommentDTO.from(productId, tobeValue);
          this.logger.log(`Insert product comments called Data:${JSON.stringify(value)}`);
          const { generatedMaps } = await this.productCommentRepo
            .createQueryBuilder('')
            .insert()
            .into(PRODUCT_COMMENT)
            .values(value)
            .returning('*')
            .execute();

          const [inserted] = generatedMaps;
          if (inserted && reviewImages) {
            const imageValues = reviewImages.map((image) => {
              return { productCommentId: inserted.productCommentId, imageUrl: image };
            });
            await this.productVariantImageRepo
              .createQueryBuilder()
              .insert()
              .into(PRODUCT_COMMENT_IMAGE)
              .values(imageValues)
              .execute();
          }
        } catch (error) {
          this.logger.error(`Insert product comments Error:${error.message}`);
        }
      }

      // for(const element of comments)

      // const exists = await this.findOne({productId: productDetail.})
    } catch (error) {
      this.logger.error(`${this.insertProductDetail.name} Error:${error.message}`);
    }
  }

  async getProductNeedCrawlAndUpdate(take: number, skip = 0): Promise<{ total: number; data: Product[] }> {
    try {
      this.logger.log(`${this.getProductNeedCrawlAndUpdate.name} called take:${take} skip:${skip} `);

      const [data, total] = await this.productRepo
        .createQueryBuilder('p')
        .where('1=1')
        .andWhere('p.is_complete_crawl = false')
        .andWhere('p.is_complete_update = false')
        // .andWhere('p.merchant = :merchant', { merchant: 'tiki' })
        .take(take)
        .skip(skip)
        .orderBy('p.created_at', 'DESC')
        .getManyAndCount();

      return { total, data };
    } catch (error) {
      this.logger.error(`${this.getProductNeedCrawlAndUpdate.name} Error:${error.message}`);
    }
  }

  // async updateProduct()

  // async updateProductDetail = (CrawlUpdateProductCommentDTO)

  async insertProductDetailsV2(productDetails: ProductDetail[]) {
    try {
      this.logger.log(`${this.insertProductDetailsV2.name} called`);
      await Promise.allSettled(productDetails.map((x) => this.insertProductDetailV2(x)));
    } catch (error) {
      this.logger.error(`${this.insertProductDetailsV2.name} Error:${error.message}`);
    }
  }

  async insertProductDetailV2(productDetail: ProductDetail) {
    try {
      const { categories, comments, description, productVariants } = productDetail;
      if (!productVariants.length) return;
      const productId = productVariants[0]?.productId;
      if (!productId) return;
      this.logger.log(`${this.insertProductDetailV2.name} called`);

      // const dbCateogries = await this.crawlCategoryRepo.find({ crawlCategoryId: In(categories) });
      // const insertCategory: string[] = [];
      // categories.reverse().forEach((elm) => {
      //   const [category] = dbCateogries.filter((dbCategory) => dbCategory.crawlCategoryId === elm);
      //   if (category) insertCategory.push(category.crawlCategoryId);
      // });

      // const [childCategory] = insertCategory;
      // if (!childCategory) throw new Error('Không tìm thấy danh mục');

      /** update product detail */
      await this.productRepo.update(
        { productId },
        {
          description,
          // crawlCategoryId: childCategory,
          isCompleteUpdate: true,
          isCompleteCrawl: true,
          lastestCrawlAt: new Date(),
        }
      );

      // const tobeInsertVariants = productVariants.map((elm) => CrawlUpdateProductVariantsDTO.from(productId, elm));
      // console.log(tobeInsertVariants);

      for (const element of productVariants) {
        try {
          const { images, ...tobeValue } = element;
          const value = CrawlUpdateProductVariantsDTO.from(productId, tobeValue);
          this.logger.log(`Insert product variant called Data:${JSON.stringify(value)}`);
          const { generatedMaps } = await this.productVariantsRepo
            .createQueryBuilder('')
            .insert()
            .into(PRODUCT_VARIANTS)
            .values(value)
            .orUpdate(
              ['sale_price', 'list_price', 'is_sale', 'discount_percent', 'variant_image_url', 'variant_name'],
              ['product_id', 'sku']
            )
            .returning('*')
            .execute();

          const [inserted] = generatedMaps;
          if (inserted && images) {
            const imageValues = images.map((image) => {
              return { productId: value.productId, sku: value.sku, imageUrl: image };
            });
            await this.productVariantImageRepo
              .createQueryBuilder()
              .insert()
              .into(PRODUCT_VARIANT_IMAGE)
              .values(imageValues)
              .execute();
          }
        } catch (error) {
          this.logger.error(`Insert product variants Error:${error.message}`);
        }
      }

      /** insert product comment */

      // const tobeInsertComment = comments.map(comment => CrawlUpdateProductCommentDTO.from(productId, comment))

      for (const element of comments) {
        try {
          const { reviewImages, ...tobeValue } = element;
          const value = CrawlUpdateProductCommentDTO.from(productId, tobeValue);
          this.logger.log(`Insert product comments called Data:${JSON.stringify(value)}`);
          const { generatedMaps } = await this.productCommentRepo
            .createQueryBuilder('')
            .insert()
            .into(PRODUCT_COMMENT)
            .values(value)
            .returning('*')
            .execute();

          const [inserted] = generatedMaps;
          if (inserted && reviewImages) {
            const imageValues = reviewImages.map((image) => {
              return { productCommentId: inserted.productCommentId, imageUrl: image };
            });
            await this.productVariantImageRepo
              .createQueryBuilder()
              .insert()
              .into(PRODUCT_COMMENT_IMAGE)
              .values(imageValues)
              .execute();
          }
        } catch (error) {
          this.logger.error(`Insert product comments Error:${error.message}`);
        }
      }

      // for(const element of comments)

      // const exists = await this.findOne({productId: productDetail.})
    } catch (error) {
      this.logger.error(`${this.insertProductDetailV2.name} Error:${error.message}`);
    }
  }

  async updateProduct(crawlHistoryId: number) {
    try {
      this.logger.log(`${this.updateProduct.name} called`);

      // const result = await this.productService.getProducts();
      const total = await this.productRepo
        .createQueryBuilder('p')
        .leftJoin('p.productHistory', 'ph')
        .where('1=1')
        .andWhere('ph.crawl_history_id = :crawlHistoryId', { crawlHistoryId })
        .andWhere('p.crawl_category_id is not null')
        .andWhere('length(p.slug) > 7')
        .getCount();

      console.log(total);
      const size = 10;
      let page = 1;
      const totalPage = Math.round(total / size) + 1;

      while (page < totalPage) {
        try {
          const skip = (page - 1) * size;
          const data = await this.productRepo
            .createQueryBuilder('p')
            .leftJoin('p.productHistory', 'ph')
            .where('1=1')
            .andWhere('p.crawl_category_id is not null')
            .andWhere('ph.crawl_history_id = :crawlHistoryId', { crawlHistoryId })

            .andWhere('length(p.slug) > 13')
            .take(size)
            .skip(skip)
            .getMany();

          console.log(data);

          await Promise.allSettled(data.map((update) => this.getRelatedProductV3(update)));
        } catch (error) {
          this.logger.error(`Update Error:${error.message}`);
        }

        page = page + 1;
      }
      return;
    } catch (error) {
      this.logger.error(`${this.updateProduct.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async getRelatedProduct(update: Product) {
    const tobeUpdate = CreateProductTemplateDTO.fromProduct(update);
    let productTemplate: PRODUCT_TEMPLATE;

    this.logger.log(`${this.updateProduct.name} 1`);
    productTemplate = await this.productTemplateRepo
      .createQueryBuilder()
      .where('slug1 = :slug', { slug: tobeUpdate.slug1 })
      .getOne();

    this.logger.log(`${this.updateProduct.name} 2`);
    if (!productTemplate) {
      const { generatedMaps } = await this.productProductRepo
        .createQueryBuilder()
        .insert()
        .into(PRODUCT_TEMPLATE)
        .values(tobeUpdate)
        .returning('*')
        .execute();

      productTemplate = generatedMaps[0] as PRODUCT_TEMPLATE;
      this.logger.log(`${this.updateProduct.name} 3`);
    } else {
      this.logger.log(`${this.updateProduct.name} 4`);
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

    if (productTemplate) {
      this.logger.log(`${this.updateProduct.name} 5`);
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

      this.logger.log(`${this.updateProduct.name} 6`);

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
          this.logger.log(`${this.updateProduct.name} 7`);
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
  }

  async getRelatedProductV3(update: Product) {
    try {
      const tobeUpdate = CreateProductTemplateDTO.fromProduct(update);
      let productTemplate: PRODUCT_TEMPLATE;

      this.logger.log(`${this.getRelatedProductV3.name} 1`);
      this.logger.log(`${this.getRelatedProductV3.name} 2`);
      productTemplate = await this.productTemplateRepo
        .createQueryBuilder('pt')
        .leftJoin('pt.productProducts', 'pp')
        .where('pp.product_id = :productId', { productId: update.productId })
        // .where('slug1 = :slug', { slug: tobeUpdate.slug1 })
        .getOne();
      this.logger.log(`${this.getRelatedProductV3.name} 3`);
      if (!productTemplate) {
        const { generatedMaps } = await this.productProductRepo
          .createQueryBuilder()
          .insert()
          .into(PRODUCT_TEMPLATE)
          .values(tobeUpdate)
          .returning('*')
          .execute();

        productTemplate = generatedMaps[0] as PRODUCT_TEMPLATE;
        this.logger.log(`${this.getRelatedProductV3.name} 3`);
      }

      if (productTemplate) {
        this.logger.log(`${this.getRelatedProductV3.name} 6`);

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

        if (relatedProducts?.length)
          console.log('related:', { product: relatedProducts?.[0], template: productTemplate });

        if (relatedProducts.length) {
          const values = relatedProducts.map((product) => {
            return { productTemplateId: productTemplate.productTemplateId, productId: product.productId };
          });

          try {
            this.logger.log(`${this.getRelatedProductV3.name} 7`);
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
    } catch (error) {
      console.log(error);
    }
  }
}
