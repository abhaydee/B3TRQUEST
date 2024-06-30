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
}
