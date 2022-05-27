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

      //     const toBeCreated = CreateProductDTO.fromArray(products);
      //     await this.productRepo.insertData(toBeCreated);
      //   } catch (error) {
      //     this.logger.error(`get products error:${error.message}`);
      //   }
      // }

      // return crawlList;

      /** get tiki product detail */

      // const url =
      //   'https://tiki.vn/dien-thoai-iphone-12-64gb-hang-chinh-hang-p123345348.html?itm_campaign=tiki-reco_UNK_DT_UNK_UNK_infinite-scroll_infinite-scroll_UNK_UNK_MD_realtime-model_PID.70766425&itm_medium=CPC&itm_source=tiki-reco&spid=70766425';
      // const url1 =
      //   'https://tiki.vn/op-cho-iphone-13-pro-max-trong-suot-chong-soc-dem-khi-4-goc-p143489022.html?spid=149211635';

      // const url2 =
      //   'https://tiki.vn/gong-kinh-mat-tron-kim-loai-phong-cach-co-dien-duong-kinh-43-p173760292.html?itm_campaign=HMP_YPD_TKA_PLA_UNK_ALL_UNK_UNK_UNK_UNK_X.143496_Y.1459944_Z.2488676_CN.Product-Ads-21%252F05%252F2022&itm_medium=CPC&itm_source=tiki-ads&spid=173760293';
      // const url3 = 'https://tiki.vn/dien-thoai-iphone-12-64gb-hang-chinh-hang-p123345348.html?spid=97736366';
      // await this.getTikiProductDetail(browser, url1);

      /** get lazada product detail */
      // const url =
      //   'https://www.lazada.vn/products/chi-con-3890k-dien-thoai-realme-narzo-50-4g-2022-4gb64gb-l-mediatek-helio-g96-l-man-hinh-ips-lcd-fhd-66-inches-120hz-l-camera-50mp-ai-l-pin-5000-mah-sac-nhanh-type-c-33w-l-2-khe-sim-1-micro-sd-i1725467303-s7689599948.html?';
      // const url1 =
      //   'https://www.lazada.vn/products/cameljeans-giay-nam-giay-the-thao-thuong-ngay-giay-chay-bo-giam-soc-nhe-i1838800306-s8315629489.html?spm=a2o4n.home.just4u.8.19056afeq0tYjc&&scm=1007.17519.162103.0&pvid=286194ed-2725-4e5b-9f7b-ca4b441d7330&search=0&clickTrackInfo=tctags%3A1880304801+115545340%3Btcsceneid%3AHPJFY%3Bbuyernid%3Acd434f6e-7c39-47bb-9a60-4c6280c37e92%3Btcboost%3A0%3Bpvid%3A286194ed-2725-4e5b-9f7b-ca4b441d7330%3Bchannel_id%3A0000%3Bmt%3Ai2i%3Bitem_id%3A1838800306%3Bself_ab_id%3A162103%3Bself_app_id%3A7519%3Blayer_buckets%3A5437.25236_955.3633_955.3631_6059.28889%3Bpos%3A7%3B';
      // const url2 =
      //   'https://www.lazada.vn/products/man-hinh-vi-tinh-xiaomi-mi-desktop-monitor-1c-bhr4510gl-rmmnt238nf-hang-chinh-hang-man-hinh-238inch-1080p-than-may-mong-goc-nhin-linh-hoat-i1299903577-s4992057885.html?search=1&spm=a2o4n.searchlistcategory.list.i40.389e6162bWxlrW';
      // await this.getLazadaProductDetail(browser, url);

      const url =
        'https://shopee.vn/-M%C3%A3-ELMALL1TR-gi%E1%BA%A3m-5-max-1tr-Apple-iPhone-13-Pro-Max-Ch%C3%ADnh-h%C3%A3ng-VN-A-i.308461157.10359777835?sp_atk=5324cf69-0769-441a-b69a-7004cd3b2773&xptdk=5324cf69-0769-441a-b69a-7004cd3b2773';

      const url1 =
        'https://shopee.vn/B%C4%83ng-%C4%90%C3%B4-H%E1%BB%8Da-Ti%E1%BA%BFt-K%E1%BA%BFt-N%E1%BB%91i-Wifi-H%C3%ACnh-D%E1%BA%A5u-Ch%E1%BA%A5m-H%E1%BB%8Fi-%C4%90a-D%E1%BA%A1ng-Vui-Nh%E1%BB%99n-Cho-D%E1%BB%8Bp-Halloween-i.510307075.13002770157?sp_atk=32600d1c-d896-491f-bf32-bef105ce1393&xptdk=32600d1c-d896-491f-bf32-bef105ce1393';
      await this.getShopeeProductDetail(browser, url1);
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
        return arr.join('; ');
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
          if (url && url !== '#' && url !== '/') {
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

      return { description, comments, categories, productVariants };
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

        //** Get variants */
        const variants = await this.getTikiVariant(page);

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

      const variants = await this.getTikiVariant(page);
      await productVariants.push({ ...variants, skuName, skuImage });
    } catch (error) {
      this.logger.error(`${this.getTikiProductVariant.name} Error:${error.message}`);
    }
  }

  async getTikiVariant(page: puppeteer.Page) {
    return page.evaluate(() => {
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

  async getLazadaProductDetail(browser: puppeteer.Browser, url: string): Promise<ProductDetail> {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    try {
      this.logger.log(`${this.getLazadaProductDetail.name} goto ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.wait(5000);

      const categories: string[] = await page.$$eval(
        `.breadcrumb .breadcrumb_item a.breadcrumb_item_anchor`,
        (breadcrumbItems) => {
          const breadcrumb = [];
          breadcrumbItems?.forEach((elm) => {
            let url = elm.getAttribute('href') + '';
            if (url.endsWith('/')) url = url?.slice(0, -1);
            url = url.split('/').pop();
            if (url) breadcrumb.push(url);
          });
          return breadcrumb;
        }
      );

      let query;
      let optionsLength = 0;
      let op1, op2;
      const parentQuery = `#module_sku-select .sku-prop-content`;
      const imageQuery = `.pdp-common-image.sku-variable-img`;
      const buttonQuery = `.sku-variable-name-text`;
      const skuOptions = await page.$(parentQuery);
      if (skuOptions) {
        op1 = await skuOptions.$$(imageQuery);
        op2 = await page.$$(buttonQuery);
      }

      if (op1?.length) {
        optionsLength = op1.length;
        query = imageQuery;
      } else if (op2?.length) {
        optionsLength = op2.length;
        query = buttonQuery;
      }

      //** get Product Variants */

      const productVariants: ProductVariant[] = [];
      if (optionsLength) {
        for (let index = 0; index < optionsLength; index++) {
          await this.getLazadaProductVariants(page, productVariants, query, index);
        }
      } else {
        await this.getLazadaProductVariant(page, productVariants);
      }

      await this.pageScrollDown(page);

      /** crawl product comments */

      const comments: ProductComment[] = await page.evaluate(() => {
        const productComments = [];
        const crawlComments = document.querySelectorAll('#module_product_review .mod-reviews .item');
        crawlComments.forEach((elm) => {
          const reviewerName = elm.querySelector('.middle span')?.textContent?.trim();
          const reviewerSatisfactionLevel = '';
          const reviewContent = elm.querySelector('.item-content .content')?.textContent;
          const reviewImages = [];

          /** crawl product sku image */
          const crawlCommentImages = elm.querySelectorAll('.review-image .pdp-common-image.review-image__item .image');
          crawlCommentImages.forEach((image) => {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const [imageUrl] = (image.getAttribute('style') + '')?.match(/(url\(")[a-zA-Z0-9-_:/.]{1,}/g);
            if (imageUrl) reviewImages.push((imageUrl + '').replace(/(url\(")|("\))/g, ''));
          });
          productComments.push({ reviewerName, reviewerSatisfactionLevel, reviewContent, reviewImages });
        });
        return productComments;
      });

      const buttonViewMore = await page.$(
        '.pdp-view-more-btn.pdp-button.pdp-button_type_text.pdp-button_theme_white.pdp-button_size_m'
      );

      if (buttonViewMore) buttonViewMore.click();
      await this.pageScrollDown(page);

      const description = await page.evaluate(() => {
        const crawlDescription = document.querySelectorAll('.pdp-product-detail .pdp-mod-specification .key-li');
        const result: string[] = [];

        if (crawlDescription.length) {
          crawlDescription.forEach((elm) => {
            const title = elm.querySelector('.key-title')?.textContent?.trim();
            const value = elm.querySelector('.key-value')?.textContent?.trim();
            if (title && value) result.push(`${title}: ${value}`);
          });
        }

        return result.join('; ');
      });

      return { categories, productVariants, description, comments };
    } catch (error) {
      this.logger.error(`${this.getLazadaProductDetail.name} error:${error.message}`);
    } finally {
      this.logger.log(`${this.getLazadaProductDetail.name} crawl ${url} finished`);
      await page.close();
    }
  }

  async getLazadaProductVariants(
    page: puppeteer.Page,
    productVariants: ProductVariant[],
    query: string,
    index: number
  ) {
    this.logger.log(`${this.getLazadaProductVariants.name} called`);
    try {
      const parentQuery = `#module_sku-select .sku-prop`;
      const skuOptions = await page.$(parentQuery);
      const link = await skuOptions.$$(query);
      const a = link?.[index];
      if (a) {
        await a.click();
        await this.wait(5000);

        const skuName = await skuOptions.$eval('.sku-name', (el) => el?.textContent).catch(() => '');
        const querySelectedImage = '.sku-variable-img-wrap-selected';

        const skuImage = await skuOptions
          .$eval(querySelectedImage, (el) => el.querySelector('.lazyload-wrapper img.image').getAttribute('src'))
          .catch(() => '');

        const variants = await this.getLazadaVariant(page);

        productVariants.push({ ...variants, skuName, skuImage });
      }
    } catch (error) {
      this.logger.error(`${this.getLazadaProductVariants.name} Error:${error.message}`);
    }
  }

  async getLazadaProductVariant(page: puppeteer.Page, productVariants: ProductVariant[]) {
    this.logger.log(`${this.getLazadaProductVariant.name} called`);
    try {
      const skuName = 'default';
      const skuImage = '';
      const variants = await this.getLazadaVariant(page);
      productVariants.push({ ...variants, skuName, skuImage });
    } catch (error) {
      this.logger.error(`${this.getLazadaProductVariant.name} Error:${error.message}`);
    }
  }

  async getLazadaVariant(page: puppeteer.Page) {
    return await page.evaluate(() => {
      let productId = '';
      let sku = '';
      const [ID, SKU] = document.URL.match(/-i[0-9]{1,}|-s[0-9]{1,}.html/g);
      if (ID && SKU) {
        productId = ID?.replace(/(-p)|(.html)|(spid=)/g, '') || '';
        sku = SKU?.replace(/(-p)|(.html)|(spid=)/g, '') || '';
      }
      const querySalePrice = '.pdp-price.pdp-price_type_normal.pdp-price_color_orange.pdp-price_size_xl';
      const salePrice = document.querySelector(querySalePrice)?.textContent;
      const queryListPrice = '.pdp-price.pdp-price_type_deleted.pdp-price_color_lightgray.pdp-price_size_xs';
      const listPrice = document.querySelector(queryListPrice)?.textContent;
      const discountPercent = document.querySelector('.pdp-product-price__discount')?.textContent;
      const isSale = Boolean(discountPercent);
      const images: string[] = [];
      const crawlImages = document.querySelectorAll(
        '#module_item_gallery_1 .item-gallery .item-gallery-slider .item-gallery__image-wrapper img'
      );
      crawlImages.forEach((elm) => {
        const url = elm?.getAttribute('src');
        if (url) images.push(url);
      });
      return { productId, sku, salePrice, listPrice, discountPercent, isSale, images };
    });
  }

  async getShopeeProductDetail(browser: puppeteer.Browser, url: string): Promise<ProductDetail> {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    try {
      this.logger.log(`${this.getShopeeProductDetail.name} goto:${url}`);
      await page.goto(url);
      await page.setDefaultNavigationTimeout(60000);
      await page.setViewport({ width: 1800, height: 6000 });

      await this.pageScrollDown(page);
      const categories: string[] = await page.$$eval(`.page-product__breadcrumb a`, (breadcrumbItems) => {
        const breadcrumb = [];
        breadcrumbItems?.forEach((elm) => {
          const url = elm?.getAttribute('href');
          if (url && url !== '#' && url !== '/') {
            breadcrumb.push(url?.split('.')?.pop());
          }
        });
        return breadcrumb;
      });

      const description = await page.evaluate(() => {
        const crawlDescription = document.querySelectorAll('.product-detail.page-product__detail .KqLK01 ._3Xk7SJ');
        const result: string[] = [];

        if (crawlDescription.length) {
          crawlDescription.forEach((elm) => {
            const title = elm.querySelector('label')?.textContent?.trim();
            const value = elm.querySelector('div')?.textContent?.trim();
            const divclass = elm.querySelector('div')?.getAttribute('class');
            if (title && value && !divclass) result.push(`${title}: ${value}`);
          });
        }

        return result.join('; ');
      });

      const variantsOptions = await page.$$('.flex.hInOdW .TvGNLb');
      for (let i = 0; i < variantsOptions.length; i++) {
        const options = await page.$$('.flex.hInOdW .TvGNLb');
        const option = options[i];
        const button = await option.$('.product-variation');
        if (button) button.click();
      }

      await this.wait(2000);

      const productVariants: ProductVariant[] = [];
      await this.getShopeeProductVariant(page, productVariants);

      await this.pageScrollDown(page);

      const comments: ProductComment[] = await page.evaluate(() => {
        const productComments = [];
        const crawlComments = document.querySelectorAll(
          '.product-ratings .shopee-product-comment-list .shopee-product-rating'
        );
        crawlComments.forEach((elm) => {
          const reviewerName = elm.querySelector('.shopee-product-rating__author-name')?.textContent?.trim();
          const reviewerSatisfactionLevel = '';
          const reviewContent = elm.querySelector('.Em3Qhp')?.textContent;
          const reviewImages = [];

          /** crawl product sku image */
          const crawlCommentImages = elm.querySelectorAll(
            '.shopee-product-rating__image-list-wrapper .shopee-rating-media-list-image__wrapper .shopee-rating-media-list-image__content'
          );
          crawlCommentImages.forEach((image) => {
            // eslint-disable-next-line no-unsafe-optional-chaining
            const [imageUrl] = (image.getAttribute('style') + '')?.match(/(url\(")[a-zA-Z0-9-_:/.]{1,}/g);
            if (imageUrl) reviewImages.push((imageUrl + '').replace(/(url\(")|("\))/g, ''));
          });
          productComments.push({ reviewerName, reviewerSatisfactionLevel, reviewContent, reviewImages });
        });
        return productComments;
      });

      return { categories, productVariants, description, comments };
    } catch (error) {
      this.logger.error(`${this.getShopeeProductDetail.name} error:${error.message}`);
    } finally {
      this.logger.log(`${this.getShopeeProductDetail.name} crawl ${url} finished`);
      await page.close();
    }
  }

  async getShopeeProductVariant(page: puppeteer.Page, productVariants: ProductVariant[]) {
    this.logger.log(`${this.getShopeeProductVariant.name} called`);
    try {
      const skuName = 'default';
      const skuImage = '';
      const variants = await this.getShopeeVariant(page);
      productVariants.push({ ...variants, skuName, skuImage });
    } catch (error) {
      this.logger.error(`${this.getShopeeProductVariant.name} Error:${error.message}`);
    }
  }

  async getShopeeVariant(page: puppeteer.Page) {
    return await page.evaluate(() => {
      let productId = '';
      let sku = '';
      const [ID, SKU] = document.URL.match(/(-i.[0-9]{1,})|(\.[0-9]{1,})/g);
      if (ID && SKU) {
        productId = ID?.replace(/(-|i|\.)/g, '') || '';
        sku = SKU?.replace(/(-|i|\.)/g, '') || '';
      }
      const querySalePrice = '.pmmxKx';
      const salePrice = document.querySelector(querySalePrice)?.textContent;
      const queryListPrice = '.CDN0wz';
      const listPrice = document.querySelector(queryListPrice)?.textContent;
      const discountPercent = document.querySelector('.lTuS3S')?.textContent;
      const isSale = Boolean(discountPercent);
      const images: string[] = [];
      const crawlImages = document.querySelectorAll('.PZ3-ep .Mzs0kz div.agPpyA');
      crawlImages.forEach((elm) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        const [imageUrl] = (elm.getAttribute('style') + '')?.match(/url\("[a-zA-Z0-9:/._]{1,}"\)/g);
        if (imageUrl) images.push((imageUrl + '').replace(/(url\(")|("\))/g, ''));
      });
      return { productId, sku, salePrice, listPrice, discountPercent, isSale, images };
    });
  }
}
