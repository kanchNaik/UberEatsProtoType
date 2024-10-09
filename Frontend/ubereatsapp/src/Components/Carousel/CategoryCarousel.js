import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import './CategoryCarousel.css';

const categories = [
  { name: "Grocery", icon: '/Assets/Grocery.png' },
  { name: "Pizza", icon: '/Assets/Pizza.png' },
  { name: "Sushi", icon: '/Assets/Sushi.png' },
  { name: "Chinese", icon: '/Assets/Chinese.png' },
  { name: "Thai", icon: '/Assets/Thai.png' },
  { name: "Indian", icon: '/Assets/Indian.png' },
  { name: "Mexican", icon: '/Assets/Mexican.png' },
  { name: "Asian", icon: '/Assets/Asian.png' },
  { name: "Desserts", icon: '/Assets/Dessert.png' },
  { name: "Korean", icon: '/Assets/Korean.png' },
  { name: "Fast Food", icon: '/Assets/FastFood.png' },
  { name: "Soup", icon: '/Assets/Bakery.png' },
  { name: "Italian", icon: '/Assets/Italian.png' }
];

const CategoryCarousel = () => {
  const itemsPerSlide = 8; // Adjust the number of items per slide
  const [activeIndex, setActiveIndex] = useState(0); // Track the current slide index

  // Group the items into slides
  const groupedItems = [];
  for (let i = 0; i < categories.length; i += itemsPerSlide) {

    var start = i;
    var diff = categories.length - i;
    console.log(i)
    if(start != 0){
      start = start - 1
    }
    
    if(diff < itemsPerSlide){
      start = i - diff -1
    }
    console.log(start, diff)
    groupedItems.push(categories.slice(start, start + itemsPerSlide));
  }

  // Handler for moving to the next slide
  const handleNext = () => {
    const nextIndex = activeIndex === groupedItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  // Handler for moving to the previous slide
  const handlePrev = () => {
    const prevIndex = activeIndex === 0 ? groupedItems.length - 1 : activeIndex - 1;
    setActiveIndex(prevIndex);
  };

  return (
    <Carousel
      activeIndex={activeIndex}
      onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
      controls={true}
      indicators={false} // Disable the indicators if not needed
      prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}
      nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}
      nextLabel=""
      prevLabel=""
      interval={null} // Disable automatic sliding
    >
      {groupedItems.map((group, index) => (
        <Carousel.Item key={index}>
          <div className="d-flex justify-content-center align-items-center">
            {group.map((item, idx) => (
              <div className="carousel-item-container" key={idx} style={{ margin: '0 1vw' }}>
                <img
                  className="d-block"
                  src={item.icon}
                  alt={item.name}
                  style={{ width: '4vw', height: 'auto', objectFit: 'contain' }}
                />
                <p style={{ fontSize: '1.5vw' }}>{item.name}</p>
              </div>
            ))}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CategoryCarousel;
