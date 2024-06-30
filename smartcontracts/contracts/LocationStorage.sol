// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LocationStorage {
    struct UserLocation {
        string location; // This could be a string representing coordinates or an address
    }

    mapping(address => UserLocation) private userLocations;

    // Function to set the location for a user
    function setLocation(string memory _location) public {
        userLocations[msg.sender] = UserLocation(_location);
    }

    // Function to get the location for a user
    function getLocation(address _user) public view returns (string memory) {
        return userLocations[_user].location;
    }


    struct UserActivity {
        uint256 totalDistance; // Total distance walked in meters
        uint256 totalRewards;  // Total rewards earned in B3TR tokens
    }

    mapping(address => UserActivity) public userActivities;

    uint256 public totalTokens; // Total tokens available for rewards
    uint256 public rewardRate;  // Reward rate in B3TR tokens per meter

    // Event to log the location update
    event LocationUpdated(address indexed user, string location, uint256 distance, uint256 reward);

    // Constructor to set the initial token supply and reward rate
    constructor(uint256 _initialSupply, uint256 _rewardRate) {
        totalTokens = _initialSupply;
        rewardRate = _rewardRate;
    }

    // Function to update the location and calculate rewards
    function updateLocation(string memory _location, uint256 _distance) public {
        // Calculate the reward based on the distance walked
        uint256 reward = _distance * rewardRate;

        // Check if there are enough tokens available
        require(totalTokens >= reward, "Not enough tokens available for rewards");

        // Update user location history
        // userLocations[msg.sender].push(UserLocation({
        //     timestamp: block.timestamp,
        //     location: _location
        // }));

        // Update user activity
        userActivities[msg.sender].totalDistance += _distance;
        userActivities[msg.sender].totalRewards += reward;

        // Decrease the total tokens
        totalTokens -= reward;

        // Emit the location updated event
        emit LocationUpdated(msg.sender, _location, _distance, reward);
    }

    // Function to get the location history of a user
    

    // Function to redeem rewards (for illustration purposes, actual implementation may vary)
    function redeemRewards() public {
        uint256 amount = userActivities[msg.sender].totalRewards;
        require(amount > 0, "No rewards to redeem");

        // Reset the user's rewards balance
        userActivities[msg.sender].totalRewards = 0;

        // Implement token transfer logic here
        // Example: token.transfer(msg.sender, amount);
    }
}
