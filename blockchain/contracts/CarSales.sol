// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarSales {
    event CarSold(string carId, string sellerId, string buyerId, uint timestamp);

    function registerSale(string memory carId, string memory sellerId, string memory buyerId) public {
        emit CarSold(carId, sellerId, buyerId, block.timestamp);
    }
}