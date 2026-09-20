import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Car from "../models/Car.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

/*
  GET ALL CARS
  GET /api/cars
*/
router.get("/", async (req, res) => {
  try {
    const cars = await Car.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);

    res.status(500).json({
      message: "Failed to fetch cars",
      error: error.message,
    });
  }
});


/*
  GET ONE CAR
  GET /api/cars/:id
*/
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("Error fetching car:", error);

    res.status(500).json({
      message: "Failed to fetch car",
      error: error.message,
    });
  }
});


/*
  ADD CAR
  POST /api/cars
*/
router.post("/", upload.array("imageFiles", 10), async (req, res) => {
  try {
    console.log("Received car data:", req.body);
    let imageUrl = req.body.image || null;
    let gallery = [];
    
    if (req.files && req.files.length > 0) {
      gallery = req.files.map(file => `/uploads/${file.filename}`);
      imageUrl = gallery[0];
    }

    const car = await Car.create({
      name: req.body.name,
      description: req.body.description,
      miles: req.body.miles,
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      price: Number(req.body.price),
      badge: req.body.badge || null,
      year: Number(req.body.year),
      image: imageUrl,
      gallery: gallery,
      engine: req.body.engine || null,
      power: req.body.power || null,
      color: req.body.color || null,
      drive: req.body.drive || null,
    });

    res.status(201).json({
      message: "Car added successfully",
      car,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("VALIDATION ERRORS:", error.errors);

    res.status(500).json({
      message: "Failed to add car",
      error: error.message,
      details: error.errors?.map((err) => ({
        field: err.path,
        message: err.message,
        value: err.value,
      })),
    });
  }
});


/*
  UPDATE CAR
  PUT /api/cars/:id
*/
router.put("/:id", upload.array("imageFiles", 10), async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    let imageUrl = req.body.image || car.image;
    let gallery = car.gallery || [];

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      gallery = [...gallery, ...newImages];
      if (!imageUrl || imageUrl.includes('placehold.co')) {
        imageUrl = gallery[0];
      }
    }

    await car.update({
      name: req.body.name,
      year: Number(req.body.year),
      price: Number(req.body.price),
      miles: req.body.miles || "0 miles",
      fuelType: req.body.fuelType,
      transmission: req.body.transmission,
      badge: req.body.badge || null,
      image: imageUrl,
      gallery: gallery,
      description: req.body.description || "No description provided.",
      engine: req.body.engine || "Standard Engine",
      power: req.body.power || "N/A",
      color: req.body.color || "N/A",
      drive: req.body.drive || "N/A",
    });

    res.status(200).json({
      message: "Car updated successfully",
      car,
    });
  } catch (error) {
    console.error("Error updating car:", error);

    res.status(500).json({
      message: "Failed to update car",
      error: error.message,
    });
  }
});


/*
  DELETE CAR
  DELETE /api/cars/:id
*/
router.delete("/:id", async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
      });
    }

    await car.destroy();

    res.status(200).json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting car:", error);

    res.status(500).json({
      message: "Failed to delete car",
      error: error.message,
    });
  }
});

export default router;