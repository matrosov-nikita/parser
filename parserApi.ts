
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import Item from './libs/Item';

class ParserApi {

	load(url) {
		return rp(url);
	}

	changeLink(link: string, address: string): string {
		if (link[0] === '/') {
			link = address + link;
		}

		return link;
	}

	parseCategory(content: string, address: string, categoryRule: CategoryRule): Category[] {
		let $ = cheerio.load(content);
		let links = $(categoryRule.linkSelector);
		return [].map.call(links, link => {
			if (categoryRule.handler) {
				let category: Category  = categoryRule.handler($(link));
				category.link = this.changeLink(category.link, address);
				return category;
			}

			return {
				link: this.changeLink($(link).attr('href'), address),
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

	parseItem(itemContent: any, filters: any, category: any, address: string): Item {
		let item = new Item();
		let $ = cheerio.load(itemContent);

		filters.forEach(filter => {
			let itemVal =  $(filter.rule.selector);
			let handler = filter.rule.handler;
			item[filter.fieldName] = (handler) ? handler(itemVal, category) : itemVal.text();
		});

		item.findCategory(category);

		item.link = this.changeLink(item.link, address);
		item.image = this.changeLink(item.image, address);

		return item;
	}
}

export default ParserApi;