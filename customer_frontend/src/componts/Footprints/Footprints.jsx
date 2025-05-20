import "bootstrap/dist/css/bootstrap.min.css";
import './RestaurantFootprints.css';

import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

const Footprints = () => {
  const navigate = useNavigate();
  
  // Animation on scroll effect
  useEffect(() => {
    const achievementItems = document.querySelectorAll('.achievement-circle');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.3 });
    
    achievementItems.forEach(item => {
      observer.observe(item);
    });
    
    return () => {
      achievementItems.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section className="restaurant-achievements py-5">
      <div className="container text-center">
        {/* Restaurant Header */}
        <div className="restaurant-header mb-5">
          <h1 className="restaurant-title">
            Life's Good Kitchen
          </h1>
          <div className="restaurant-subtitle-container">
            <span className="restaurant-subtitle-decoration">•</span>
            <p className="restaurant-subtitle">
              Authentic Flavors, Memorable Experiences & Culinary Excellence
            </p>
            <span className="restaurant-subtitle-decoration">•</span>
          </div>
        </div>
        
        <h6 className="restaurant-tagline">A Culinary Journey of Flavor and Passion</h6>
        <h2 className="restaurant-section-title mb-4">
          Our Kitchen's Story
        </h2>
        
        <div className="row justify-content-center mt-5">
          {/* Experience Circle */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div className="achievement-circle experience-bg">
              <div className="achievement-content">
                <h3 className="achievement-number">6+</h3>
                <p className="achievement-text">Years of Culinary Excellence</p>
              </div>
              <div className="achievement-icon">
                <i className="bi bi-award"></i>
              </div>
            </div>
          </div>
          
          {/* Dishes Circle */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div className="achievement-circle dishes-bg">
              <div className="achievement-content">
                <h3 className="achievement-number">150+</h3>
                <p className="achievement-text">Signature Dishes Created</p>
              </div>
              <div className="achievement-icon">
                <i className="bi bi-book"></i>
              </div>
            </div>
          </div>
          
          {/* Customers Circle */}
          <div className="col-md-4 col-sm-6 mb-4">
            <div className="achievement-circle customers-bg">
              <div className="achievement-content">
                <h3 className="achievement-number">25K+</h3>
                <p className="achievement-text">Happy Customers Served</p>
              </div>
              <div className="achievement-icon">
                <i className="bi bi-people"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Items Section */}
        <div className="featured-items-section mt-5 mb-4">
          <div className="featured-items-header">
            <span className="featured-items-line"></span>
            <h3 className="featured-items-title">Our Specialties</h3>
            <span className="featured-items-line"></span>
          </div>
          
          <div className="row mt-4">
            <div className="col-md-4 mb-4">
              <div className="featured-item">
                <div className="featured-item-icon">🍲</div>
                <h4 className="featured-item-title">Chef's Signature</h4>
                <p className="featured-item-description">
                  Seasonal ingredients prepared with culinary artistry
                </p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="featured-item">
                <div className="featured-item-icon">🥗</div>
                <h4 className="featured-item-title">Farm to Table</h4>
                <p className="featured-item-description">
                  Fresh local produce in every delicious dish
                </p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="featured-item">
                <div className="featured-item-icon">🍷</div>
                <h4 className="featured-item-title">Fine Wine Selection</h4>
                <p className="featured-item-description">
                  Curated wines to complement your meal perfectly
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reservation Button */}
        <div className="mt-4 mb-5">
          <button
            className="reservation-button"
            onClick={() => navigate("/reservations")}
          >
            <span className="reservation-button-icon">🍽️</span> 
            Reserve Your Table
          </button>
        </div>
        
        {/* Testimonial */}
        <div className="testimonial-container">
          <div className="testimonial-quote-mark">"</div>
          <p className="testimonial-text">
            Every dish tells a story of passion and tradition. 
            We welcome you to experience the extraordinary flavors of life.
          </p>
          <p className="testimonial-author">
            - Chef Maria, Life's Good Kitchen
          </p>
          <div className="testimonial-quote-mark closing-mark">"</div>
        </div>
      </div>
    </section>
  );
};

export default Footprints;