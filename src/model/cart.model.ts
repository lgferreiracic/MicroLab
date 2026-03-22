import { Product } from "./product.model";

export interface CartItem {
  product: Product;
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];

  addItem(product: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }

    const hasProduct = this.items.some((item) => item.product.id === product.id);

    if (hasProduct) {
      const existingItem = this.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      }
      return;
    }

    this.items.push({ product, quantity });
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getFinalPrice(): number {
    return this.items.reduce(
      (totalPrice, item) => totalPrice + item.product.price * item.quantity,
      0,
    );
  }

  listItems(): CartItem[] {
    return this.items;
  }
}
