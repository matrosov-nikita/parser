interface Parser {
  address: string,
  weight: ItemRule,
  price: ItemRule,
  name: ItemRule,
  link: ItemRule,
  image: ItemRule,
  categoryRule: CategoryRule
}

interface Category {
  name: string,
  link: string
}

interface CategoryRule {
  linkSelector: string,
  itemSelector: string,
  handler?: (value: Cheerio) => Category
}

interface ItemRule {
  selector: string,
  handler?: (value: Cheerio, category?: string) => any
}
