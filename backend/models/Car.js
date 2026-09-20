import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Car = sequelize.define(
  "Car",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    miles: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fuelType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    transmission: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    badge: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gallery: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true,
    },

    engine: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    power: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    drive: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "cars",
    timestamps: true,
  }
);

export default Car;