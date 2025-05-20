import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// Styled components
const OfferCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'visible',
  boxShadow: '0 8px 24px rgba(255, 87, 34, 0.3)',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    background: 'linear-gradient(135deg, #FF5722 0%, #FF9800 100%)',
    borderRadius: '20px',
    zIndex: -1,
    opacity: 0.7
  },
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.03)'
  }
}));

const OfferBadge = styled(Chip)({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: '#FF5722',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: '4px 8px'
});

const MenuComponent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/product/get');
        if (response.data.success) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
          // Initialize quantities
          const initialQuantities = {};
          response.data.products.forEach(product => {
            initialQuantities[product.productId] = 1;
          });
          setQuantities(initialQuantities);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    updateCartCount();
  }, []);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  };

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  // Handle quantity changes
  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    const product = products.find(p => p.productId === productId);

    if (isNaN(numValue)) return;
    if (numValue < 1) return;
    if (numValue > (product?.stock || 1)) return;

    setQuantities(prev => ({ ...prev, [productId]: numValue }));
  };

  // Add to cart function
  const addToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/');
      return;
    }

    const quantity = quantities[product.productId] || 1;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingIndex = cart.findIndex(item => item.productId === product.productId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        productImage: product.productImage,
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${quantity} ${product.name} added to cart!`);
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h6">Loading menu...</Typography>
    </Container>
  );

  if (error) return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
      <Typography color="error">Error: {error}</Typography>
    </Container>
  );

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative',   marginTop:'100px' }}>
      {/* Cart Icon */}
      <Box sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: '10px',
        boxShadow: 3,
        cursor: 'pointer',
     
      }}>
        <Link to="/cart" style={{ color: 'inherit' }}>
          <Badge badgeContent={cartCount} color="error">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </Link>
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Our Menu
        </Typography>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          {categories.map(category => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Special Offers Header */}
      {selectedCategory === 'Offers' && (
        <Typography variant="h5" sx={{ mb: 3, color: '#FF5722', fontWeight: 'bold' }}>
          Special Offers
        </Typography>
      )}

      {/* Products Grid */}
      <Grid container spacing={4}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.productId}>
            {product.category === 'Offers' ? (
              <OfferCard>
                <OfferBadge label="OFFER" />
                <CardActionArea component={Link} to={`/products/${product.productId}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:4000/images/${product.productImage}`}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" color="#FF5722">
                        LKR {product.price}
                      </Typography>
                      <Chip label={`${product.stock} in stock`} color={product.stock > 0 ? 'success' : 'error'} />
                    </Box>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ p: 2 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={quantities[product.productId] || 1}
                    onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                    inputProps={{ min: 1, max: product.stock }}
                    sx={{ width: 80, mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    sx={{ backgroundColor: '#FF5722', '&:hover': { backgroundColor: '#E64A19' } }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </OfferCard>
            ) : (
              <Card sx={{ borderRadius: '16px', height: '100%' }}>
                <CardActionArea component={Link} to={`/product/${product.productId}`} sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:4000/images/${product.productImage}`}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">LKR {product.price}</Typography>
                      <Chip label={product.category} color="primary" />
                    </Box>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ p: 2 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={quantities[product.productId] || 1}
                    onChange={(e) => handleQuantityChange(product.productId, e.target.value)}
                    inputProps={{ min: 1, max: product.stock }}
                    sx={{ width: 80, mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    sx={{ backgroundColor: '#FF5722', '&:hover': { backgroundColor: '#E64A19' } }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">No products found</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2, backgroundColor: '#FF5722' }}
            onClick={() => setSelectedCategory('All')}
          >
            View All Products
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default MenuComponent;