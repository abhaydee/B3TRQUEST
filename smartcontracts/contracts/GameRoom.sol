// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameRoom {
    event RoomCreated(address indexed creator, uint256 roomId);

    uint256 public roomCount = 0;

    struct Room {
        uint256 id;
        address creator;
    }

    mapping(uint256 => Room) public rooms;

    function createRoom() public {
        roomCount++;
        rooms[roomCount] = Room(roomCount, msg.sender);
        emit RoomCreated(msg.sender, roomCount);
    }
}