export default class Item {

	weight: number;
	price: number;
	details: string[];
	image: string;
	link: string;
	category: string[];

	constructor() {
		this.category = [];
	}
}