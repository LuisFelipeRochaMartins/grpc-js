import { db } from '../../prisma.js'

export const orderService = {
  CreateOrder: async (call, callback) => {
    const { carId, buyerId } = call.request;
    
    const car = await db.car.findUnique({
      where: {
        id: carId
      }
    })

    try {
      const order = await db.order.create({
        data: { 
          carId,
          buyerId,
          sellerId: car.sellerId
        }
      });

      callback(null, {
        order,
        message: 'Ordem criada com sucesso'
      });
    } catch (err) {
      callback({
        code: status.INTERNAL,
        message: err.message
      });
    }
  },
}