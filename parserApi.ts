
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import Item from './libs/Item';
import { CategoryRule } from './types';

const CategoryNameMap = {
	"роллы": /ролл/i,
	"пицца": /пицц/i,
	"лапша": /лапш/i,
	"паста": /паст/i,
	"супы": /суп/i,
	"салаты": /салат/i,
	"напитки": /напит/i
}

class ParserApi {

	load(url) {
		return rp(url);
	}


	parseCategory(content: string, categoryRule: CategoryRule) {
		let $ = cheerio.load(content);
		let links = $(categoryRule.linkSelector);
		return [].map.call(links, link => {
			if (categoryRule.handler) {
				return categoryRule.handler($(link));
			}

			return {
				link: $(link).attr('href'),
				name: $(link).text()
			}
		});
	}

	getFilters(parser) {
		return Object.keys(parser)
				.filter(prop => parser[prop].selector)
				.map(prop => ({ fieldName: prop, rule: parser[prop]}));
	}

	loadCategory(category): Promise<{name: string, content: string}> {
		return this.load(category.link)
			.then(content => ({name: category.name, content}));
	}

	parse(content: string, selector: string) {
		let $ = cheerio.load(content);
		return $(selector);
	}

	parseItem(itemContent: any, filters: any, category: any): Item {
		let item = new Item();

		Object.keys(CategoryNameMap).forEach(name => {
			if (CategoryNameMap[name].test(category)) {
				item.category.push(name);
			}
		});

		let $ = cheerio.load(itemContent);

		filters.forEach(filter => {
			let itemVal =  $(filter.rule.selector);
			let handler = filter.rule.handler;
			item[filter.fieldName] = (handler) ? handler(itemVal, category) : itemVal.text();
		});

		return item;
	}
}

export default ParserApi;