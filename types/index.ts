import * as cheerio from 'cheerio';

export interface Parser {
	address: string,
	weight: ItemRule,
	price: ItemRule,
	name: ItemRule,
	link: ItemRule,
	image: ItemRule,
	categoryRule: CategoryRule,
}

export interface Category {
	name: string,
	link: string
}

export interface CategoryRule {
	linkSelector: string,
	itemSelector: string,
	handler?: (value: Cheerio) => Category
}

export interface ItemRule {
	selector: string,
	handler?: (value: Cheerio, category?: string) => any
}