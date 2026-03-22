import { Category } from "./category.model";

export interface ProductProps {
  id: number;
  name: string;
  price: number;
  category: Category;
  image?: string;
}

export class Product implements ProductProps {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public category: Category,
    public image?: string,
  ) {}
}
