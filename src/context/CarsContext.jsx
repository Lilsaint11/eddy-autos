// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { cars as initialCars } from '../data/cars';

// const CarsContext = createContext();

// export const CarsProvider = ({ children }) => {
//   const [cars, setCars] = useState([]);

//   useEffect(() => {
//     // Load from localStorage or default to initialCars
//     const savedCars = localStorage.getItem('eddy_autos_cars');
//     if (savedCars) {
//       try {
//         setCars(JSON.parse(savedCars));
//       } catch (e) {
//         console.error('Error parsing saved cars, resetting to default:', e);
//         setCars(initialCars);
//       }
//     } else {
//       setCars(initialCars);
//       localStorage.setItem('eddy_autos_cars', JSON.stringify(initialCars));
//     }
//   }, []);

//   const addCar = (newCar) => {
//     const updated = [
//       ...cars,
//       {
//         ...newCar,
//         id: cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1,
//         price: Number(newCar.price),
//         year: Number(newCar.year),
//       }
//     ];
//     setCars(updated);
//     localStorage.setItem('eddy_autos_cars', JSON.stringify(updated));
//   };

//   const updateCar = (id, updatedCar) => {
//     const updated = cars.map(car => 
//       car.id === Number(id) 
//         ? { 
//             ...car, 
//             ...updatedCar, 
//             id: Number(id),
//             price: Number(updatedCar.price),
//             year: Number(updatedCar.year),
//           } 
//         : car
//     );
//     setCars(updated);
//     localStorage.setItem('eddy_autos_cars', JSON.stringify(updated));
//   };

//   const deleteCar = (id) => {
//     const updated = cars.filter(car => car.id !== Number(id));
//     setCars(updated);
//     localStorage.setItem('eddy_autos_cars', JSON.stringify(updated));
//   };

//   return (
//     <CarsContext.Provider value={{ cars, addCar, updateCar, deleteCar }}>
//       {children}
//     </CarsContext.Provider>
//   );
// };

// export const useCars = () => {
//   const context = useContext(CarsContext);
//   if (!context) {
//     throw new Error('useCars must be used within a CarsProvider');
//   }
//   return context;
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CarsContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export const CarsProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
    GET ALL CARS
  */
  const fetchCars = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/cars`);

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();

      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
    LOAD CARS WHEN APP STARTS
  */
  useEffect(() => {
    fetchCars();
  }, []);


  /*
    ADD CAR
  */
  const addCar = async (newCar) => {
    try {
      const isFormData = newCar instanceof FormData;
      
      const response = await fetch(`${API_URL}/api/cars`, {
        method: "POST",
        headers: isFormData ? {} : {
          "Content-Type": "application/json",
        },
        body: isFormData ? newCar : JSON.stringify(newCar),
      });

      if (!response.ok) {
        throw new Error("Failed to add car");
      }

      const data = await response.json();

      setCars((prevCars) => [
        data.car,
        ...prevCars,
      ]);

      return data.car;
    } catch (error) {
      console.error("Error adding car:", error);

      throw error;
    }
  };


  /*
    UPDATE CAR
  */
  const updateCar = async (id, updatedCar) => {
    try {
      const isFormData = updatedCar instanceof FormData;

      const response = await fetch(
        `${API_URL}/api/cars/${id}`,
        {
          method: "PUT",
          headers: isFormData ? {} : {
            "Content-Type": "application/json",
          },
          body: isFormData ? updatedCar : JSON.stringify(updatedCar),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update car");
      }

      const data = await response.json();

      setCars((prevCars) =>
        prevCars.map((car) =>
          car.id === Number(id)
            ? data.car
            : car
        )
      );

      return data.car;
    } catch (error) {
      console.error("Error updating car:", error);

      throw error;
    }
  };


  /*
    DELETE CAR
  */
  const deleteCar = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/cars/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      setCars((prevCars) =>
        prevCars.filter(
          (car) => car.id !== Number(id)
        )
      );
    } catch (error) {
      console.error("Error deleting car:", error);

      throw error;
    }
  };


  return (
    <CarsContext.Provider
      value={{
        cars,
        loading,
        fetchCars,
        addCar,
        updateCar,
        deleteCar,
      }}
    >
      {children}
    </CarsContext.Provider>
  );
};


export const useCars = () => {
  const context = useContext(CarsContext);

  if (!context) {
    throw new Error(
      "useCars must be used within a CarsProvider"
    );
  }

  return context;
};
