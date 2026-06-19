import React, { createContext, useContext, useState, useEffect } from 'react';
import { cars as initialCars } from '../data/cars';

const CarsContext = createContext();

export const CarsProvider = ({ children }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Load from localStorage or default to initialCars
    const savedCars = localStorage.getItem('eddy_autos_cars');
    if (savedCars) {
      try {
        setCars(JSON.parse(savedCars));
      } catch (e) {
        console.error('Error parsing saved cars, resetting to default:', e);
        setCars(initialCars);
      }
    } else {
      setCars(initialCars);
      localStorage.setItem('eddy_autos_cars', JSON.stringify(initialCars));
    }
  }, []);

  const addCar = (newCar) => {
    const updated = [
      ...cars,
      {
        ...newCar,
        id: cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1,
        price: Number(newCar.price),
        year: Number(newCar.year),
      }
    ];
    setCars(updated);
    localStorage.setItem('eddy_autos_cars', JSON.stringify(updated));
  };

  const updateCar = (id, updatedCar) => {
    const updated = cars.map(car => 
      car.id === Number(id) 
        ? { 
            ...car, 
            ...updatedCar, 
            id: Number(id),
            price: Number(updatedCar.price),
            year: Number(updatedCar.year),
          } 
        : car
    );
    setCars(updated);
    localStorage.setItem('eddy_autos_cars', JSON.stringify(updated));
  };

  const deleteCar = (id) => {
    const updated = cars.filter(car => car.id !== Number(id));
    setCars(updated);
    localStorage.setItem('eddy_autos_cars', JSON.stringify(updated));
  };

  return (
    <CarsContext.Provider value={{ cars, addCar, updateCar, deleteCar }}>
      {children}
    </CarsContext.Provider>
  );
};

export const useCars = () => {
  const context = useContext(CarsContext);
  if (!context) {
    throw new Error('useCars must be used within a CarsProvider');
  }
  return context;
};
