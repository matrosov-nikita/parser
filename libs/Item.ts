const CategoryNameMap = {
  "роллы": /ролл/i,
  "пицца": /пицц/i,
  "лапша": /лапш/i,
  "паста": /паст/i,
  "суши": /суш/i,
  "соус": /соус/i,
  "супы": /суп/i,
  "салаты": /салат/i,
  "напитки": /напит/i
}

export default class Item {

  weight: number;
  price: number;
  details: string[];
  image: string;
  link: string;
  name: string;
  categories: string[];

  constructor() {
    this.categories = [];
  }

  findCategory(categoryName) {
    Object.keys(CategoryNameMap).forEach(name => {
      if (CategoryNameMap[name].test(categoryName) || CategoryNameMap[name].test(this.name) ) {
        this.categories.push(name);
      }
    });
  }
}