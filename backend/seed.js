import dotenv from "dotenv";
import sequelize from "./config/database.js";
import Car from "./models/Car.js";

dotenv.config();

const cars = [
  {
    id: 1,
    name: "BMW 5 Series",
    description:
      "A powerful executive saloon with a refined interior, cutting-edge tech, and an exhilarating drive that commands every road.",
    miles: "12,400 miles",
    fuelType: "Petrol",
    transmission: "Automatic",
    price: 34500,
    badge: "Featured",
    year: 2022,
    image: "/images/bmw1.jpg",
    engine: "2.0L TwinPower Turbo",
    power: "248 HP",
    color: "Sophisto Grey",
    drive: "xDrive AWD",
  },

  {
    id: 2,
    name: "Tesla Model 3",
    description:
      "Sleek and futuristic all-electric sedan with blistering acceleration, over-the-air updates, and an impressive range per charge.",
    miles: "8,200 miles",
    fuelType: "Electric",
    transmission: "Automatic",
    price: 41999,
    badge: "Hot Deal",
    year: 2023,
    image: "/images/tesla1.jpg",
    engine: "Dual Motor (Electric)",
    power: "346 HP",
    color: "Pearl White",
    drive: "AWD",
  },

  {
    id: 3,
    name: "Toyota Camry",
    description:
      "A dependable mid-size sedan renowned for its comfort, reliability, and smooth ride that makes every journey effortless.",
    miles: "21,000 miles",
    fuelType: "Petrol",
    transmission: "Automatic",
    price: 22500,
    badge: null,
    year: 2021,
    image: "/images/camry1.jpg",
    engine: "2.5L 4-Cylinder Hybrid",
    power: "203 HP",
    color: "Celestial Silver",
    drive: "FWD",
  },

  {
    id: 4,
    name: "Honda Civic",
    description:
      "A sporty and fuel-efficient compact car packed with modern safety features, a responsive engine, and a stylish cabin.",
    miles: "18,750 miles",
    fuelType: "Petrol",
    transmission: "Manual",
    price: 19800,
    badge: "Best Value",
    year: 2021,
    image: "/images/Honda1.jpg",
    engine: "1.5L Turbocharged I4",
    power: "180 HP",
    color: "Rallye Red",
    drive: "FWD",
  },

  {
    id: 5,
    name: "Mercedes-Benz C-Class",
    description:
      "Luxury German engineering at its finest — with a stunning cabin, plush ride quality, and an effortlessly powerful drivetrain.",
    miles: "9,600 miles",
    fuelType: "Petrol",
    transmission: "Automatic",
    price: 47000,
    badge: "Premium",
    year: 2023,
    image: "/images/benz1.jpg",
    engine: "2.0L Turbo Mild-Hybrid",
    power: "255 HP",
    color: "Obsidian Black",
    drive: "RWD",
  },

  {
    id: 6,
    name: "Hyundai Ioniq 5",
    description:
      "A bold and ultra-modern electric crossover with a retro-futurist design, ultra-fast charging, and a spacious lounge-like interior.",
    miles: "5,300 miles",
    fuelType: "Electric",
    transmission: "Automatic",
    price: 38500,
    badge: "New Arrival",
    year: 2024,
    image: "/images/hyundai1.jpg",
    engine: "168 kW Electric Motor",
    power: "225 HP",
    color: "Cyber Grey",
    drive: "RWD",
  },
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();

    console.log("Database connected.");

    await sequelize.sync();

    console.log("Database synchronized.");

    /*
      Clear existing cars before seeding.

      This prevents duplicate cars if you accidentally
      run the seed script more than once.
    */
    await Car.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    await Car.bulkCreate(cars);

    console.log(`${cars.length} cars inserted successfully.`);

    await sequelize.close();

    console.log("Database connection closed.");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);

    process.exit(1);
  }
}

seedDatabase();