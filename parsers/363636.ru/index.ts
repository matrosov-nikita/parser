import * as cheerio from 'cheerio';

class SauriParser implements Parser {

  address = "http://363636.ru";

  categoryRule  = {
    linkSelector: ".nav_left a",
    itemSelector: ".product_list li"
  }

  weight: ItemRule =  {
    selector: ".description .weight",
    handler: value => parseInt(value.text().split(' ')[0])
  }

  price: ItemRule =  {
    selector: ".description .price",
    handler: value => parseInt(value.text().trim())
  }

  name: ItemRule =  {
    selector: ".description h3 a",
  }

  details: ItemRule = {
    selector: ".description p:not([class])",
    handler: value => value.text().slice(8).replace('.', '').split(', ')
  }

  link: ItemRule = {
    selector: ".pic a",
    handler: value => value.attr('href')
  }

  image: ItemRule = {
    selector: ".pic a img",
    handler: value => value.attr('src')
  }
}

export default SauriParser;