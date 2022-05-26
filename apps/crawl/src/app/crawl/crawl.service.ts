import { Injectable, Logger } from '@nestjs/common';
import { ProductRepo } from '../repositories/productRepo';
import * as puppeteer from 'puppeteer';
import { CrawlCategoryDTO, CrawlPayload, CreateProductDTO, TCrawlCategory } from '@aff-services/shared/models/dtos';
import { ConfigRepo } from '../repositories/configRepo';
import { CategoryRepo } from '../repositories/categoryRepo';
const args = ['--disable-gpu', '--no-sandbox'];
process.setMaxListeners(Infinity);
enum MerchangeEnum {
  TIKI = 'tiki',
  LAZADA = 'lazada',
  SHOPEE = 'shopee',
}

type Merchange = 'tiki' | 'lazada' | 'shopee';

type ProductVariant = {
  productId: string;
  sku: string;
  salePrice: string;
  listPrice: string;
  isSale: boolean;
  discountPercent: string | number;
  images: string[];
  skuName: string;
  skuImage: string;
};

type ProductDetail = {
  categories: string[];
  comments: ProductComment[];
  productVariants: ProductVariant[];
  description: string;
};

type ProductComment = {
  reviewerName: string;
  reviewerSatisfactionLevel: string;
  reviewContent: string;
  reviewImages: string[];
};

@Injectable()
export class CrawlService {
  private readonly logger = new Logger(`Micro-Crawl.${CrawlService.name}`);

  constructor(
    private readonly productRepo: ProductRepo,
    private readonly configRepo: ConfigRepo,
    private readonly categoryRepo: CategoryRepo
  ) {}

  // async crawlData({ url }: CrawlPayload) {
  //   const browser = await puppeteer.launch({ headless: true, handleSIGINT: false, args: args });
  //   try {
  //     this.logger.log(`${this.crawlData.name} data${JSON.stringify({ url })}`);
  //     let products: any[] = [];
  //     const merchant = this.getMerchant(url);
  //     switch (merchant) {
  //       case 'tiki': {
  //         products = await this.getTikiProducts(browser, url);
  //         break;
  //       }
  //       case 'shopee': {
  //         products = await this.getShopeeProducts(browser, url);
  //         break;
  //       }
  //       case 'lazada': {
  //         products = await this.getLazadaProducts(browser, url);
  //         break;
  //       }
  //     }

  //     const categorySlug = this.getCateId(url, merchant);
  //     const mapCate = this.mappingCategory(merchant, categorySlug);

  //     const toBeCreated = CreateProductDTO.fromArray(products);
  //     await browser.close();
  //     await this.productRepo.insertData(toBeCreated);
  //     // return { toBeCreated };
  //   } catch (error) {
  //     await browser.close();
  //     this.logger.error(`${this.crawlData.name} Error:${error.message}`);
  //   } finally {
  //     await browser.close();
  //   }
  // }

  // async getTikiProducts(browser: puppeteer.Browser, url: string) {
  //   this.logger.log(`${this.getTikiProducts.name} called`);
  //   const page = await browser.newPage();
  //   await page.goto(url);
  //   this.logger.log(`${this.getTikiProducts.name} goto:${url}`);
  //   const articles = await page.evaluate(() => {
  //     const results: any[] = [];
  //     const items = document.querySelectorAll('.product-item');
  //     items.forEach((product) => {
  //       const temp: any = {};
  //       temp.productName = product.querySelector('.name h3').textContent;
  //       temp.thumbnail = product.querySelector('.thumbnail picture.webpimg-container img').getAttribute('src');
  //       const average =
  //         product
  //           .querySelector('.average')
  //           ?.getAttribute('style')
  //           ?.replace(/width:|%/g, '') || null;
  //       const sold =
  //         +product.querySelector('.styles__StyledQtySold-sc-732h27-2.fCfYNm')?.textContent?.replace('Đã bán ', '') || 0;
  //       temp.isSale = product.querySelector('.price-discount.has-discount') ? true : false;
  //       temp.salePrice = +product.querySelector('.price-discount__price')?.textContent?.replace(/\.| ₫/g, '');
  //       temp.discountPercent =
  //         +product.querySelector('.price-discount__discount')?.textContent?.replace(/-|%/g, '') || 0;
  //       const productUrl = product.getAttribute('href')?.split('.html').shift() + '.html';
  //       let url = '';
  //       if (productUrl.startsWith('//tka.tiki.vn')) {
  //         url = productUrl.replace('//tka.tiki.vn', 'https://tka.tiki.vn');
  //       } else {
  //         url = `https://tiki.vn${productUrl}`;
  //       }
  //       temp.productUrl = url;
  //       temp.merchant = 'tiki';
  //       temp.productId = productUrl.replace('.html', '').split('p').pop();
  //       temp.average = +average;
  //       temp.sold = sold;
  //       results.push(temp);
  //     });
  //     return results;
  //   });
  //   await page.close();
  //   return articles;
  // }

  // async getShopeeProducts(browser: puppeteer.Browser, url: string) {
  //   this.logger.log(`${this.getShopeeProducts.name} called`);
  //   const page = await browser.newPage();
  //   await page.goto(url);
  //   this.logger.log(`${this.getShopeeProducts.name} goto:${url}`);
  //   await page.setDefaultNavigationTimeout(60000);
  //   await page.setViewport({ width: 1800, height: 6000 });
  //   const bodyHandle = await page.$('body');
  //   const { height } = await bodyHandle.boundingBox();
  //   await bodyHandle.dispose();

  //   // Scroll one viewport at a time, pausing to let content load
  //   const viewportHeight = page.viewport().height;
  //   let viewportIncr = 0;
  //   while (viewportIncr + viewportHeight < height) {
  //     await page.evaluate((_viewportHeight) => {
  //       window.scrollBy(0, _viewportHeight);
  //     }, viewportHeight);
  //     await this.wait(2000);
  //     viewportIncr = viewportIncr + viewportHeight;
  //   }
  //   await this.wait(1000);

  //   await page.screenshot({ path: 'screenshot.png' });

  //   const articles = await page.evaluate(() => {
  //     const results: any[] = [];
  //     const items = document.querySelectorAll(
  //       '.row.shopee-search-item-result__items .col-xs-2-4.shopee-search-item-result__item'
  //     );

  //     items.forEach((product) => {
  //       const temp: any = {};
  //       temp.productName = product.querySelector('.ZG__4J ._10Wbs-._2STCsK._3IqNCf')?.textContent;
  //       temp.thumbnail = product.querySelector('._1gZS6z ._25_r8I.ggJllv ._3-N5L6._2GchKS')?.getAttribute('src');
  //       let average = 0;
  //       const averages = product.querySelectorAll('.shopee-rating-stars__lit');
  //       averages.forEach((element) => {
  //         const score = +element?.getAttribute('style')?.replace(/width:|%|;/g, '');
  //         // average += (score / 100) * 20;
  //         // average.push(score);
  //         average = average + (score / 100) * 20;
  //       });
  //       const sold = +product.querySelector('._1uq9fs')?.textContent?.replace('Đã bán ', '') || 0;
  //       temp.isSale = product.querySelector('._2qsK5P') ? true : false;
  //       temp.salePrice = +product.querySelector('._3c5u7X')?.textContent?.replace(/\.| ₫/g, '');
  //       temp.discountPercent = +product.querySelector('.percent')?.textContent?.replace(/-|%/g, '') || 0;
  //       const productUrl = product.querySelector('a').getAttribute('href')?.split('?').shift();
  //       const url = `https://shopee.vn/${productUrl}`;
  //       temp.productUrl = url;
  //       temp.merchant = 'shopee';
  //       temp.productId = productUrl.split('.').pop();
  //       temp.average = Math.round(average);
  //       temp.sold = sold;
  //       results.push(temp);
  //     });

  //     return results;
  //   });
  //   await page.close();
  //   return articles;
  // }

  // async getLazadaProducts(browser: puppeteer.Browser, url: string) {
  //   this.logger.log(`${this.getLazadaProducts.name} called`);
  //   const page = await browser.newPage();
  //   await page.setDefaultNavigationTimeout(60000);
  //   this.logger.log(`${this.getLazadaProducts.name} goto:${url}`);
  //   await page.goto(url, { waitUntil: 'domcontentloaded' });
  //   await this.wait(5000);
  //   const articles = await page.evaluate(() => {
  //     const results: any[] = [];
  //     const items = document.querySelectorAll('.Bm3ON');
  //     items.forEach((product) => {
  //       const temp: any = {};
  //       temp.productName = product.querySelector('.RfADt a').textContent;
  //       temp.thumbnail = product.querySelector('.picture-wrapper img').getAttribute('src');
  //       temp.isSale = product.querySelector('.WNoq3') ? true : false;
  //       temp.salePrice = +product.querySelector('.ooOxS')?.textContent?.replace(/\.| ₫|₫|,/g, '');
  //       temp.discountPercent = +product.querySelector('.IcOsH')?.textContent?.replace(/-|%/g, '') || 0;
  //       const productUrl = product.querySelector('._95X4G a').getAttribute('href')?.split('.html').shift();
  //       let url = '';
  //       if (productUrl.startsWith('//www.lazada.vn')) {
  //         url = productUrl.replace('//www.lazada.vn', 'https://www.lazada.vn') + '.html';
  //       } else {
  //         url = `https://www.lazada.vn${productUrl}.html`;
  //       }
  //       temp.productUrl = url;
  //       temp.merchant = 'lazada';
  //       const idAndSku = productUrl.split('-i').pop();
  //       const [productId, sku] = idAndSku.split('-s');
  //       temp.productId = productId;
  //       temp.average = 0;
  //       temp.sold = 0;
  //       results.push(temp);
  //     });
  //     return results;
  //   });
  //   await page.close();
  //   return articles;
  // }

  getCateId(url: string, merchant: Merchange) {
    switch (merchant) {
      case MerchangeEnum.TIKI: {
        return url.split('/').pop();
      }
      case MerchangeEnum.SHOPEE: {
        return url.split('.').pop();
      }
      case MerchangeEnum.LAZADA: {
        return url.replace('https://www.lazada.vn/', '').split('/').shift();
      }
    }
  }

  wait(ms) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
  }

  getMerchant(url: string) {
    return url.startsWith('https://www.')
      ? (url.replace('https://www.', '').split('.vn')[0] as Merchange)
      : (url.replace('https://', '').split('.vn')[0] as Merchange);
  }

  async crawlCategory() {
    const browser = await puppeteer.launch({ headless: true, handleSIGINT: false, args: args });
    try {
      this.logger.log(`${this.crawlCategory.name} called`);

      const { value: tikiUrl } = await this.configRepo.getDbConfig('tiki_url');
      const tiki = await this.getTikiCategories(browser, tikiUrl);
      await this.updateCategory('tiki', tiki);

      const { value: shopeeUrl } = await this.configRepo.getDbConfig('shopee_url');
      const shopee = await this.getShopeeCategories(browser, shopeeUrl);
      await this.updateCategory('shopee', shopee);

      const { value: lazadaUrl } = await this.configRepo.getDbConfig('lazada_url');
      const lazada = await this.getLazadaCategories(browser, lazadaUrl);
      await this.updateCategory('lazada', lazada);

      this.logger.log(`${this.crawlCategory.name} Done`);
      return;
    } catch (error) {
      await browser.close();
      this.logger.error(`${this.crawlCategory.name} error:${error.message}`);
    }
  }

  async getTikiCategories(browser: puppeteer.Browser, url: string): Promise<TCrawlCategory[]> {
    try {
      this.logger.log(`${this.getTikiCategories.name} called`);
      const page = await browser.newPage();
      await page.goto(url);
      this.logger.log(`${this.getTikiCategories.name} goto:${url}`);
      const articles = await page.evaluate(() => {
        const categories: TCrawlCategory[] = [];
        const items = document.querySelectorAll(
          '.styles__StyledCategoryList-sc-17y817k-0.dNFPjn .styles__StyledCategory-sc-17y817k-1.iBByno'
        );
        items.forEach((item) => {
          const category: TCrawlCategory = { slug: '', name: '' };
          const sub = item.querySelector('.styles__FooterSubheading-sc-32ws10-5.cNJLWI a');
          category.slug = sub.getAttribute('href');
          category.name = sub.textContent;
          category.subCategory = [];
          const listSubCategory = item.querySelectorAll('p a');
          Array.from(listSubCategory).forEach((cate) => {
            const name = cate?.textContent;
            const slug = cate?.getAttribute('href');
            category.subCategory.push({ name, slug });
          });
          categories.push(category);
        });
        return categories;
      });
      await page.close();
      this.logger.log(`${this.getTikiCategories.name} Done`);
      return articles;
    } catch (error) {
      await browser.close();
      this.logger.error(`${this.getTikiCategories.name} error:${error.message}`);
    }
  }

  async getShopeeCategories(browser: puppeteer.Browser, url: string) {
    try {
      this.logger.log(`${this.getShopeeCategories.name} called`);
      const page = await browser.newPage();
      await page.goto(url);
      this.logger.log(`${this.getShopeeCategories.name} goto:${url}`);
      await page.setDefaultNavigationTimeout(60000);
      await page.setViewport({ width: 1800, height: 6000 });
      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();
      await bodyHandle.dispose();

      // Scroll one viewport at a time, pausing to let content load
      const viewportHeight = page.viewport().height;
      let viewportIncr = 0;
      while (viewportIncr + viewportHeight < height) {
        await page.evaluate((_viewportHeight) => {
          window.scrollBy(0, _viewportHeight);
        }, viewportHeight);
        await this.wait(5000);
        viewportIncr = viewportIncr + viewportHeight;
      }
      await this.wait(1000);

      // await page.screenshot({ path: 'category.png' });
      const articles = await page.evaluate(() => {
        const results: any[] = [];
        const items = document.querySelectorAll('._5mVtqL.uZncG4 .F-JPOo > div');
        items.forEach((product) => {
          const category: any = {};
          const title = product.querySelector('.sR5RFo a');
          category.slug = title.getAttribute('href');
          category.name = title.textContent;
          category.subCategory = [];
          const listSubCategory = product.querySelectorAll('._0ShNPC .LYwNSg');
          Array.from(listSubCategory).forEach((cate) => {
            const name = cate?.textContent;
            const slug = cate?.getAttribute('href');
            category.subCategory.push({ name, slug });
          });
          results.push(category);
        });

        return results;
      });
      await page.close();
      this.logger.log(`${this.getShopeeCategories.name} Done`);
      return articles;
    } catch (error) {
      await browser.close();
      this.logger.error(`${this.getShopeeCategories.name} error:${error.message}`);
    }
  }

  async getLazadaCategories(browser: puppeteer.Browser, url: string) {
    const page = await browser.newPage();
    try {
      // const cookies = [
      //   { name: '_lang', value: 'vi_VN' },
      //   { name: 'userLanguageML', value: 'vi' },
      // ];
      this.logger.log(`${this.getLazadaCategories.name} called`);
      await page.setDefaultNavigationTimeout(60000);
      await page.setViewport({ width: 1800, height: 6000 });
      this.logger.log(`${this.getLazadaCategories.name} goto:${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      // await page.click('#topActionSwitchLang');
      await page.click('#topActionSwitchLang');
      await page.click('#topActionSwitchLang .lzd-switch-item[data-lang=vi]');
      // document.querySelector('#topActionSwitchLang .lzd-switch-item[data-lang=vi]').click();
      // await page.evaluate(() => {
      //   document.querySelector('#topActionSwitchLang .lzd-switch-item[data-lang=vi]');
      // });
      await this.wait(10000);
      // await page.screenshot({ path: 'pas.png', type: 'png' });

      // await page.setCookie(...cookies);

      // const ids = await page.evaluate(() => {
      //   const results: string[] = [];
      //   const items = document.querySelectorAll('.lzd-site-menu-root .lzd-site-menu-root-item');
      //   // const title = product.querySelector('a span');
      //   items.forEach((product) => {
      //     const id = product.getAttribute('id');
      //     if (id) results.push(`#${id}`);
      //   });
      //   return results;
      // });

      // ids.map(async (id) => {
      //   await page.click(id);
      // });

      const articles = await page.evaluate(() => {
        const results: any[] = [];
        const items = document.querySelectorAll('.lzd-site-menu-root .lzd-site-menu-root-item');
        items.forEach((product) => {
          const category: any = {};
          const cateLv1Id = product.getAttribute('id');
          category.name = product.querySelector('a span').textContent;
          category.slug = product.querySelector('a').getAttribute('href') || '/';
          category.subCategory = [];

          const subLv1 = document.querySelector(`.lzd-site-menu-sub.${cateLv1Id}`);
          if (subLv1) {
            const arrows = subLv1.querySelectorAll('.sub-item-remove-arrow');
            if (arrows.length) {
              arrows.forEach((arrow) => {
                const name = arrow.querySelector('a span').textContent;
                const slug = arrow.querySelector('a').getAttribute('href');
                category.subCategory.push({ name, slug });
              });
            }

            const items = subLv1.querySelectorAll('.lzd-site-menu-sub-item');
            if (items) {
              items.forEach((item) => {
                const name = item.querySelector('a span').textContent;
                const slug = item.querySelector('a').getAttribute('href');
                const cate: any = { name, slug, subCategory: [] };
                const sub = item.querySelectorAll('ul.lzd-site-menu-grand .lzd-site-menu-grand-item');
                if (sub.length) {
                  sub.forEach((elm) => {
                    const name = elm.querySelector('a span').textContent;
                    const slug = elm.querySelector('a').getAttribute('href');
                    cate.subCategory.push({ name, slug });
                  });
                }
                category.subCategory.push({ ...cate, name, slug });
              });
            }
          }
          results.push(category);
        });
        return results;
      });
      await page.close();
      this.logger.log(`${this.getLazadaCategories.name} Done`);
      return articles;
    } catch (error) {
      await page.close();
      this.logger.error(`${this.getLazadaCategories.name} error:${error.message}`);
    }
  }

  // async getTikiCategories(browser: puppeteer.Browser, url: string) {
  //   this.logger.log(`${this.getTikiCategories.name} called`);
  //   const page = await browser.newPage();
  //   await page.goto(url);
  //   this.logger.log(`${this.getTikiCategories.name} goto:${url}`);
  //   const articles = await page.evaluate(() => {
  //     const results: any[] = [];
  //     const items = document.querySelectorAll('.breadcrumb a.breadcrumb-item');
  //     items.forEach((product) => {
  //       const category: any = {};
  //       category.link = product.getAttribute('href');
  //       category.name = product.querySelector('span').textContent;
  //       results.push(category);
  //     });
  //     return results;
  //   });
  //   await page.close();
  //   return articles;
  // }

  // async getShopeeCategories(browser: puppeteer.Browser, url: string) {
  //   this.logger.log(`${this.getShopeeCategories.name} called`);
  //   const page = await browser.newPage();
  //   await page.goto(url);
  //   this.logger.log(`${this.getShopeeCategories.name} goto:${url}`);
  //   const articles = await page.evaluate(() => {
  //     const results: any[] = [];
  //     const items = document.querySelectorAll('.flex.items-center._3bDXqx.page-product__breadcrumb ._2572CL');
  //     items.forEach((product) => {
  //       const category: any = {};
  //       category.link = product.getAttribute('href');
  //       category.name = product.textContent;
  //       results.push(category);
  //     });
  //     return results;
  //   });
  //   await page.close();
  //   return articles;
  // }

  // async getLazadaCategories(browser: puppeteer.Browser, url: string) {
  //   this.logger.log(`${this.getLazadaCategories.name} called`);
  //   const page = await browser.newPage();
  //   await page.setDefaultNavigationTimeout(60000);
  //   this.logger.log(`${this.getLazadaCategories.name} goto:${url}`);
  //   await page.goto(url, { waitUntil: 'domcontentloaded' });
  //   await this.wait(5000);
  //   const articles = await page.evaluate(() => {
  //     const results: any[] = [];
  //     const items = document.querySelectorAll('.breadcrumb .breadcrumb_item a.breadcrumb_item_anchor');
  //     items.forEach((product) => {
  //       const category: any = {};
  //       category.link = product.getAttribute('href')?.replace('https://www.lazada.vn/', '');
  //       category.name = product.querySelector('span').textContent;
  //       results.push(category);
  //     });
  //     return results;
  //   });
  //   await page.close();
  //   return articles;
  // }

  async updateCategory(merchant: Merchange, data: TCrawlCategory[]) {
    try {
      this.logger.log(`${this.updateCategory.name} Merchant:${merchant}}`);
      switch (merchant) {
        case MerchangeEnum.TIKI: {
          await this.categoryRepo.updateCrawlTikiCategory(data);
          break;
        }
        case MerchangeEnum.SHOPEE: {
          await this.categoryRepo.updateCrawlShopeeCategory(data);
          break;
        }
        case MerchangeEnum.LAZADA: {
          await this.categoryRepo.updateCrawlLazadaCategory(data);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      this.logger.error(`${this.getLazadaCategories.name} error:${error.message}`);
    }
  }

  async getCategory(merchant) {
    return await this.categoryRepo.getCateGories(merchant);
  }

  async crawlProductV2() {
    const browser = await puppeteer.launch({ headless: true, handleSIGINT: false, args: args });
    try {
      this.logger.log(`${this.crawlProductV2.name} called`);
      // const crawlList = await this.categoryRepo.getCategoriesWillCrawl();

      // for (const elm of crawlList) {
      //   try {
      //     const url = await this.configRepo.getDbConfigMerchantUrl(elm.merchant);
      //     const page_url = `${url.value}${elm.slug}`;
      //     let products: any[] = [];
      //     switch (elm.merchant) {
      //       case MerchangeEnum.TIKI: {
      //         if (url && elm.slug) products = await this.getTikiProductsV2(browser, page_url);
      //         break;
      //       }
      //       case MerchangeEnum.SHOPEE: {
      //         if (url && elm.slug) products = await this.getShopeeProductV2(browser, page_url);
      //         break;
      //       }
      //       case MerchangeEnum.LAZADA: {
      //         if (url && elm.slug) products = await this.getLazadaProductsV2(browser, page_url);
      //         break;
      //       }
      //       default:
      //         break;
      //     }

      //     console.log({ products }, { length: products?.length });
      //     const toBeCreated = CreateProductDTO.fromArray(products);
      //     await this.productRepo.insertData(toBeCreated);
      //   } catch (error) {
      //     this.logger.error(`get products error:${error.message}`);
      //   }
      // }

      // return crawlList;
      const url =
        'https://tiki.vn/dien-thoai-iphone-12-64gb-hang-chinh-hang-p123345348.html?itm_campaign=tiki-reco_UNK_DT_UNK_UNK_infinite-scroll_infinite-scroll_UNK_UNK_MD_realtime-model_PID.70766425&itm_medium=CPC&itm_source=tiki-reco&spid=70766425';
      const url1 =
        'https://tiki.vn/op-cho-iphone-13-pro-max-trong-suot-chong-soc-dem-khi-4-goc-p143489022.html?spid=149211635';

      const url2 =
        'https://tiki.vn/gong-kinh-mat-tron-kim-loai-phong-cach-co-dien-duong-kinh-43-p173760292.html?itm_campaign=HMP_YPD_TKA_PLA_UNK_ALL_UNK_UNK_UNK_UNK_X.143496_Y.1459944_Z.2488676_CN.Product-Ads-21%252F05%252F2022&itm_medium=CPC&itm_source=tiki-ads&spid=173760293';
      const url3 = 'https://tiki.vn/dien-thoai-iphone-12-64gb-hang-chinh-hang-p123345348.html?spid=97736366';
      await this.getTikiProductDetail(browser, url3);
    } catch (error) {
      this.logger.error(`${this.crawlProductV2.name} error:${error.message}`);
    } finally {
      this.logger.log(`${this.crawlProductV2.name} DONE ✅✅✅✅✅`);
      browser.close();
    }
  }

  async getTikiProductsV2(browser: puppeteer.Browser, url: string) {
    const page = await browser.newPage();
    try {
      this.logger.log(`${this.getTikiProductsV2.name} goto:${url}`);
      await page.setDefaultNavigationTimeout(60000);
      await page.goto(url);
      await this.wait(5000);
      const articles = await page.evaluate(() => {
        const results: any[] = [];
        const items = document.querySelectorAll('.product-item');
        items.forEach((product) => {
          try {
            const temp: Partial<CreateProductDTO> = {};
            temp.name = product.querySelector('.name h3').textContent;
            temp.thumbnail = product.querySelector('.thumbnail picture.webpimg-container img').getAttribute('src');
            const average =
              product
                .querySelector('.average')
                ?.getAttribute('style')
                ?.replace(/width:|%/g, '') || null;
            const sold =
              +product
                .querySelector('.styles__StyledQtySold-sc-732h27-2.fCfYNm')
                ?.textContent?.replace('Đã bán ', '') || 0;

            const productUrl = (product.getAttribute('href') + '')?.split('.html').shift() + '.html';
            let url = '';
            if (productUrl.startsWith('//tka.tiki.vn')) {
              url = productUrl.replace('//tka.tiki.vn', 'https://tka.tiki.vn');
            } else {
              url = `https://tiki.vn${productUrl}`;
            }
            temp.originalUrl = url;
            temp.merchant = 'tiki';
            temp.productId = productUrl.replace('.html', '').split('p').pop();
            temp.average = +average;
            temp.sold = sold;
            results.push(temp);
          } catch (error) {
            this.logger.error(`Get Product Error:${error.message}`);
          }
        });
        return results;
      });
      return articles;
    } catch (error) {
      this.logger.log(`${this.getTikiProductsV2.name} Error:${error.message}`);
    } finally {
      await page.close();
    }
  }

  async getShopeeProductV2(browser: puppeteer.Browser, url: string) {
    const page = await browser.newPage();

    try {
      this.logger.log(`${this.getShopeeProductV2.name} goto:${url}`);
      await page.goto(url);
      await page.setDefaultNavigationTimeout(60000);
      await page.setViewport({ width: 1800, height: 6000 });
      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();
      await bodyHandle.dispose();

      // Scroll one viewport at a time, pausing to let content load
      const viewportHeight = page.viewport().height;
      let viewportIncr = 0;
      while (viewportIncr + viewportHeight < height) {
        await page.evaluate((_viewportHeight) => {
          window.scrollBy(0, _viewportHeight);
        }, viewportHeight);
        await this.wait(2000);
        viewportIncr = viewportIncr + viewportHeight;
      }
      await this.wait(1000);

      const articles = await page.evaluate(() => {
        const results: any[] = [];
        const items = document.querySelectorAll(
          '.row.shopee-search-item-result__items .col-xs-2-4.shopee-search-item-result__item'
        );

        items.forEach((product) => {
          try {
            const temp: Partial<CreateProductDTO> = {};
            temp.name = product.querySelector('.KMyn8J div div')?.textContent;
            temp.thumbnail = product.querySelector('._1gZS6z ._25_r8I.ggJllv ._3-N5L6._2GchKS')?.getAttribute('src');
            let average = 0;
            const averages = product.querySelectorAll('.shopee-rating-stars__lit');
            averages.forEach((element) => {
              const score = +element?.getAttribute('style')?.replace(/width:|%|;/g, '');
              // average += (score / 100) * 20;
              // average.push(score);
              average = average + (score / 100) * 20;
            });
            const sold = +product.querySelector('._1uq9fs')?.textContent?.replace('Đã bán ', '') || 0;

            const productUrl = (product.querySelector('a').getAttribute('href') + '')?.split('?').shift();
            const url = `https://shopee.vn${productUrl}`;
            temp.originalUrl = url;
            temp.merchant = 'shopee';
            temp.productId = productUrl.split('.').pop();
            temp.average = Math.round(average);
            temp.sold = sold;
            results.push(temp);
          } catch (error) {
            this.logger.error(`Get Product Error:${error.message}`);
          }
        });
        return results;
      });
      return articles;
    } catch (error) {
      this.logger.error(`${this.getShopeeProductV2.name} Error:${error.message}`);
    } finally {
      await page.close();
    }
  }

  async getLazadaProductsV2(browser: puppeteer.Browser, url: string) {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    try {
      this.logger.log(`${this.getLazadaProductsV2.name} goto:${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.wait(5000);
      const articles = await page.evaluate(() => {
        const results: any[] = [];
        const items = document.querySelectorAll('.Bm3ON');
        items.forEach((product) => {
          try {
            const temp: Partial<CreateProductDTO> = {};
            temp.name = product.querySelector('.RfADt a').getAttribute('title');
            temp.thumbnail = product.querySelector('.picture-wrapper img').getAttribute('src');

            const productUrl = (product.querySelector('._95X4G a').getAttribute('href') + '')?.split('.html').shift();
            let url = '';
            if (productUrl.startsWith('//www.lazada.vn')) {
              url = productUrl.replace('//www.lazada.vn', 'https://www.lazada.vn') + '.html';
            } else {
              url = `https://www.lazada.vn${productUrl}.html`;
            }
            temp.originalUrl = url;
            temp.merchant = 'lazada';
            const idAndSku = productUrl.split('-i').pop();
            const [productId, sku] = idAndSku.split('-s');
            temp.productId = productId;
            temp.average = 0;
            temp.sold = 0;
            results.push(temp);
          } catch (error) {
            this.logger.error(`Get Product Error:${error.message}`);
          }
        });
        return results;
      });
      return articles;
    } catch (error) {
      this.logger.error(`${this.getLazadaProductsV2.name} Error:${error.message}`);
    } finally {
      await page.close();
    }
  }

  async getTikiProductDetail(browser: puppeteer.Browser, url: string): Promise<ProductDetail> {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    try {
      this.logger.log(`${this.getTikiProductDetail.name} goto:${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.wait(5000);

      /** get product description */

      const description = await page.evaluate(() => {
        const arr: string[] = [];
        const rows = document.querySelectorAll('.style__Wrapper-sc-12gwspu-0.cIWQHl .content.has-table table tbody tr');
        rows.forEach((elm) => {
          const keyValue = elm?.querySelectorAll('td');
          // const [key, value] = keyValue
          const key = keyValue?.[0]?.textContent;
          const value = keyValue?.[1]?.textContent;
          if (key && value) arr.push(`${key}: ${value}`);
        });
        return arr.join(',');
      });

      let query;
      let optionsLength = 0;
      const outerQuery = `.styles__VariantSelectWrapper-sc-1dwa5s5-0 .styles__OptionListWrapper-sc-1dwa5s5-2`;
      const divQuery = `${outerQuery} .styles__FigureOptionWrapper-sc-8h5g7n-0`;
      const op1 = await page.$$(divQuery);
      const buttonQuery = `${outerQuery} .styles__OptionButton-sc-3p38uy-0`;
      const op2 = await page.$$(buttonQuery);

      if (op1.length) {
        optionsLength = op1.length;
        query = divQuery;
      } else if (op2.length) {
        optionsLength = op2.length;
        query = buttonQuery;
      }

      //** get Product Variants */

      const productVariants: ProductVariant[] = [];
      if (optionsLength) {
        for (let index = 0; index < optionsLength; index++) {
          await this.getTikiProductVariants(page, productVariants, query, index);
        }
      } else {
        await this.getTikiProductVariant(page, productVariants);
      }

      //** get Categories */

      const categories: string[] = await page.$$eval(`.breadcrumb a.breadcrumb-item`, (breadcrumbItems) => {
        const breadcrumb = [];
        breadcrumbItems?.forEach((elm) => {
          const url = elm?.getAttribute('href');
          if (url && url !== '#') {
            breadcrumb.push(url?.split('/')?.pop());
          }
        });
        return breadcrumb;
      });

      await this.pageScrollDown(page);

      /** get customer comments */

      const comments: ProductComment[] = await page.evaluate(() => {
        const crawlComments: ProductComment[] = [];
        const reviewComments = document.querySelectorAll('.customer-reviews .review-comment');
        reviewComments.forEach((elm) => {
          const reviewerName = elm.querySelector('.review-comment__user-name')?.textContent;
          const reviewerSatisfactionLevel = elm.querySelector('.review-comment__title')?.textContent;
          const reviewContent = elm.querySelector('.review-comment__content')?.textContent;
          const reviewImages: string[] = [];
          const images = elm.querySelectorAll('.review-comment__images div.review-comment__image');
          images.forEach((image) => {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const [imageUrl] = (image.getAttribute('style') + '')?.match(/url\("[a-zA-Z0-9:/.]{1,}"\)/g);
            if (imageUrl) reviewImages.push((imageUrl + '').replace(/(url\(")|("\))/g, ''));
          });
          crawlComments.push({ reviewerName, reviewerSatisfactionLevel, reviewContent, reviewImages });
        });
        return crawlComments;
      });

      console.log(comments);

      const productDetail = { description, comments, categories, productVariants };

      console.log(productDetail);
      return productDetail;
    } catch (error) {
      this.logger.error(`${this.getTikiProductDetail.name} error:${error.message}`);
    } finally {
      this.logger.log(`${this.getTikiProductDetail.name} crawl ${url} finished`);
      await page.close();
    }
  }

  /**
   * get tiki product variants
   * @param {page}{puppeteer.Page}
   * @param {productVariants}{Array}
   * @param {query}{dom selector}
   * @param {index}{index of array}
   */
  async getTikiProductVariants(page: puppeteer.Page, productVariants: ProductVariant[], query: string, index: number) {
    this.logger.log(`${this.getTikiProductVariants.name} called`);
    try {
      const link = await page.$$(query);
      const a = link?.[index];
      if (a) {
        await a.click();
        await this.wait(5000);

        //** get sku name */
        const skuName = await page.$eval(`${a._remoteObject.description}.active`, (el) => el.textContent);

        //** get sku image */
        const skuImage = await page
          .$eval(`${a._remoteObject.description}.active picture.webpimg-container source`, (el) =>
            el?.getAttribute('srcset')
          )
          .catch(() => '');

        this.logger.warn(`get sku price 3`);

        //** Get variants */
        const variants = await page.evaluate(() => {
          let listPrice, salePrice, isSale, discountPercent, productId, sku;

          const [ID, SKU] = document.URL.match(/(-p[a-zA-Z0-9]{1,}.html)|(spid=[a-zA-Z0-9]{1,})/g);
          if (ID && SKU) {
            productId = ID?.replace(/(-p)|(.html)|(spid=)/g, '') || '';
            sku = SKU?.replace(/(-p)|(.html)|(spid=)/g, '') || '';
          }
          if (document.querySelector('.flash-sale-price')) {
            salePrice = document.querySelector('.flash-sale-price span')?.textContent;
            const priceAndDiscount = document.querySelector('.flash-sale-price div.sale')?.textContent + '';
            // eslint-disable-next-line no-unsafe-optional-chaining
            const [price, discount] = priceAndDiscount?.split('-');
            isSale = true;
            listPrice = price;
            discountPercent = discount;
          } else {
            salePrice = document.querySelector('.product-price .product-price__current-price')?.textContent;
            listPrice = document.querySelector('.product-price .product-price__list-price')?.textContent || salePrice;
            discountPercent = document.querySelector('.product-price .product-price__discount-rate')?.textContent || 0;
            isSale = Boolean(discountPercent);
          }
          const imagesList = document.querySelectorAll(
            '.review-images .review-images__list a[data-view-id=pdp_main_view_photo] .webpimg-container source'
          );
          const images = [];
          imagesList.forEach((element) => {
            const image = element.getAttribute('srcset');
            if (image) images.push(image);
          });

          return { productId, sku, salePrice, listPrice, isSale, discountPercent, images };
        });

        productVariants.push({ ...variants, skuName, skuImage });
      }
    } catch (error) {
      this.logger.error(`${this.getTikiProductVariants.name} Error:${error.message}`);
    }
  }

  async getTikiProductVariant(page: puppeteer.Page, productVariants: any[]) {
    try {
      this.logger.log(`${this.getTikiProductVariant.name} called`);
      const skuName = 'default';
      const skuImage = '';

      const variants = await page.evaluate(() => {
        let listPrice, salePrice, isSale, discountPercent, productId, sku;

        const [ID, SKU] = document.URL.match(/(-p[a-zA-Z0-9]{1,}.html)|(spid=[a-zA-Z0-9]{1,})/g);
        if (ID && SKU) {
          productId = ID?.replace(/(-p)|(.html)|(spid=)/g, '') || '';
          sku = SKU?.replace(/(-p)|(.html)|(spid=)/g, '') || '';
        }
        if (document.querySelector('.flash-sale-price')) {
          salePrice = document.querySelector('.flash-sale-price span')?.textContent;
          const priceAndDiscount = document.querySelector('.flash-sale-price div.sale')?.textContent + '';
          // eslint-disable-next-line no-unsafe-optional-chaining
          const [price, discount] = priceAndDiscount?.split('-');
          isSale = true;
          listPrice = price;
          discountPercent = discount;
        } else {
          salePrice = document.querySelector('.product-price .product-price__current-price')?.textContent;
          listPrice = document.querySelector('.product-price .product-price__list-price')?.textContent || salePrice;
          discountPercent = document.querySelector('.product-price .product-price__discount-rate')?.textContent || 0;
          isSale = Boolean(discountPercent);
        }
        const imagesList = document.querySelectorAll(
          '.review-images .review-images__list a[data-view-id=pdp_main_view_photo] .webpimg-container source'
        );
        const images = [];
        imagesList.forEach((element) => {
          const image = element.getAttribute('srcset');
          if (image) images.push(image);
        });

        return { productId, sku, salePrice, listPrice, isSale, discountPercent, images };
      });

      productVariants.push({ ...variants, skuName, skuImage });
    } catch (error) {
      this.logger.error(`${this.getTikiProductVariant.name} Error:${error.message}`);
    }
  }

  async pageScrollDown(page: puppeteer.Page) {
    try {
      this.logger.log(`${this.pageScrollDown.name} called`);
      const bodyHandle = await page.$('body');
      const { height } = await bodyHandle.boundingBox();
      const viewportHeight = page.viewport().height;
      let viewportIncr = 0;
      while (viewportIncr + viewportHeight < height) {
        await page.evaluate((_viewportHeight) => {
          window.scrollBy(0, _viewportHeight);
        }, viewportHeight);
        await this.wait(2000);
        viewportIncr = viewportIncr + viewportHeight;
      }
      await this.wait(1000);
    } catch (error) {
      this.logger.error(`${this.pageScrollDown.name}`);
    } finally {
      this.logger.log(`${this.pageScrollDown.name} Done`);
    }
  }
}
