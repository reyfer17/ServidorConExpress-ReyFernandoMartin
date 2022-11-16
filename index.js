let fs = require('fs');
let express = require("express");
const PORT = 8080;
let app = express();

class Contenedor {
    constructor(url){
        this.url = url;
    }

    async save(obj){
        const products = await this.getAll();
        obj.id = ( products.length === 0 ) ? 1 : products[products.length - 1].id + 1;
        products.push(obj);
        try {
            console.log(`${JSON.stringify(obj)} fue agregado`);
            return await fs.promises.writeFile('./productos.json', JSON.stringify(products, null, 2));
        } catch (error) {
            throw new Error(error);
        }
    }
    async getAll(){
        try {
            let products = await fs.promises.readFile(this.url, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.log(error, 'Productos esta vacio.');
            return [];
        }
    }
}

const FILE = new Contenedor('./productos.json');

app.get("/", (req, res) => {
    res.send(`
    <h1 style="color:grey;text-align:center;">EXPRESS SERVER</h1>
    <h4 style="color:red;">Ir a '/productos', para ver todos los productos.</h4>
    <h4 style="color:blue;">Ir a '/productoRandom' para ver un producto al azar.</h4>
    `);
});

app.get("/productos", async (req, res) => {
    let products = await FILE.getAll();
    res.send(products);
});

app.get("/productoRandom", async (req, res) => {
    let products = await FILE.getAll();
    res.send(products[Math.floor(Math.random()*3)]);
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));