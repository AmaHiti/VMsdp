import './Header.css';

import React, { useEffect, useState } from 'react';

import { Container } from 'react-bootstrap';
import { assest } from '../../assest/assest';

function Header() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Restaurant-themed carousel content
  const slides = [
    {
      id: 1,
      imageUrl: assest.z, // Replace with food image
      title: 'Welcome to Signature Cuisine',
      subtitle: 'A Taste of Excellence in Every Bite',
      buttonText: 'Explore Menu'
    },
    {
      id: 2,
      imageUrl: assest.zz, // Replace with restaurant interior or dish
      title: 'Fresh Ingredients Daily',
      subtitle: 'Crafted with Love & Passion',
      buttonText: 'Our Story'
    },
    {
      id: 3,
      imageUrl: assest.zzz, // Replace with a chef or dining photo
      title: 'Reserve Your Table Today',
      subtitle: 'Fine Dining Redefined',
      buttonText: 'Book Now'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== activeSlide) {
      setIsAnimating(true);
      setActiveSlide(index);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <Container id='home' fluid className="p-0 header-container">
      <div className="custom-carousel">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
          >
            <div className="slide-image-container">
              <img
                className="slide-image"
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
              />
              <div className="slide-overlay"></div>
            </div>

            <div className="slide-content">
              <div className="logo-container">
                <img src={assest.icon} alt="Logo" className="header-logo" />
              </div>

              <div className="text-content">
                <h1 className="slide-title">{slide.title}</h1>
                <div className="divider">
                  <span className="divider-icon">🍽️</span>
                </div>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button className="cta-button">{slide.buttonText}</button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation controls */}
        <div className="carousel-controls">
          <button className="carousel-control prev" onClick={prevSlide}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button 
                key={index} 
                className={`indicator ${index === activeSlide ? 'active' : ''}`} 
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          <button className="carousel-control next" onClick={nextSlide}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-text">Scroll Down</div>
          <div className="scroll-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Header;
