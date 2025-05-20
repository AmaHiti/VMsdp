import "./Footer.css";

import { FaClock, FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaYelp } from "react-icons/fa";

import React from "react";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h1 className="footer-logo">Life's Good Kitchen</h1>
          <p>
            Experience culinary excellence at Life's Good Kitchen. We are passionate about 
            creating memorable dining experiences with fresh ingredients, innovative recipes, 
            and warm hospitality.
          </p>
          <div className="footer-social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://www.yelp.com/" target="_blank" rel="noopener noreferrer">
              <FaYelp className="social-icon" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#reservations">Reservations</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#events">Events</a></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Visit Us</h2>
          <ul>
            <div className="contact">
              <a href="tel:+15551234567" className="contact1">
                <FaPhone className="contact-icon" />
                <div>
                  +1 (555) 123-4567 <br /> 
                  +1 (555) 987-6543
                </div>
              </a>
            </div>
            <div className="contact">
              <a href="mailto:info@lifesgoodkitchen.com" className="contact">
                <FaEnvelope className="contact-icon" />
                info@lifesgoodkitchen.com
              </a>
            </div>
            <div className="contact">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="contact">
                <FaMapMarkerAlt className="contact-icon" />
                123 Delicious Street,<br />Foodville, CA 90210
              </a>
            </div>
            <div className="contact">
              <a href="#hours" className="contact">
                <FaClock className="contact-icon" />
                <div>
                  Mon-Thu: 11am-9pm<br />
                  Fri-Sat: 11am-11pm<br />
                  Sun: 10am-8pm
                </div>
              </a>
            </div>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">© {new Date().getFullYear()} Life's Good Kitchen™. All Rights Reserved.</p>
    </div>
  );
};

export default Footer;