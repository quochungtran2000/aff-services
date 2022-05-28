import {
  CrawlUpdateProductCommentDTO,
  CrawlUpdateProductVariantsDTO,
  CreateProductDTO,
  ProductDetail,
} from '@aff-services/shared/models/dtos';
import {
  CRAWL_CATEGORY,
  Product,
  PRODUCT_COMMENT,
  PRODUCT_COMMENT_IMAGE,
  PRODUCT_VARIANTS,
  PRODUCT_VARIANT_IMAGE,
} from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
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
    @Inject('CRAWL_CATEGORY_REPOSITORY') private readonly crawlCategoryRepo: Repository<CRAWL_CATEGORY>
  ) {}

  async insertData(data: CreateProductDTO[]) {
    try {
      this.logger.log(`${this.insertData.name}`);
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
        .andWhere('p.merchant = :merchant', { merchant: 'tiki' })
        .take(take)
        .skip(skip)
        .orderBy('p.created_at', 'DESC')
        .getManyAndCount();

      return { total, data };
    } catch (error) {
      this.logger.error(`${this.getProductNeedCrawlAndUpdate.name} Error:${error.message}`);
    }
  }

  // async updateProductDetail = (CrawlUpdateProductCommentDTO)
}
