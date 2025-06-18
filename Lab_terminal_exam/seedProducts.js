const mongoose = require('mongoose');
const Product = require('./models/product.model');
const User = require('./models/user.model');
const Order = require('./models/order.model');
const bcrypt = require('bcryptjs');

//MongoDB connection string
const DB_URI = 'mongodb://localhost:27017/bsai';

const productsData = [
    {
        name: 'Men\'s Eddystone Shirt',
        imageUrl: '/images/image1.webp',
        originalPrice: 'Rs.43,500.00',
        discountedPrice: 'Rs.28,100.00',
        status: 'New Lines Added',
        colors: ['#8B4513', '#6B8E23', '#A9A9A9'],
        quantity: 50 // Added quantity
    },
    {
        name: 'Men\'s Cormorant T-Shirt',
        imageUrl: '/images/image2.webp',
        originalPrice: 'Rs.15,100.00',
        discountedPrice: 'Rs.10,300.00',
        status: 'New Lines Added',
        colors: ['#F5F5DC', '#36454F'],
        quantity: 75 // Added quantity
    },
    {
        name: 'Men\'s Tonkin Work Trouser',
        imageUrl: '/images/image3.webp',
        originalPrice: 'Rs.37,500.00',
        discountedPrice: 'Rs.24,200.00',
        status: 'New Lines Added',
        colors: ['#D2B48C', '#000000'],
        quantity: 60 // Added quantity
    },
    {
        name: 'Men\'s Sunup T-Shirt',
        imageUrl: '/images/image4.webp',
        originalPrice: 'Rs.15,100.00',
        discountedPrice: 'Rs.10,300.00',
        status: 'New Lines Added',
        colors: ['#6A0DAD', '#000000'],
        quantity: 90 // Added quantity
    },
    {
        name: '6 Panel Low Profile Cap',
        imageUrl: '/images/image5.webp',
        originalPrice: 'Rs.15,900.00',
        discountedPrice: 'Rs.11,100.00',
        status: 'New Lines Added',
        colors: ['#191970', '#000000'],
        quantity: 120 // Added quantity
    },
    {
        name: 'Men\'s Lapwing Shirt',
        imageUrl: '/images/image6.webp',
        originalPrice: 'Rs.53,900.00',
        discountedPrice: 'Rs.38,400.00',
        status: 'Sale',
        colors: ['#4682B4', '#556B2F', '#8B4513'],
        quantity: 45 // Added quantity
    },
    {
        name: 'Men\'s Rigger Fleece Lined Jacket',
        imageUrl: '/images/image7.webp',
        originalPrice: 'Rs.63,200.00',
        discountedPrice: 'Rs.44,700.00',
        status: 'Sale',
        colors: ['#422003', '#545454'],
        quantity: 30 // Added quantity
    },
    {
        name: 'Men\'s Nimbus Hooded Jacket',
        imageUrl: '/images/image8.webp',
        originalPrice: 'Rs.77,100.00',
        discountedPrice: 'Rs.53,800.00',
        status: 'Sale',
        colors: ['#000000', '#545454'],
        quantity: 25 // Added quantity
    },
    {
        name: 'Men\'s Basset Flannel Lined Jacket',
        imageUrl: '/images/image9.webp',
        originalPrice: 'Rs.53,900.00',
        discountedPrice: 'Rs.38,400.00',
        status: 'Sale',
        colors: ['#556B2F', '#A9A9A9'],
        quantity: 35 // Added quantity
    },
    {
        name: 'Men\'s Stratos Modular Jacket',
        imageUrl: '/images/image10.webp',
        originalPrice: 'Rs.116,900.00',
        discountedPrice: 'Rs.83,100.00',
        status: 'Sale',
        colors: ['#6B8E23', '#000000'],
        quantity: 20 // Added quantity
    },
    {
        name: 'Men\'s Vellus Parka Jacket',
        imageUrl: '/images/image11.webp',
        originalPrice: 'Rs.158,100.00',
        discountedPrice: 'Rs.93,700.00',
        status: 'Sale',
        colors: ['#FF4500', '#000000'],
        quantity: 15 // Added quantity
    },
    {
        name: 'Men\'s Lapwing Shirt',
        imageUrl: '/images/image12.webp',
        originalPrice: 'Rs.53,900.00',
        discountedPrice: 'Rs.35,600.00',
        status: 'Sale',
        colors: ['#4682B4', '#556B2F', '#8B4513'],
        quantity: 40 // Added quantity
    }
];


const adminUserTemplate = {
    username: 'admin',
    password: 'adminpassword123',
    isAdmin: true
};

async function seedProductsAndAdmin() {
    try {
        await mongoose.connect(DB_URI);
        console.log('MongoDB connected for seeding.');

        await Product.deleteMany({});
        console.log('Existing products cleared.');
        await User.deleteMany({});
        console.log('Existing users cleared.');
        await Order.deleteMany({});
        console.log('Existing orders cleared.');


        await Product.insertMany(productsData);
        console.log('Products successfully seeded!');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminUserTemplate.password, salt);
        
        await User.create({
            username: adminUserTemplate.username,
            password: hashedPassword,
            isAdmin: adminUserTemplate.isAdmin
        });
        console.log('Admin user seeded with hashed password!');

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
}

seedProductsAndAdmin();
