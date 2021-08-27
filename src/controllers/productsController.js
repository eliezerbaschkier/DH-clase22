const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {products: products,
		toThousand: toThousand})
	},

	// Detail - Detail from one product    
	detail: (req, res) => {
		let idProduct = parseInt(req.params.id);
		let product = products.filter(i => i.id === idProduct);
		res.render('detail', {product: product,
			toThousand: toThousand}); 
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let newProduct = {
			id: (products.length + 1),
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: ""
		};
		products.push(newProduct);
		let productsJSON = JSON.stringify(products);
		fs.writeFileSync(productsFilePath, productsJSON);
		res.redirect('/products'); //VER POR QUÉ NO CARGA LA PÁGINA
	},

	// Update - Form to edit
	edit: (req, res) => {
		let idProduct = parseInt(req.params.id);
		let productToEdit = products.filter(i => i.id === idProduct);
		res.render('product-edit-form', {productToEdit: productToEdit,
			toThousand: toThousand}); 
	},
	// Update - Method to update
	update: (req, res) => {
		let idProduct = parseInt(req.params.id);
		products.forEach(product => {
			if(product.id === idProduct) {
				product.name = req.body.name;
				product.price = req.body.price;
				product.discount = req.body.discount;
				product.category = req.body.category;
				product.description = req.body.description;
			}
		});
		let productsJSON = JSON.stringify(products);
		fs.writeFileSync(productsFilePath, productsJSON);
		res.redirect('/products');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let idProduct = parseInt(req.params.id);
		let productsUpdated = products.filter(i => i.id !== idProduct);
		let productsUpdatedJSON = JSON.stringify(productsUpdated);
		fs.writeFileSync(productsFilePath, productsUpdatedJSON);
		res.redirect('/products');
	}
};

module.exports = controller;