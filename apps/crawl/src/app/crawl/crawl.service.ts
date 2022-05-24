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

@Injectable()
export class CrawlService {
  private readonly logger = new Logger(`Micro-Crawl.${CrawlService.name}`);
  private readonly shopeeCategoryData = [
    {
      type: 'smartphone',
      name: 'Điện thoại',
      ids: ['11036031'],
      slug: 'smartphone',
    },
    {
      type: 'monitor',
      name: 'Màn hình máy tính',
      ids: ['11035961'],
      slug: 'monitor',
    },
  ];

  private readonly tikiCategoryData = [
    {
      type: 'smartphone',
      name: 'Điện thoại smartphone',
      ids: ['c1795'],
      slug: 'smartphone',
    },
    {
      type: 'monitor',
      name: 'Màn hình máy tính',
      ids: ['c28932', 'c12672', 'c28930'],
      slug: 'monitor',
    },
  ];

  private readonly lazadaCategoryData = [
    {
      type: 'smartphone',
      name: 'Điện thoại smartphone',
      ids: ['dien-thoai-di-dong'],
      slug: 'smartphone',
    },
    {
      type: 'monitor',
      name: 'Màn hình máy tính',
      ids: ['man-hinh-vi-tinh'],
      slug: 'monitor',
    },
  ];

  constructor(
    private readonly productRepo: ProductRepo,
    private readonly configRepo: ConfigRepo,
    private readonly categoryRepo: CategoryRepo
  ) {}

  async crawlData({ url }: CrawlPayload) {
    const browser = await puppeteer.launch({ headless: true, handleSIGINT: false, args: args });
    try {
      this.logger.log(`${this.crawlData.name} data${JSON.stringify({ url })}`);
      let products: any[] = [];
      const merchant = this.getMerchant(url);
      switch (merchant) {
        case 'tiki': {
          products = await this.getTikiProducts(browser, url);
          break;
        }
        case 'shopee': {
          products = await this.getShopeeProducts(browser, url);
          break;
        }
        case 'lazada': {
          products = await this.getLazadaProducts(browser, url);
          break;
        }
      }

      const categorySlug = this.getCateId(url, merchant);
      const mapCate = this.mappingCategory(merchant, categorySlug);

      const toBeCreated = CreateProductDTO.fromArray(products);
      await browser.close();
      await this.productRepo.insertData(toBeCreated);
      // return { toBeCreated };
    } catch (error) {
      await browser.close();
      this.logger.error(`${this.crawlData.name} Error:${error.message}`);
    }
  }

  async getTikiProducts(browser: puppeteer.Browser, url: string) {
    this.logger.log(`${this.getTikiProducts.name} called`);
    const page = await browser.newPage();
    await page.goto(url);
    this.logger.log(`${this.getTikiProducts.name} goto:${url}`);
    const articles = await page.evaluate(() => {
      const results: any[] = [];
      const items = document.querySelectorAll('.product-item');
      items.forEach((product) => {
        const temp: any = {};
        temp.productName = product.querySelector('.name h3').textContent;
        temp.thumbnail = product.querySelector('.thumbnail picture.webpimg-container img').getAttribute('src');
        const average =
          product
            .querySelector('.average')
            ?.getAttribute('style')
            ?.replace(/width:|%/g, '') || null;
        const sold =
          +product.querySelector('.styles__StyledQtySold-sc-732h27-2.fCfYNm')?.textContent?.replace('Đã bán ', '') || 0;
        temp.isSale = product.querySelector('.price-discount.has-discount') ? true : false;
        temp.salePrice = +product.querySelector('.price-discount__price')?.textContent?.replace(/\.| ₫/g, '');
        temp.discountPercent =
          +product.querySelector('.price-discount__discount')?.textContent?.replace(/-|%/g, '') || 0;
        const productUrl = product.getAttribute('href')?.split('.html').shift() + '.html';
        let url = '';
        if (productUrl.startsWith('//tka.tiki.vn')) {
          url = productUrl.replace('//tka.tiki.vn', 'https://tka.tiki.vn');
        } else {
          url = `https://tiki.vn${productUrl}`;
        }
        temp.productUrl = url;
        temp.merchant = 'tiki';
        temp.productId = productUrl.replace('.html', '').split('p').pop();
        temp.average = +average;
        temp.sold = sold;
        results.push(temp);
      });
      return results;
    });
    await page.close();
    return articles;
  }

  async getShopeeProducts(browser: puppeteer.Browser, url: string) {
    this.logger.log(`${this.getShopeeProducts.name} called`);
    const page = await browser.newPage();
    await page.goto(url);
    this.logger.log(`${this.getShopeeProducts.name} goto:${url}`);
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

    await page.screenshot({ path: 'screenshot.png' });

    const articles = await page.evaluate(() => {
      const results: any[] = [];
      const items = document.querySelectorAll(
        '.row.shopee-search-item-result__items .col-xs-2-4.shopee-search-item-result__item'
      );

      items.forEach((product) => {
        const temp: any = {};
        temp.productName = product.querySelector('.ZG__4J ._10Wbs-._2STCsK._3IqNCf')?.textContent;
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
        temp.isSale = product.querySelector('._2qsK5P') ? true : false;
        temp.salePrice = +product.querySelector('._3c5u7X')?.textContent?.replace(/\.| ₫/g, '');
        temp.discountPercent = +product.querySelector('.percent')?.textContent?.replace(/-|%/g, '') || 0;
        const productUrl = product.querySelector('a').getAttribute('href')?.split('?').shift();
        const url = `https://shopee.vn/${productUrl}`;
        temp.productUrl = url;
        temp.merchant = 'shopee';
        temp.productId = productUrl.split('.').pop();
        temp.average = Math.round(average);
        temp.sold = sold;
        results.push(temp);
      });

      return results;
    });
    await page.close();
    return articles;
  }

  async getLazadaProducts(browser: puppeteer.Browser, url: string) {
    this.logger.log(`${this.getLazadaProducts.name} called`);
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    this.logger.log(`${this.getLazadaProducts.name} goto:${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.wait(5000);
    const articles = await page.evaluate(() => {
      const results: any[] = [];
      const items = document.querySelectorAll('.Bm3ON');
      items.forEach((product) => {
        const temp: any = {};
        temp.productName = product.querySelector('.RfADt a').textContent;
        temp.thumbnail = product.querySelector('.picture-wrapper img').getAttribute('src');
        temp.isSale = product.querySelector('.WNoq3') ? true : false;
        temp.salePrice = +product.querySelector('.ooOxS')?.textContent?.replace(/\.| ₫|₫|,/g, '');
        temp.discountPercent = +product.querySelector('.IcOsH')?.textContent?.replace(/-|%/g, '') || 0;
        const productUrl = product.querySelector('._95X4G a').getAttribute('href')?.split('.html').shift();
        let url = '';
        if (productUrl.startsWith('//www.lazada.vn')) {
          url = productUrl.replace('//www.lazada.vn', 'https://www.lazada.vn') + '.html';
        } else {
          url = `https://www.lazada.vn${productUrl}.html`;
        }
        temp.productUrl = url;
        temp.merchant = 'lazada';
        const idAndSku = productUrl.split('-i').pop();
        const [productId, sku] = idAndSku.split('-s');
        temp.productId = productId;
        temp.average = 0;
        temp.sold = 0;
        results.push(temp);
      });
      return results;
    });
    await page.close();
    return articles;
  }

  mappingCategory(merchant: Merchange, cateId: string) {
    switch (merchant) {
      case MerchangeEnum.SHOPEE: {
        const [cate] = this.shopeeCategoryData.filter((elm) => elm.ids.includes(cateId));
        return cate;
      }
      case MerchangeEnum.TIKI: {
        const [cate] = this.tikiCategoryData.filter((elm) => elm.ids.includes(cateId));
        return cate;
      }
      case MerchangeEnum.LAZADA: {
        const [cate] = this.lazadaCategoryData.filter((elm) => elm.ids.includes(cateId));
        return cate;
      }
    }
  }

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

      await page.screenshot({ path: 'category.png' });
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
}
