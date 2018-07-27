export default class Set {
  items: any  // { item: boolean }

  constructor(initialItems: Array<any> = []) {
    this.items = {};

    initialItems.forEach((item) => {
      this.items[item] = true;
    });
  }

  add<T>(item: T) {
    this.items[item] = true;
  }

  getLength(): number {
    return this.getItems().length;
  }

  getItems(): Array<any> {
    return Object.keys(this.items);
  }
}
