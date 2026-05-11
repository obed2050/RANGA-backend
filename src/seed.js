require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User');
const Category = require('./models/Category');
const Listing = require('./models/Listing');

const seed = async () => {
  await sequelize.authenticate();
  console.log('✅ DB connected');

  // ── WIPE EXISTING DATA ─────────────────────────────────
  await Listing.destroy({ where: {} });
  await User.destroy({ where: {} });
  await Category.destroy({ where: {} });
  console.log('🗑️  Old data cleared');

  // ── CATEGORIES ─────────────────────────────────────────
  await Category.bulkCreate([
    { name: 'Services',   slug: 'services',    icon: '💼' },
    { name: 'Products',   slug: 'products',    icon: '📦' },
    { name: 'RealEstate', slug: 'real-estate', icon: '🏠' },
    { name: 'Vehicles',   slug: 'vehicles',    icon: '🚗' },
    { name: 'Electronics',slug: 'electronics', icon: '📱' },
  ]);

  const allCats = await Category.findAll();
  const cats = {};
  allCats.forEach((c) => { cats[c.name] = c.id; });

  // ── ADMIN ──────────────────────────────────────────────
  const adminPass = await bcrypt.hash('Admin@2025', 10);
  await User.create({
    fullName: 'RANGA Admin',
    email: 'admin@ranga.rw',
    password: adminPass,
    role: 'admin',
    phoneNumber: '0780000000',
    whatsappNumber: '250780000000',
    location: 'Kigali, Rwanda',
    gender: 'male',
  });

  // ── SELLERS DATA ───────────────────────────────────────
  const sellerPass = await bcrypt.hash('Seller@123', 10);

  const SELLERS = [
    {
      user: {
        fullName: 'Amina Uwase', email: 'amina@ranga.rw',
        phoneNumber: '0780001111', whatsappNumber: '250780001111',
        location: 'Kigali, Gasabo', gender: 'female',
      },
      listings: [
        { title: 'Mobile Car Wash Service',      description: 'Detailed exterior and interior cleaning with eco-friendly products.',    price: 15000,    currency: 'RWF', category: 'Services',    subcategory: 'Cleaning',    location: 'Kigali, Gasabo',      mediaUrl: '/car1.webp',     whatsapp: '250780001111', phone: '0780001111' },
        { title: 'Toyota Premio 2015',            description: 'Clean Toyota Premio, automatic, low mileage, full service history.',    price: 12000000, currency: 'RWF', category: 'Vehicles',    subcategory: 'Cars',        location: 'Kigali, Gasabo',      mediaUrl: '/car2.webp',     whatsapp: '250780001111', phone: '0780001111' },
        { title: 'iPhone 14 Pro - 256GB',         description: 'Space Black, excellent condition, comes with original box and charger.',price: 750000,   currency: 'RWF', category: 'Electronics', subcategory: 'Phones',      location: 'Kigali, Gasabo',      mediaUrl: '/phone1.webp',   whatsapp: '250780001111', phone: '0780001111' },
        { title: 'Samsung Galaxy S23',            description: '128GB, excellent camera, fast charging, like new.',                    price: 580000,   currency: 'RWF', category: 'Electronics', subcategory: 'Phones',      location: 'Kigali, Gasabo',      mediaUrl: '/phone2.webp',   whatsapp: '250780001111', phone: '0780001111' },
        { title: 'Mobile Phone Repair',           description: 'Screen replacement, battery swap, and software diagnosis.',            price: 8000,     currency: 'RWF', category: 'Services',    subcategory: 'Repair',      location: 'Kigali, Gasabo',      mediaUrl: '/phone3.webp',   whatsapp: '250780001111', phone: '0780001111' },
      ],
    },
    {
      user: {
        fullName: 'Brian Nshimiyimana', email: 'brian@ranga.rw',
        phoneNumber: '0780002222', whatsappNumber: '250780002222',
        location: 'Kigali, Remera', gender: 'male',
      },
      listings: [
        { title: 'Laptop for Sale - HP EliteBook',description: 'Core i7, 16GB RAM, 512GB SSD. Excellent condition, barely used.',      price: 450000,   currency: 'RWF', category: 'Electronics', subcategory: 'Laptops',     location: 'Kigali, Remera',      mediaUrl: '/laptoop1.webp', whatsapp: '250780002222', phone: '0780002222' },
        { title: 'HP Laptop - Core i5',           description: '8GB RAM, 256GB SSD, Windows 11, perfect for students.',               price: 320000,   currency: 'RWF', category: 'Electronics', subcategory: 'Laptops',     location: 'Kigali, Remera',      mediaUrl: '/laptoop2.webp', whatsapp: '250780002222', phone: '0780002222' },
        { title: 'Dell Laptop - Core i7',         description: '16GB RAM, 512GB SSD, dedicated GPU, perfect for design.',             price: 620000,   currency: 'RWF', category: 'Electronics', subcategory: 'Laptops',     location: 'Kigali, Remera',      mediaUrl: '/laptoop3.webp', whatsapp: '250780002222', phone: '0780002222' },
        { title: 'Smart TV 55" - Samsung',        description: '4K UHD Smart TV, WiFi enabled, excellent picture quality.',           price: 380000,   currency: 'RWF', category: 'Electronics', subcategory: 'TVs',         location: 'Kigali, Remera',      mediaUrl: '/tv1.webp',      whatsapp: '250780002222', phone: '0780002222' },
        { title: 'TV - LG 43 inch',               description: 'Full HD, Smart TV, Netflix ready, wall mount included.',              price: 250000,   currency: 'RWF', category: 'Electronics', subcategory: 'TVs',         location: 'Kigali, Remera',      mediaUrl: '/tv2.webp',      whatsapp: '250780002222', phone: '0780002222' },
      ],
    },
    {
      user: {
        fullName: 'Grace Uwimana', email: 'grace@ranga.rw',
        phoneNumber: '0780003333', whatsappNumber: '250780003333',
        location: 'Kigali, Kimihurura', gender: 'female',
      },
      listings: [
        { title: '2-Bedroom Apartment for Rent',  description: 'Modern apartment with parking, security, and backup power.',          price: 300000,   currency: 'RWF', category: 'RealEstate',  subcategory: 'Rent',        location: 'Kigali, Kimihurura',  mediaUrl: '/house1.webp',   whatsapp: '250780003333', phone: '0780003333' },
        { title: 'House for Sale - Kicukiro',     description: '3 bedrooms, 2 bathrooms, modern kitchen, large compound.',           price: 65000000, currency: 'RWF', category: 'RealEstate',  subcategory: 'Sale',        location: 'Kigali, Kicukiro',    mediaUrl: '/house2.webp',   whatsapp: '250780003333', phone: '0780003333' },
        { title: 'Modern House for Rent',         description: '4 bedrooms, fully furnished, generator, borehole water.',            price: 800000,   currency: 'RWF', category: 'RealEstate',  subcategory: 'Rent',        location: 'Kigali, Nyarutarama', mediaUrl: '/house3.webp',   whatsapp: '250780003333', phone: '0780003333' },
        { title: 'Land for Sale - Kigali',        description: '10 decimals, ready title deed, near main road.',                    price: 25000000, currency: 'RWF', category: 'RealEstate',  subcategory: 'Land',        location: 'Kigali, Bumbogo',     mediaUrl: '/land1.webp',    whatsapp: '250780003333', phone: '0780003333' },
        { title: 'Farm Land - Rwamagana',         description: 'Fertile land, 50 decimals, near river, ready for agriculture.',     price: 18000000, currency: 'RWF', category: 'RealEstate',  subcategory: 'Land',        location: 'Rwamagana',           mediaUrl: '/land2.webp',    whatsapp: '250780003333', phone: '0780003333' },
      ],
    },
    {
      user: {
        fullName: 'Hassan Ndayisaba', email: 'hassan@ranga.rw',
        phoneNumber: '0780004444', whatsappNumber: '250780004444',
        location: 'Kigali, Gisozi', gender: 'male',
      },
      listings: [
        { title: 'Motorcycle - Bajaj Boxer',      description: 'Good condition, low fuel consumption, ideal for city rides.',        price: 1800000,  currency: 'RWF', category: 'Vehicles',    subcategory: 'Motorcycles', location: 'Kigali, Gisozi',      mediaUrl: '/moto1.webp',    whatsapp: '250780004444', phone: '0780004444' },
        { title: 'Motorcycle - Honda CG125',      description: 'Well maintained, new tyres, ready to ride.',                        price: 2200000,  currency: 'RWF', category: 'Vehicles',    subcategory: 'Motorcycles', location: 'Kigali, Gisozi',      mediaUrl: '/moto2.webp',    whatsapp: '250780004444', phone: '0780004444' },
        { title: 'Motorcycle - Lifan 150cc',      description: 'Powerful engine, good for long distance, low mileage.',             price: 1500000,  currency: 'RWF', category: 'Vehicles',    subcategory: 'Motorcycles', location: 'Kigali, Gisozi',      mediaUrl: '/moto3.webp',    whatsapp: '250780004444', phone: '0780004444' },
        { title: 'Mountain Bicycle',              description: '21-speed mountain bike, good brakes, suitable for all terrains.',   price: 120000,   currency: 'RWF', category: 'Vehicles',    subcategory: 'Bicycles',    location: 'Musanze',             mediaUrl: '/bycle1.webp',   whatsapp: '250780004444', phone: '0780004444' },
        { title: 'Bicycle - City Cruiser',        description: 'Comfortable city bike, basket included, great for daily commute.',  price: 85000,    currency: 'RWF', category: 'Vehicles',    subcategory: 'Bicycles',    location: 'Kigali, Gisozi',      mediaUrl: '/bycle2.webp',   whatsapp: '250780004444', phone: '0780004444' },
      ],
    },
    {
      user: {
        fullName: 'Diane Mukamana', email: 'diane@ranga.rw',
        phoneNumber: '0780005555', whatsappNumber: '250780005555',
        location: 'Musanze', gender: 'female',
      },
      listings: [
        { title: 'Garden Maintenance Package',    description: 'Weekly lawn care, pruning, and delivery of seasonal plants.',       price: 25000,    currency: 'RWF', category: 'Services',    subcategory: 'Gardening',   location: 'Kigali, Nyarugenge',  mediaUrl: '/land3.webp',    whatsapp: '250780005555', phone: '0780005555' },
        { title: 'Solar Panel Installation',      description: '5KW solar system installation with 2-year warranty and monitoring.',price: 1500000,  currency: 'RWF', category: 'Services',    subcategory: 'Repair',      location: 'Karongi',             mediaUrl: '/land4.webp',    whatsapp: '250780005555', phone: '0780005555' },
        { title: 'Sofa Set - 7 Seater',           description: 'L-shaped sofa set in excellent condition, brown leather finish.',   price: 280000,   currency: 'RWF', category: 'Products',    subcategory: 'Home',        location: 'Musanze',             mediaUrl: '/house4.webp',   whatsapp: '250780005555', phone: '0780005555' },
        { title: 'Handcrafted Leather Bag',       description: 'Premium leather tote with adjustable strap and modern finish.',     price: 35000,    currency: 'RWF', category: 'Products',    subcategory: 'Accessories', location: 'Musanze',             mediaUrl: '/house5.webp',   whatsapp: '250780005555', phone: '0780005555' },
        { title: 'Online Tutoring - Math & Science', description: 'Experienced tutor for high school and university students.',    price: 10000,    currency: 'RWF', category: 'Services',    subcategory: 'Tutoring',    location: 'Nyagatare',           mediaUrl: '/laptoop4.webp', whatsapp: '250780005555', phone: '0780005555' },
      ],
    },
    {
      user: {
        fullName: 'Solange Iradukunda', email: 'solange@ranga.rw',
        phoneNumber: '0780006666', whatsappNumber: '250780006666',
        location: 'Kigali, Kicukiro', gender: 'female',
      },
      listings: [
        { title: 'Blender - Philips 2L',          description: 'Powerful 1000W blender, perfect for smoothies, soups and sauces.',  price: 45000,    currency: 'RWF', category: 'Products',    subcategory: 'Home',        location: 'Kigali, Kicukiro',    mediaUrl: '/blender.webp',  whatsapp: '250780006666', phone: '0780006666' },
        { title: 'Kitchen Appliances Package',    description: 'Blender, toaster and kettle set, all in excellent condition.',      price: 85000,    currency: 'RWF', category: 'Products',    subcategory: 'Home',        location: 'Kigali, Kicukiro',    mediaUrl: '/blender.webp',  whatsapp: '250780006666', phone: '0780006666' },
        { title: 'House Cleaning Service',        description: 'Professional deep cleaning for homes and offices, weekly packages.', price: 20000,    currency: 'RWF', category: 'Services',    subcategory: 'Cleaning',    location: 'Kigali, Kicukiro',    mediaUrl: '/house1.webp',   whatsapp: '250780006666', phone: '0780006666' },
        { title: 'Organic Farm Produce',          description: 'Fresh vegetables and fruits delivered weekly from our farm.',       price: 5000,     currency: 'RWF', category: 'Products',    subcategory: 'Food',        location: 'Rwamagana',           mediaUrl: '/land2.webp',    whatsapp: '250780006666', phone: '0780006666' },
        { title: 'Event Catering Services',       description: 'Full catering for weddings, corporate events and parties.',        price: 200000,   currency: 'RWF', category: 'Services',    subcategory: 'Cleaning',    location: 'Kigali, Kicukiro',    mediaUrl: '/blender.webp',  whatsapp: '250780006666', phone: '0780006666' },
      ],
    },
  ];

  for (const { user: u, listings } of SELLERS) {
    const seller = await User.create({
      fullName: u.fullName,
      email: u.email,
      password: sellerPass,
      role: 'seller',
      phoneNumber: u.phoneNumber,
      whatsappNumber: u.whatsappNumber,
      location: u.location,
      gender: u.gender,
    });

    for (const l of listings) {
      await Listing.create({
        title: l.title,
        description: l.description,
        price: l.price,
        currency: l.currency,
        type: 'sell',
        status: 'active',
        location: l.location,
        subcategory: l.subcategory,
        mediaType: 'image',
        mediaUrl: l.mediaUrl,
        whatsapp: l.whatsapp,
        phone: l.phone,
        categoryId: cats[l.category] || cats['Products'],
        userId: seller.id,
      });
    }
  }

  console.log('\n✅ Seed completed!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 ADMIN');
  console.log('   Email   : admin@ranga.rw');
  console.log('   Password: Admin@2025');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🛒 SELLERS (5) — password: Seller@123');
  SELLERS.forEach(({ user: u }, i) => {
    console.log(`   ${i + 1}. ${u.fullName.padEnd(22)} ${u.email}`);
  });
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 LISTINGS: 6 sellers × 5 listings = 30 listings total');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
};

seed().catch((err) => { console.error('❌ Seed failed:', err.message); process.exit(1); });
