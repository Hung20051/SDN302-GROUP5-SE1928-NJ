require("dotenv").config({ path: ".env" });
console.log(process.env.MONGODB_URI);
const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const User = require("../models/User");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");
};

const listings = [
  {
    title: "Apple iPhone 13 128GB Unlocked",
    subtitle: "Excellent - 90%+ Battery",
    description:
      "Apple iPhone 13 128GB Unlocked in excellent condition with 90%+ battery health.",
    condition: "like_new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 8323071 },
    totalQuantity: 5,
    status: "active",
    isFeatured: true,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Dyson UP30 Ball Animal 3 | Nickel/Silver | Refurbished",
    subtitle: "Certified Refurbished",
    description:
      "Dyson UP30 Ball Animal 3 vacuum cleaner in nickel/silver. Certified refurbished.",
    condition: "good",
    images: [],
    pricing: { currency: "VND", fixedPrice: 5531767 },
    totalQuantity: 3,
    status: "active",
    isFeatured: false,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Ego Turbo Leaf Blower 530 Bare Tool Certified Refurbished",
    subtitle: "Bare Tool Only",
    description:
      "Ego Turbo Leaf Blower 530 CFM bare tool. No battery or charger included.",
    condition: "good",
    images: [],
    pricing: { currency: "VND", fixedPrice: 2871387 },
    totalQuantity: 8,
    status: "active",
    isFeatured: false,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "DESIGN by Paul Sebastian Perfume for Women 3.4 oz",
    subtitle: "New in Box",
    description:
      "DESIGN by Paul Sebastian Perfume for Women 3.4 oz New in Box.",
    condition: "new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 618270 },
    totalQuantity: 10,
    status: "active",
    isFeatured: false,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "iRobot Roomba Combo i5+ Vacuum & Mop - Self-Emptying",
    subtitle: "Certified Refurbished",
    description:
      "iRobot Roomba Combo i5+ robot vacuum and mop with self-emptying base.",
    condition: "good",
    images: [],
    pricing: { currency: "VND", fixedPrice: 3951187 },
    totalQuantity: 2,
    status: "active",
    isFeatured: true,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Apple iPad 9 (2021) Space Gray Silver",
    subtitle: "Wi-Fi 64GB",
    description: "Apple iPad 9th generation 2021 Space Gray Silver Wi-Fi 64GB.",
    condition: "like_new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 4372675 },
    totalQuantity: 4,
    status: "active",
    isFeatured: false,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    subtitle: "Black - Brand New",
    description: "Sony WH-1000XM5 industry leading noise canceling headphones.",
    condition: "new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 6500000 },
    totalQuantity: 6,
    status: "active",
    isFeatured: true,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Samsung Galaxy S23 Ultra 256GB",
    subtitle: "Phantom Black - Unlocked",
    description:
      "Samsung Galaxy S23 Ultra 256GB Phantom Black factory unlocked.",
    condition: "new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 12000000 },
    totalQuantity: 3,
    status: "active",
    isFeatured: true,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Nike Air Jordan 1 Retro High OG",
    subtitle: "Chicago - Size 42",
    description: "Nike Air Jordan 1 Retro High OG Chicago colorway size 42.",
    condition: "new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 4800000 },
    totalQuantity: 1,
    status: "active",
    isFeatured: false,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "MacBook Pro 14 inch M3 Pro 2023",
    subtitle: "Space Black 18GB RAM 512GB SSD",
    description:
      "Apple MacBook Pro 14 inch with M3 Pro chip, 18GB RAM, 512GB SSD.",
    condition: "new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 45000000 },
    totalQuantity: 2,
    status: "active",
    isFeatured: true,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Lego Technic Bugatti Chiron 42083",
    subtitle: "New Sealed Box",
    description: "Lego Technic Bugatti Chiron set 42083 new and sealed.",
    condition: "new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 3200000 },
    totalQuantity: 7,
    status: "active",
    isFeatured: false,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
  {
    title: "Canon EOS R6 Mark II Mirrorless Camera",
    subtitle: "Body Only",
    description: "Canon EOS R6 Mark II mirrorless camera body only.",
    condition: "new",
    images: [],
    pricing: { currency: "VND", fixedPrice: 52000000 },
    totalQuantity: 1,
    status: "active",
    isFeatured: true,
    stats: { views: 0, watchers: 0, soldQuantity: 0 },
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Lấy seller đầu tiên làm sellerId
    const seller = await User.findOne({ role: "seller" });
    if (!seller) {
      console.log(
        "❌ Không tìm thấy seller, hãy register 1 tài khoản seller trước",
      );
      process.exit(1);
    }

    // Xóa listings cũ
    await Listing.deleteMany({});
    console.log("🗑️ Đã xóa listings cũ");

    // Insert listings mới
    const listingsWithSeller = listings.map((l) => ({
      ...l,
      sellerId: seller._id,
    }));
    await Listing.insertMany(listingsWithSeller);
    console.log(`✅ Đã insert ${listings.length} listings`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

seed();
