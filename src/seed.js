require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const Shop = require('./models/Shop');
const Product = require('./models/Product');
const Listing = require('./models/Listing');

const seed = async () => {
  await sequelize.authenticate();
  console.log('DB connected');

  await Category.bulkCreate([
    { name: 'Electronics',   slug: 'electronics',  icon: '📱' },
    { name: 'Clothes',       slug: 'clothes',      icon: '👗' },
    { name: 'Shoes',         slug: 'shoes',        icon: '👟' },
    { name: 'Food',          slug: 'food',         icon: '🍎' },
    { name: 'Sports',        slug: 'sports',       icon: '⚽' },
    { name: 'Home & Garden', slug: 'home-garden',  icon: '🏡' },
    { name: 'Toys',          slug: 'toys',         icon: '🧸' },
    { name: 'Books',         slug: 'books',        icon: '📚' },
    { name: 'Real Estate',   slug: 'real-estate',  icon: '🏠' },
    { name: 'Vehicles',      slug: 'vehicles',     icon: '🚗' },
  ], { ignoreDuplicates: true });

  // Admin from frontend AuthContext
  const [gisubizo] = await User.findOrCreate({
    where: { email: 'gisubizo@gmail.com' },
    defaults: {
      fullName: 'Gisubizo Admin',
      password: await bcrypt.hash('629131', 10),
      role: 'admin',
      phoneNumber: '+250700000000',
    },
  });

  const password = await bcrypt.hash('password123', 10);

  const [seller] = await User.findOrCreate({
    where: { email: 'seller@buysellorrent.com' },
    defaults: {
      fullName: 'John Seller',
      password,
      role: 'seller',
      phoneNumber: '+250700000002',
    },
  });

  await User.findOrCreate({
    where: { email: 'buyer@buysellorrent.com' },
    defaults: {
      fullName: 'Jane Buyer',
      password,
      role: 'buyer',
      phoneNumber: '+250700000003',
    },
  });

  const [shop] = await Shop.findOrCreate({
    where: { userId: seller.id },
    defaults: {
      name: "John's Electronics Store",
      description: 'Best electronics in Kigali',
      location: 'Kigali, Rwanda',
      phone: '+250700000002',
    },
  });

  const electronics = await Category.findOne({ where: { slug: 'electronics' } });
  const realEstate  = await Category.findOne({ where: { slug: 'real-estate' } });
  const vehicles    = await Category.findOne({ where: { slug: 'vehicles' } });

  await Product.bulkCreate([
    { name: 'Samsung Galaxy S24', description: '256GB, Black',                  price: 850,  stock: 10, shopId: shop.id, categoryId: electronics.id, images: ['https://picsum.photos/seed/s24/400/400'],      status: 'available' },
    { name: 'iPhone 15 Pro',      description: '128GB, Titanium',               price: 1200, stock: 5,  shopId: shop.id, categoryId: electronics.id, images: ['https://picsum.photos/seed/iphone15/400/400'], status: 'available' },
    { name: 'HP Laptop 15"',      description: 'Intel i5, 16GB RAM, 512GB SSD', price: 700,  stock: 8,  shopId: shop.id, categoryId: electronics.id, images: ['https://picsum.photos/seed/hplaptop/400/400'], status: 'available' },
    { name: 'Sony WH-1000XM5',    description: 'Noise Cancelling Headphones',   price: 350,  stock: 15, shopId: shop.id, categoryId: electronics.id, images: ['https://picsum.photos/seed/sonywh/400/400'],   status: 'available' },
  ], { ignoreDuplicates: true });

  await Listing.bulkCreate([
    { title: '3 Bedroom House in Kigali',      description: 'Beautiful house in Kiyovu',    price: 150000, type: 'sell', location: 'Kiyovu, Kigali',      categoryId: realEstate.id, userId: seller.id },
    { title: 'Apartment for Rent Nyarutarama', description: 'Spacious 2 bedroom apartment', price: 800,    type: 'rent', location: 'Nyarutarama, Kigali', categoryId: realEstate.id, userId: seller.id },
    { title: 'Toyota RAV4 2020',               description: 'Well maintained SUV',          price: 25000,  type: 'sell', location: 'Kigali',              categoryId: vehicles.id,   userId: seller.id },
  ], { ignoreDuplicates: true });

  console.log('\n✅ Seed completed!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin:  gisubizo@gmail.com       / 629131');
  console.log('🛒 Seller: seller@buysellorrent.com / password123');
  console.log('🧑 Buyer:  buyer@buysellorrent.com  / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
