import { Cart } from "./model/cart.model";
import { Category } from "./model/category.model";
import { Product } from "./model/product.model";
import { User, UserRole } from "./model/user.model";

const electronics = new Category(1, "Eletronicos");

const keyboard = new Product(1, "Teclado Mecanico", 250, electronics);
const mouse = new Product(2, "Mouse Gamer", 150, electronics);

const customer = new User(1, "alice", "alice@email.com", UserRole.CUSTOMER);
const admin = new User(2, "admin", "admin@email.com", UserRole.ADMIN);

const cart = new Cart();
cart.addItem(keyboard, 1);
cart.addItem(mouse, 2);
cart.addItem(keyboard, 3);

console.log("Usuarios:", customer, admin);
console.log("Itens no carrinho:", cart.listItems());
console.log("Quantidade total de unidades:", cart.getTotalItems());
console.log("Preco final:", cart.getFinalPrice());

