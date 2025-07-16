import { fastify } from "fastify";
import { userClient } from "./clients/userClient.js";
import { carClient } from "./clients/carClient.js";
import { orderClient } from "./clients/orderClient.js";

const app = fastify()

app.post("/users", (request, _) => {
  const { name, email, password } = request.body

  return new Promise ((resolve, reject) => {
    userClient.CreateUser({ name, email, password }, (error, response) => {
      if (error) {
        reject(error)
        return
      }
      resolve(response)
    })
  })
})

app.get("/cars", async (request, reply) => {
  return new Promise((resolve, reject) => {
    carClient.ListCars({}, (err, response) => {
      if (err) {
        reply.code(500).send(err);
        return reject(err);
      }
      resolve(response.cars);
    });
  });
});

app.get("/cars-sold", async(request, reply) => {
  const { userId } = request.body

  return new Promise((resolve, reject) => {
    carClient.CarsSold({ userId }, (err, response) => {
      if (err) {
        reply.code(500).send(err)
        return reject(err)
      } 
      resolve(response.cars)
    })
  })
})

app.get("/cars-bought", async(request, reply) => {
  const { userId } = request.body

  return new Promise((resolve, reject) => {
    carClient.CarsBought({ userId }, (err, response) => {
      if (err) {
        reply.code(500).send(err)
        return reject(err)
      } 
      resolve(response.cars)
    })
  })
})

app.post("/cars", (request, _) => {
  const { name, mileage, price, ownerId } = request.body

  return new Promise ((resolve, reject) => {
    carClient.CreateCar({ name, mileage, price, ownerId }, (error, response) => {
      if (error) {
        reject(error)
        return
      }
      resolve(response)
    })
  })
})

app.post('/order', (request, _) => {
  const { carId, buyerId, sellerId } = request.body

  return new Promise((resolve, reject) => {
    orderClient.CreateOrder({ carId, buyerId }, (error, response) => {
      if (error) {
        reject(error)
        return
      }
      resolve(response)
    })
  })
})

app.post('/login', (request, _) => {
  const { email, password } = request.body

  return new Promise((resolve, reject) => {
    userClient.LoginUser({ email, password }, (error, response) => {
      if (error) {
        reject(error)
        return 
      }
      resolve(response)
    })
  })
})

app.listen({ port: 8080 }).then(() => {
  console.log("Servidor HTTP")
})