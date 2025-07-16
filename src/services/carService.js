import { db } from '../../prisma.js'

export const carService = {
  GetCar: async(call, callback) => {
    const { carId } = call.request.id;

    const car = await db.car.findUnique({
      where: {
        id: carId
      }
    })
    
    if (car) {
      callback(null, {
        car: car,
        message: 'Carro encontrado com sucesso'
      });
    } else {
      callback({
        code: status.NOT_FOUND,
        message: 'Carro não encontrado'
      });
    }
  },

  CreateCar: async(call, callback) => {
    const { name, mileage, price, ownerId } = call.request;

    if (!name || !mileage || !ownerId || !price) {
      callback({
        code: status.INVALID_ARGUMENT,
        message: 'Nome, Preco e milhas são obrigatórios'
      });
      return;
    }

    let newCar = await db.car.create({
      data: {
        name, 
        mileage,
        ownerId,
        price,
      }
    })

    callback(null, {
      car: newCar,
      message: 'Carro criado com sucesso' 
    });
  },

  ListCars: async(call, callback) => {
    const { userId } = call.request

    const carsAvailableToBuy = await db.car.findMany({
      where: { 
        order: {
          is: null
        },
        NOT: {
          ownerId: userId
        }
      }
    })

    callback(null, {
      cars: carsAvailableToBuy,
      message: 'Carros encontrados com sucesso'
    });
  },

  CarsSold: async(call, callback) => {
    const { userId } = call.request

    try {
      const orders = await db.order.findMany({
        where: {
          sellerId: userId
        },
        include: {
          car: true
        }
      });

      const cars = orders.map(order => order.car);

      callback(null, {
        cars: cars,
        message: 'Carros vendidos encontrados com sucesso.'
      });
    } catch (err) {
      callback({
        code: status.INTERNAL,
        message: 'Erro ao buscar carros vendidos.'
      });
    }
  },

  CarsBought: async (call, callback) => {
    const { userId } = call.request;

    try {
      const orders = await db.order.findMany({
        where: {
          buyerId: userId
        },
        include: {
          car: true
        }
      });

      const cars = orders.map(order => order.car);

      callback(null, {
        cars: cars,
        message: 'Carros comprados encontrados com sucesso.'
      });
    } catch (err) {
      callback({
        code: status.INTERNAL,
        message: 'Erro ao buscar carros comprados.'
      });
    }
  }
};