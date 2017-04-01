
import ParserApi from '../parserApi';
import Utils from  '../helpers/utils';
const fs = require('fs');
const path = require('path');
const parserApi = new ParserApi();

class Main {
	run() {
		let parsersPath = path.join(__dirname, '../parsers');
		let folders: string[] = fs.readdirSync(parsersPath, { encoding: 'utf8' });

		return Promise.all(folders.map(folder => {
			let Parser = require(path.join(parsersPath, folder)).default;
			return this.parse(new Parser());
		}));
	}


	parse(parser) {
		return parserApi.load(parser.address)
			.then(mainPageContent => parserApi.parseCategory(mainPageContent, parser.categoryRule))
			.then(categories=> {
				return Promise.all(categories.map(parserApi.loadCategory.bind(parserApi)));
			})
			.then(loadedCategories => {
				return loadedCategories.map(loadedCategory => ({
					name: loadedCategory['name'],
					items: parserApi.parse(loadedCategory['content'], parser.categoryRule.itemSelector)
				}));
			})
			.then(parsedCategories => {
				let filters = parserApi.getFilters(parser);

				return parsedCategories.map(category => {
					return [].map.call(category.items, item => parserApi.parseItem(item, filters, category.name));
				});
			})
			.then(items => {
				return Utils.flattenFirstLevel(items);
			});
	}
}


export default Main;