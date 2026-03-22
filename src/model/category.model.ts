export interface CategoryProps {
  id: number;
  name: string;
}

export class Category implements CategoryProps {
  constructor(
    public id: number,
    public name: string,
  ) {}
}
