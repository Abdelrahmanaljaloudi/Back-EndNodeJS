const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const productsFilePath = 'products.json';
const products = require(`./products.json`);


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile('public/mainPage.html', { root: __dirname });
});


app.get('/form', (req, res) => {
    res.sendFile('public/formPage.html', { root: __dirname });
});


app.get('/products', (req, res) => {
    res.json(products);
});


app.post('/requestProduct', (req, res) => {
    const productName = req.body.product;
    const quantity = req.body.quantity;


    res.json({ message: `Order placed for ${quantity} ${productName}(s)` });
});

app.post('/addProduct', (req, res) => {
    const newProduct = req.body;

    const productName = newProduct.product;

    if (products[productName]) {
        res.status(400).json({ error: 'Product already exists' });
    } else {
        const productId = Object.keys(products).length + 1;
        newProduct.id = productId;

        products[productName] = newProduct;

 
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

        res.json({ message: 'Product added successfully', product: newProduct });
    }
});

app.listen(9000, () => {
    console.log('Server is running on http://localhost:9000');
});
