// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';

contract Token is ERC20, Ownable, ERC20Burnable, Pausable, ERC20Permit {
    constructor(address initialOwner) ERC20('Token', 'TKN') Ownable(initialOwner) ERC20Permit('Token') {}

    // Mint tokens to a specified address
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Pause the contract (restrict token transfers)
    function pause() public onlyOwner {
        _pause();
    }

    // Unpause the contract
    function unpause() public onlyOwner {
        _unpause();
    }

    // Hook to ensure token transfers are restricted when paused
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20) {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "ERC20Pausable: token transfer while paused");
    }

    // Add staking functionality
    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;
    uint256 public rewardRate = 100; // Example reward rate per second per token staked

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);

    // Stake tokens
    function stake(uint256 amount) public {
        require(amount > 0, "Cannot stake 0");
        _burn(msg.sender, amount);

        if (stakes[msg.sender].amount > 0) {
            uint256 reward = calculateReward(msg.sender);
            stakes[msg.sender].amount += reward; // Automatically compound the reward
        }

        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    // Unstake tokens and claim rewards
    function unstake() public {
        uint256 stakedAmount = stakes[msg.sender].amount;
        require(stakedAmount > 0, "No tokens staked");

        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = stakedAmount + reward;

        stakes[msg.sender].amount = 0;
        stakes[msg.sender].timestamp = 0;

        _mint(msg.sender, totalAmount);

        emit Unstaked(msg.sender, stakedAmount, reward);
    }

    // Calculate rewards for staking
    function calculateReward(address staker) public view returns (uint256) {
        Stake memory stakeData = stakes[staker];
        if (stakeData.amount == 0) {
            return 0;
        }

        uint256 duration = block.timestamp - stakeData.timestamp;
        uint256 reward = (duration * stakeData.amount * rewardRate) / (1 days);

        return reward;
    }

    // Game Room Functionality
    struct GameRoom {
        address creator;
        uint256 entryFee;
        uint256 reward;
        bool isActive;
        mapping(address => bool) participants;
        uint256 participantCount;
    }

    mapping(uint256 => GameRoom) public gameRooms;
    uint256 public gameRoomCounter;

    event GameRoomCreated(uint256 indexed roomId, address indexed creator, uint256 entryFee, uint256 reward);
    event JoinedGameRoom(uint256 indexed roomId, address indexed participant);
    event LeftGameRoom(uint256 indexed roomId, address indexed participant);
    event GameRoomRewardClaimed(uint256 indexed roomId, address indexed participant, uint256 reward);

    // Create a new game room
    function createGameRoom(uint256 entryFee, uint256 reward) public {
        require(entryFee > 0, "Entry fee must be greater than 0");
        require(reward > 0, "Reward must be greater than 0");

        gameRoomCounter++;
        GameRoom storage newRoom = gameRooms[gameRoomCounter];
        newRoom.creator = msg.sender;
        newRoom.entryFee = entryFee;
        newRoom.reward = reward;
        newRoom.isActive = true;

        emit GameRoomCreated(gameRoomCounter, msg.sender, entryFee, reward);
    }

    // Join an existing game room
    function joinGameRoom(uint256 roomId) public {
        GameRoom storage room = gameRooms[roomId];
        require(room.isActive, "Game room is not active");
        require(!room.participants[msg.sender], "Already joined the game room");

        _burn(msg.sender, room.entryFee);
        room.participants[msg.sender] = true;
        room.participantCount++;

        emit JoinedGameRoom(roomId, msg.sender);
    }

    // Leave an existing game room
    function leaveGameRoom(uint256 roomId) public {
        GameRoom storage room = gameRooms[roomId];
        require(room.isActive, "Game room is not active");
        require(room.participants[msg.sender], "Not a participant of the game room");

        room.participants[msg.sender] = false;
        room.participantCount--;

        emit LeftGameRoom(roomId, msg.sender);
    }

    // Claim reward from a game room
    function claimGameRoomReward(uint256 roomId) public {
        GameRoom storage room = gameRooms[roomId];
        require(room.isActive, "Game room is not active");
        require(room.participants[msg.sender], "Not a participant of the game room");
        require(room.participantCount > 0, "No participants in the game room");

        uint256 reward = room.reward / room.participantCount;
        room.reward -= reward;
        room.participants[msg.sender] = false;
        room.participantCount--;

        _mint(msg.sender, reward);

        if (room.participantCount == 0) {
            room.isActive = false;
        }

        emit GameRoomRewardClaimed(roomId, msg.sender, reward);
    }
}
