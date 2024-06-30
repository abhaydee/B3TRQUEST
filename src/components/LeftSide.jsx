import React from 'react';

const LeftSide = ({ handleCardClick }) => {
  const cards = [
    { name: 'Dog Patch Studios', imgSrc: 'dog_patch.jpeg' },
    { name: 'Golden State Park', imgSrc: '../golden_park.webp' },
    { name: 'Pier 39 SF', imgSrc: 'pier_39.jpg' },
  ];

  return (
    <div className=" md:w-7/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 w-full cursor-pointer"
          onClick={() => handleCardClick(card.name)}
        >
          <img src={card.imgSrc} alt={card.name} className="w-48 h-48 rounded-md object-cover" />
          <span>{card.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LeftSide;
