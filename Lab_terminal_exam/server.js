let express = require("express");
let expressLayouts = require("express-ejs-layouts");
let server = express();
let mongoose = require("mongoose");
const path = require('path');

const session = require('express-session');
const flash = require('connect-flash');

const isAuthenticated = require('./middleware/auth');
const isAdmin = require('./middleware/isAdmin');

const Product = require('./models/product.model');
const Order = require('./models/order.model');
const User = require('./models/user.model');
const Complaint = require('./models/Complaint');

// --- Middleware Configuration ---

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(session({
    secret: 'superSecret123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

server.use(flash());

server.use(async (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');

    if (req.session.userId) {
        // Logged-in user: get cart from DB
        try {
            const user = await User.findById(req.session.userId);
            res.locals.cart = user && user.cart ? user.cart : [];
        } catch (err) {
            res.locals.cart = [];
        }
    } else {
        res.locals.cart = req.session.cart || {};
    }

    res.locals.isAuthenticated = !!req.session.userId;
    res.locals.user = req.session.user;
    res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : false;

    next();
});

server.use(express.static("public"));
server.use(expressLayouts);
server.set('layout', 'layout');
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, 'views'));


// --- Authentication Routes (Handled by routes/auth.js) ---
const authRoutes = require('./routes/auth');
server.use(authRoutes);

// --- Core User Routes ---

server.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard');
});

server.get("/homepage", async (req, res) => {
    res.render("homepage");
});

server.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products', { products });
    } catch (err) {
        console.error('Error fetching products:', err);
        req.flash('error_msg', 'Could not load products. Please try again later.'); 
        res.status(500).render('error', { message: 'Error loading products.' }); 
    }
});

// NEW: Product Detail Page Route
server.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error_msg', 'Product not found.');
            return res.redirect('/products'); 
        }

        // Fetch "You may also like" products (random 4 products, excluding the current one)
        const relatedProducts = await Product.aggregate([
            { $match: { _id: { $ne: product._id } } }, // Exclude the current product
            { $sample: { size: 4 } } // Get 4 random products
        ]);

        res.render('product-detail', { product, relatedProducts }); // Pass both to EJS
    } catch (err) {
        console.error('Error fetching product details:', err);
        req.flash('error_msg', 'Could not load product details. Please try again.');
        res.redirect('/products'); 
    }
});


// --- Cart Routes ---

server.post('/cart/add', async (req, res) => {
    const { productId, quantity, redirectBack } = req.body;
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty <= 0) {
        req.flash('error_msg', 'Invalid quantity specified.');
        return res.redirect(redirectBack || '/products');
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error_msg', 'Product not found.');
            return res.redirect(redirectBack || '/products');
        }
        if (product.quantity < qty) {
            req.flash('error_msg', `Sorry, only ${product.quantity} of ${product.name} are available.`);
            return res.redirect(redirectBack || '/products');
        }

        if (req.session.userId) {
            // Logged-in user: update DB cart
            const user = await User.findById(req.session.userId);
            let cartItem = user.cart.find(item => item.product.equals(productId));
            if (cartItem) {
                if (product.quantity < (cartItem.quantity + qty)) {
                    req.flash('error_msg', `Adding ${qty} would exceed available stock for ${product.name}.`);
                    return res.redirect(redirectBack || '/products');
                }
                cartItem.quantity += qty;
                req.flash('success_msg', `${product.name} quantity updated in cart.`);
            } else {
                user.cart.push({ product: productId, quantity: qty });
                req.flash('success_msg', `${product.name} added to cart!`);
            }
            await user.save();
        } else {
            // Guest user: use session cart
            let cart = req.session.cart || {};
            if (cart[productId]) {
                if (product.quantity < (cart[productId].quantity + qty)) {
                    req.flash('error_msg', `Adding ${qty} would exceed available stock for ${product.name}.`);
                    return res.redirect(redirectBack || '/products');
                }
                cart[productId].quantity += qty;
                req.flash('success_msg', `${product.name} quantity updated in cart.`);
            } else {
                cart[productId] = {
                    id: product._id.toString(),
                    name: product.name,
                    price: parseFloat(product.discountedPrice.replace('Rs.', '').replace(',', '')),
                    imageUrl: product.imageUrl,
                    quantity: qty
                };
                req.flash('success_msg', `${product.name} added to cart!`);
            }
            req.session.cart = cart;
        }
        res.redirect(redirectBack || '/products');
    } catch (err) {
        console.error('Error adding to cart:', err);
        req.flash('error_msg', 'Failed to add product to cart. Please try again.');
        res.redirect(redirectBack || '/products');
    }
});

server.post('/cart/update-quantity', async (req, res) => {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty < 0) {
        req.flash('error_msg', 'Invalid quantity.');
        return res.redirect('/cart');
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error_msg', 'Product not found in store, cannot update cart.');
            if (req.session.userId) {
                const user = await User.findById(req.session.userId);
                user.cart = user.cart.filter(item => !item.product.equals(productId));
                await user.save();
            } else {
                let cart = req.session.cart || {};
                delete cart[productId];
                req.session.cart = cart;
            }
            return res.redirect('/cart');
        }

        if (req.session.userId) {
            const user = await User.findById(req.session.userId);
            let cartItem = user.cart.find(item => item.product.equals(productId));
            if (cartItem) {
                if (qty === 0) {
                    user.cart = user.cart.filter(item => !item.product.equals(productId));
                    req.flash('success_msg', 'Product removed from cart.');
                } else {
                    if (product.quantity < qty) {
                        req.flash('error_msg', `Only ${product.quantity} of ${product.name} are available. Quantity not updated.`);
                        return res.redirect('/cart');
                    }
                    cartItem.quantity = qty;
                    req.flash('success_msg', 'Cart quantity updated.');
                }
                await user.save();
            } else {
                req.flash('error_msg', 'Product not found in cart.');
            }
        } else {
            let cart = req.session.cart || {};
            if (cart[productId]) {
                if (qty === 0) {
                    delete cart[productId];
                    req.flash('success_msg', 'Product removed from cart.');
                } else {
                    if (product.quantity < qty) {
                        req.flash('error_msg', `Only ${product.quantity} of ${product.name} are available. Quantity not updated.`);
                        return res.redirect('/cart');
                    }
                    cart[productId].quantity = qty;
                    req.flash('success_msg', 'Cart quantity updated.');
                }
            } else {
                req.flash('error_msg', 'Product not found in cart.');
            }
            req.session.cart = cart;
        }
        res.redirect('/cart');
    } catch (err) {
        console.error('Error updating cart quantity:', err);
        req.flash('error_msg', 'Failed to update cart quantity.');
        res.redirect('/cart');
    }
});

server.post('/cart/remove', async (req, res) => {
    const { productId } = req.body;
    try {
        if (req.session.userId) {
            const user = await User.findById(req.session.userId);
            user.cart = user.cart.filter(item => !item.product.equals(productId));
            await user.save();
            req.flash('success_msg', 'Product removed from cart.');
        } else {
            let cart = req.session.cart || {};
            if (cart[productId]) {
                delete cart[productId];
                req.flash('success_msg', 'Product removed from cart.');
            } else {
                req.flash('error_msg', 'Product not found in cart.');
            }
            req.session.cart = cart;
        }
        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing from cart:', err);
        req.flash('error_msg', 'Failed to remove product from cart.');
        res.redirect('/cart');
    }
});

server.get('/cart', async (req, res) => {
    let cartItems = [];
    let subtotal = 0;

    if (req.session.userId) {
        const user = await User.findById(req.session.userId).populate('cart.product');
        cartItems = user.cart.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: parseFloat(item.product.discountedPrice.replace('Rs.', '').replace(',', '')),
            imageUrl: item.product.imageUrl,
            quantity: item.quantity
        }));
    } else {
        cartItems = Object.values(req.session.cart || {});
    }

    cartItems.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    res.render('cart', { cartItems, subtotal });
});

// --- Checkout & Order Routes ---

server.get('/checkout', async (req, res) => {
    let cartItems = [];
    if (req.session.userId) {
        const user = await User.findById(req.session.userId).populate('cart.product');
        cartItems = user.cart.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: parseFloat(item.product.discountedPrice.replace('Rs.', '').replace(',', '')),
            imageUrl: item.product.imageUrl,
            quantity: item.quantity
        }));
    } else {
        cartItems = Object.values(req.session.cart || {});
    }
    if (cartItems.length === 0) {
        req.flash('error_msg', 'Your cart is empty. Please add items before checking out.');
        return res.redirect('/cart');
    }
    let total = 0;
    cartItems.forEach(item => {
        total += item.price * item.quantity;
    });
    res.render('checkout', { cartItems: cartItems, total: total });
});

server.post('/order/place', isAuthenticated, async (req, res) => {
    if (!req.session.userId) {
        req.flash('error_msg', 'You must be logged in to place an order.');
        return res.redirect('/login');
    }

    const { name, phone, address } = req.body;
    let cartItems = [];
    if (req.session.userId) {
        const user = await User.findById(req.session.userId).populate('cart.product');
        cartItems = user.cart.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: parseFloat(item.product.discountedPrice.replace('Rs.', '').replace(',', '')),
            imageUrl: item.product.imageUrl,
            quantity: item.quantity
        }));
    } else {
        const cart = req.session.cart || {};
        cartItems = Object.values(cart);
    }

    if (cartItems.length === 0) {
        req.flash('error_msg', 'Your cart is empty. Cannot place an order.');
        return res.redirect('/cart');
    }

    if (!name || !phone || !address) {
        req.flash('error_msg', 'Please fill in all user details: Full Name, Phone Number, and Delivery Address.');
        return res.redirect('/checkout');
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
        const product = await Product.findById(cartItem.id);
        if (!product || product.quantity < cartItem.quantity) {
            req.flash('error_msg', `Insufficient stock for ${cartItem.name}. Please adjust quantity.`);
            return res.redirect('/cart');
        }
        product.quantity -= cartItem.quantity;
        await product.save();
        const itemTotal = cartItem.price * cartItem.quantity;
        totalAmount += itemTotal;
        orderItems.push({
            productId: cartItem.id,
            name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.quantity,
            total: itemTotal,
            imageUrl: cartItem.imageUrl
        });
    }

    try {
        const newOrder = new Order({
            userId: req.session.userId,
            customerDetails: {
                name: name,
                phone: phone,
                address: address
            },
            items: orderItems,
            totalAmount: totalAmount,
            status: 'Pending (Cash on Delivery)'
        });
        await newOrder.save();
        if (req.session.userId) {
            const user = await User.findById(req.session.userId);
            user.cart = [];
            await user.save();
        }
        req.session.cart = {};
        req.flash('success_msg', 'Your order has been placed successfully! We will contact you soon for confirmation.');
        res.redirect('/my-orders');
    } catch (err) {
        console.error('Error placing order:', err);
        req.flash('error_msg', 'Failed to place your order. Please try again.');
        res.redirect('/checkout');
    }
});

server.get('/my-orders', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 }).populate('userId', 'username'); 
        res.render('my-orders', { orders });
    } catch (err) {
        console.error('Error fetching user orders:', err);
        req.flash('error_msg', 'Could not fetch your orders. Please try again.');
        res.redirect('/dashboard');
    }
});


// --- ADMIN ROUTES ---

server.get('/admin/products', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('admin/products', { products, layout: 'admin_layout' });
    } catch (err) {
        console.error('Error fetching products for admin:', err);
        req.flash('error_msg', 'Could not load products for admin panel.');
        res.redirect('/homepage');
    }
});

server.get('/admin/products/add', isAuthenticated, isAdmin, (req, res) => {
    res.render('admin/add-product', { layout: 'admin_layout' });
});

server.post('/admin/products/add', isAuthenticated, isAdmin, async (req, res) => {
    const { name, imageUrl, originalPrice, discountedPrice, status, colors, quantity } = req.body;

    if (!name || !imageUrl || !discountedPrice || quantity === undefined || isNaN(quantity) || parseInt(quantity, 10) < 0) {
        req.flash('error_msg', 'Please fill in all required product fields, including a valid non-negative quantity.');
        return res.redirect('/admin/products/add');
    }

    try {
        const newProduct = new Product({
            name,
            imageUrl,
            originalPrice: originalPrice || undefined,
            discountedPrice,
            status: status || undefined,
            colors: colors ? colors.split(',').map(c => c.trim()) : [],
            quantity: parseInt(quantity, 10)
        });
        await newProduct.save();
        req.flash('success_msg', 'Product added successfully!');
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error adding product:', err);
        req.flash('error_msg', 'Failed to add product. Please try again.');
        res.redirect('/admin/products/add');
    }
});

server.get('/admin/products/edit/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error_msg', 'Product not found for editing.');
            return res.redirect('/admin/products');
        }
        res.render('admin/edit-product', { product, layout: 'admin_layout' });
    } catch (err) {
        console.error('Error fetching product for edit:', err);
        req.flash('error_msg', 'Could not load product for editing.');
        res.redirect('/admin/products');
    }
});

server.post('/admin/products/edit/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { name, imageUrl, originalPrice, discountedPrice, status, colors, quantity } = req.body;

    if (!name || !imageUrl || !discountedPrice || quantity === undefined || isNaN(quantity) || parseInt(quantity, 10) < 0) {
        req.flash('error_msg', 'Please fill in all required product fields, including a valid non-negative quantity.');
        return res.redirect(`/admin/products/edit/${req.params.id}`);
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            name,
            imageUrl,
            originalPrice: originalPrice || undefined,
            discountedPrice,
            status: status || undefined,
            colors: colors ? colors.split(',').map(c => c.trim()) : [],
            quantity: parseInt(quantity, 10)
        }, { new: true, runValidators: true });

        if (!updatedProduct) {
            req.flash('error_msg', 'Product not found for updating.');
            return res.redirect('/admin/products');
        }
        req.flash('success_msg', 'Product updated successfully!');
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error updating product:', err);
        req.flash('error_msg', 'Failed to update product. Please try again.');
        res.redirect(`/admin/products/edit/${req.params.id}`);
    }
});

server.post('/admin/products/delete/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            req.flash('error_msg', 'Product not found for deletion.');
        } else {
            req.flash('success_msg', 'Product deleted successfully!');
        }
        res.redirect('/admin/products');
    } catch (err) {
        console.error('Error deleting product:', err);
        req.flash('error_msg', 'Failed to delete product. Please try again.');
        res.redirect('/admin/products');
    }
});

server.get('/admin/orders', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).populate('userId', 'username'); 
        res.render('admin/orders', { orders, layout: 'admin_layout' });
    } catch (err) {
        console.error('Error fetching all orders for admin:', err);
        req.flash('error_msg', 'Could not load all orders for admin panel.');
        res.redirect('/homepage');
    }
});

server.post('/admin/orders/update-status/:id', isAuthenticated, isAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!updatedOrder) {
            req.flash('error_msg', 'Order not found for status update.');
        } else {
            req.flash('success_msg', `Order #${updatedOrder._id.toString().substring(0, 8)} status updated to ${updatedOrder.status}.`);
        }
        res.redirect('/admin/orders');
    } catch (err) {
        console.error('Error updating order status:', err);
        req.flash('error_msg', 'Failed to update order status. Please try again.');
        res.redirect('/admin/orders');
    }
});


// --- Existing Routes ---
server.get('/cv', (req, res) => {
    res.render('cv', { layout: false });
});

server.get('/Assignment_1/index.html', (req, res) => {
    res.render('cv', { layout: false });
});

// --- Complaint Routes ---
server.get('/complaints/contact', isAuthenticated, (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    user: req.user
  });
});

server.post('/complaints/submit', isAuthenticated, async (req, res) => {
  try {
    const { orderId, message } = req.body;
    
    const complaint = new Complaint({
      user: req.session.userId,
      orderId,
      message
    });

    await complaint.save();
    req.flash('success_msg', 'Your complaint has been submitted successfully.');
    res.redirect('/complaints/my-complaints');
  } catch (error) {
    req.flash('error_msg', 'Error submitting complaint. Please try again.');
    res.redirect('/complaints/contact');
  }
});

server.get('/complaints/my-complaints', isAuthenticated, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.session.userId })
      .sort({ createdAt: -1 });
    
    res.render('my-complaints', {
      title: 'My Complaints',
      user: req.user,
      complaints
    });
  } catch (error) {
    req.flash('error_msg', 'Error fetching complaints.');
    res.redirect('/');
  }
});

server.get('/complaints/admin/all', isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    
    res.render('admin/complaints', {
      title: 'All Complaints',
      user: req.user,
      complaints
    });
  } catch (error) {
    req.flash('error_msg', 'Error fetching complaints.');
    res.redirect('/');
  }
});

server.post('/complaints/admin/update-status/:id', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { status });
    req.flash('success_msg', 'Complaint status updated successfully.');
    res.redirect('/complaints/admin/all');
  } catch (error) {
    req.flash('error_msg', 'Error updating complaint status.');
    res.redirect('/complaints/admin/all');
  }
});

// --- Database Connection & Server Start ---

mongoose.connect("mongodb://localhost:27017/bsai")
    .then(() => {
        console.log("Connected to MongoDB database 'bsai'");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

server.listen(3000, () => {
    console.log("Server is running at port 3000 ");
});
