# Backend Implementation Plan for Ranga Frontend

## Status: In Progress

1. ✅ Create TODO.md
2. ✅ Update src/models/User.js (add fullName, phoneNumber, location, gender; migrate name/phone)
3. ✅ Read & update src/models/Listing.js (ensure ad fields: title,description,price,category,subcategory,mediaUrl,mediaType,sellerId,location,phone,whatsapp)
4. Update src/controllers/authController.js (include full user fields in login/register/profile responses)
4. Update src/controllers/authController.js (include full user fields in login/register/profile responses)
5. Read src/middleware/auth.js, ensure JWT verify works with req.user.id/role
6. Implement src/controllers/listingController.js (CRUD: create/update/get all/my listings/delete, multer upload)
7. Update src/routes/listings.js (multer middleware, auth guards)
8. Implement minimal other controllers/routes: admin (users/ads stats), categories (seed?), shops/products/orders/notifications
9. Create .env.example (DB_URL, JWT_SECRET)
10. Update src/seed.js (sample users, ads matching frontend)
11. Test: npm run db-sync && npm run seed && npm run dev
12. Update TODO.md ✅ Complete
13. attempt_completion

