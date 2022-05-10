import { Injectable, Logger } from '@nestjs/common';
import { CrawlPayload, CreateProductDTO, PagingProductResponse } from '@aff-services/shared/models/dtos';
import { getRepository } from 'typeorm';
import { Product } from '@aff-services/shared/models/entities';

import * as puppeteer from 'puppeteer';
import { ConfigRepo } from './repositories/configRepo';
const args = ['--disable-gpu', '--no-sandbox'];
process.setMaxListeners(Infinity);

@Injectable()
export class AppService {
  private readonly logger = new Logger(`Micro.Crawl${AppService.name}`);

  constructor(private readonly configRepo: ConfigRepo) {}

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

  async getData() {
    const browser = await puppeteer.launch({ headless: true, handleSIGINT: false, args: args });
    const url = `https://tiki.vn/dien-thoai-smartphone/c1795`;
    const products = await this.getTikiProducts(browser, url);
    const toBeCreated = CreateProductDTO.fromArray(products);
    // for (const product of products) {
    //   const { productImages = [], info = '' } = await this.getTikiProductDetail(browser, product);
    //   product.images = productImages;
    //   product.info = info;
    // }

    // const products = await this.getShopeeProducts(browser);
    await browser.close();

    const cateId = this.getCateId(url, 'tiki');
    console.log({ products, cateId });
    // const result = await getRepository(Product)
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Product)
    //   .values(toBeCreated)
    //   .orUpdate(
    //     [
    //       'product_name',
    //       'thumbnail',
    //       'is_sale',
    //       'sale_price',
    //       'discount_percent',
    //       'average',
    //       'sold',
    //       'description',
    //       'merchant',
    //       'slug',
    //       'product_url',
    //       'updated_at',
    //     ],
    //     ['product_id']
    //   )
    //   .execute();
    // return { products: toBeCreated };
    return {
      toBeCreated,
    };
  }

  async getTikiProductDetail(browser: puppeteer.Browser, product: any) {
    try {
      this.logger.log(`${this.getTikiProductDetail.name} goto${product.url}`);
      const page = await browser.newPage();
      await page.goto(product.url, { waitUntil: 'domcontentloaded' });
      // await page.waitFor(2000);
      await page.waitForSelector('img');
      await page.screenshot({
        path: 'capture.jpg',
        fullPage: true,
      });
      // page.close();

      const result = await page.evaluate(() => {
        const images = document.querySelectorAll('.review-images__list .WebpImg__StyledImg-sc-h3ozu8-0.fWjUGo');
        const productImages: string[] = [];
        images.forEach((elm) => productImages.push(elm.getAttribute('src')));

        // const info = document.querySelector('.style__Wrapper-sc-12gwspu-0.cIWQHl .content.has-table').textContent;
        const info = '';
        return { productImages, info };
      });
      await page.close();

      return result;
    } catch (error) {
      console.log(error);
      this.logger.error(`${this.getTikiProductDetail.name} can't go ${product.url}`);
      return { productImages: [], info: '' };
    }
  }

  wait(ms) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
  }

  async getProducts() {
    const [data, total] = await getRepository(Product).findAndCount();
    return PagingProductResponse.from(total, data);
  }

  mappingCategory(merchant: 'tiki' | 'lazada' | 'shopee', cateId: string) {
    switch (merchant) {
      case 'shopee': {
        const [cate] = this.shopeeCategoryData.filter((elm) => elm.ids.includes(cateId));
        return cate;
      }
      case 'tiki': {
        const [cate] = this.tikiCategoryData.filter((elm) => elm.ids.includes(cateId));
        return cate;
      }
      case 'lazada': {
        const [cate] = this.lazadaCategoryData.filter((elm) => elm.ids.includes(cateId));
        return cate;
      }
    }
  }

  getCateId(url: string, merchant: 'tiki' | 'lazada' | 'shopee') {
    switch (merchant) {
      case 'tiki': {
        return url.split('/').pop();
      }
      case 'shopee': {
        return url.split('.').pop();
      }
      case 'lazada': {
        return url.replace('https://www.lazada.vn/', '').split('/').shift();
      }
    }
  }

  async crawlData({ url }: CrawlPayload) {
    const browser = await puppeteer.launch({ headless: true, handleSIGINT: false, args: args });
    try {
      this.logger.log(`${this.crawlData.name} data${JSON.stringify({ url })}`);
      let products: any[] = [];
      const merchant = url.startsWith('https://www.')
        ? (url.replace('https://www.', '').split('.vn')[0] as 'tiki' | 'lazada' | 'shopee')
        : (url.replace('https://', '').split('.vn')[0] as 'tiki' | 'lazada' | 'shopee');
      console.log(merchant);
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
      console.log({ merchant, categorySlug });
      const mapCate = this.mappingCategory(merchant, categorySlug);

      console.log({ mapCate });
      const toBeCreated = CreateProductDTO.fromArray(products);
      await browser.close();
      return { toBeCreated };
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
        console.log(productUrl.replace('.html', '').split('p'));
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
        console.log(productUrl.replace('.html', '').split('p'));
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
          url = productUrl.replace('//www.lazada.vn', 'https://www.lazada.vn');
        } else {
          url = `https://www.lazada.vn${productUrl}`;
        }
        temp.productUrl = url;
        temp.merchant = 'lazada';
        console.log(productUrl.replace('.html', '').split('p'));
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

  async getConfigs() {
    return await this.configRepo.getAll();
  }
}
