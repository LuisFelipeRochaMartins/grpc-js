import { db } from '../../prisma.js'
import { ethers } from "ethers";
import { status } from '@grpc/grpc-js';
import carSalesABI from "../../blockchain/artifacts/contracts/CarSales.sol/CarSales.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const carSalesContract = new ethers.Contract(contractAddress, carSalesABI.abi, wallet);

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
          sellerId: car.ownerId
        }
      });

      await carSalesContract.registerSale(carId, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x976EA74026E726554dB657fA54763abd0C3a0aa9")

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