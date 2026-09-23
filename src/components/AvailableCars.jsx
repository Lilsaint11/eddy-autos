import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCars } from '../context/CarsContext'
import { MapPin,TruckElectric, Fuel } from 'lucide-react'

const badgeColors = {
  'Featured': 'bg-blue-600',
  'Hot Deal': 'bg-red-600',
  'Best Value': 'bg-green-600',
  'Premium': 'bg-yellow-600',
  'New Arrival': 'bg-purple-600',
}


const FuelIcon = ({ type }) => {
  const isElectric = type === 'Electric';
  const Icon = isElectric ? TruckElectric : Fuel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
        isElectric
          ? ' text-green-400 border-green-500/30'
          : ' text-orange-400 border-orange-500/30'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {isElectric ? 'Electric' : 'Petrol'}
    </span>
  );
};

const GearIcon = ({ type }) => (
  <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
    {type === 'Automatic' ? '⚙ Auto' : '🔧 Manual'}
  </span>
)

const CarCard = ({ car, onViewDetails }) => (
  <div 
    onClick={onViewDetails}
    className="group relative bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/8 hover:border-red-500/50 transition-all duration-500 rounded-md overflow-hidden cursor-pointer shadow-xl hover:shadow-red-900/20 hover:shadow-2xl hover:-translate-y-1"
  >
    {/* Image placeholder with dark gradient panel */}
    <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden flex items-center justify-center rounded-md">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
   
     <img src={car.image} alt="" className='w-full' />
      {car.badge && (
        <span className={`absolute rounded-md font-light top-4 left-4 z-20 ${badgeColors[car.badge]} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1`}>
          {car.badge}
        </span>
      )}
      <span className="absolute rounded-md top-4 right-4 z-20 bg-black/60 backdrop-blur-sm text-gray-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 border border-white/10">
        {car.year}
      </span>
    </div>

    {/* Card Body */}
    <div className="p-5">
      <h3 className="text-white font-black text-xl tracking-tight mb-1 group-hover:text-red-400 transition-colors duration-300">{car.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{car.description}</p>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10 flex items-center gap-1">
          <MapPin className="w-3 text-red-500" /> {car.miles}
        </span>
        <FuelIcon type={car.fuelType} />
        <GearIcon type={car.transmission} />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8 mb-4" />

      {/* Price + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-0.5">Price</p>
          <p className="text-white font-black text-2xl tracking-tight">
            ${car.price.toLocaleString()}
          </p>
        </div>
        <div className="text-white font-light text-[10px] font-black uppercase tracking-widest px-5 py-3 transition-all duration-300 hover:shadow-red-600/30 group-hover:text-red-400">
          View Car
        </div>
      </div>
    </div>
  </div>
)

const AvailableCars = () => {
  const { cars } = useCars()
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('search') || '').trim().toLowerCase()

  const filteredCars = query
    ? cars.filter(car =>
        [car.name, car.description, car.badge, car.fuelType, car.transmission, String(car.year)]
          .filter(Boolean)
          .some(field => String(field).toLowerCase().includes(query))
      )
    : cars

  return (
    <section className="bg-zinc-950 py-30 max-md:py-10 px-6 md:px-12" id="inventory">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-white font-black text-4xl leading-none">
              {query ? (
                <>Results for <span className="text-red-500">"{query}"</span></>
              ) : (
                <>Available <span className="text-red-500">Cars</span></>
              )}
            </h2>
            <Link
              to="/cars"
              className="group inline-flex items-center gap-3 text-white hover:text-red-500 px-8 py-4 font-light tracking-widest text-sm transition-all duration-300 self-start md:self-auto whitespace-nowrap"
            >
              See All Cars
              <span className="group-hover:translate-x-1 transition-transform duration-300 text-base">→</span>
            </Link>
          </div>
        </div>

        {/* Car Grid */}
        {filteredCars.length === 0 ? (
          <p className="text-gray-400 text-center py-20">
            No cars matched your search. Try a different keyword.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCars.map(car => (
              <Link key={car.id} to={`/cars/${car.id}`} className="block">
                <CarCard car={car} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AvailableCars
