import {ItemRule, CategoryRule} from '../parserApi';
import * as cheerio from 'cheerio';


interface Parser {
	address: string,
	weight: ItemRule,
	price: ItemRule,
	name: ItemRule,
	link: ItemRule,
	image: ItemRule,
	categoryRule: CategoryRule,
}

class SauriParser implements Parser {

	address = "http://363636.ru";

	categoryRule  = {
		linkSelector: ".nav_left a",
		itemSelector: ".product_list li",
		handler: link => ({ link: this.address + link.attr('href'), name: link.text() })
	}

	weight: ItemRule =  {
		selector: ".description .weight",
		handler: value => parseInt(value.text().split(' ')[0])
	}

	price: ItemRule =  {
		selector: ".description .price",
		handler: value => value.text().trim().split(' ')[0]
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
		handler: value => this.address + value.attr('href')
	}

	image: ItemRule = {
		selector: ".pic a img",
		handler: value => this.address + value.attr('src')
	}
}

export default SauriParser;