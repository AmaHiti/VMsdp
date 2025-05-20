import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product/get/${productId}`);
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (value) => {
    const numValue = parseInt(value);
    
    if (value === '') {
      setQuantity('');
      setQuantityError('');
      return;
    }

    if (isNaN(numValue)) {
      setQuantity(1);
      setQuantityError('Must be a number');
      return;
    }

    if (numValue < 1) {
      setQuantity(1);
      setQuantityError('Minimum 1');
      return;
    }

    if (product && numValue > product.stock) {
      setQuantity(product.stock);
      setQuantityError(`Max ${product.stock}`);
      return;
    }

    setQuantity(numValue);
    setQuantityError('');
  };

  const addToCart = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to add items to cart');
    navigate('/login');
    return;
  }

  if (!quantity || quantity < 1) {
    setQuantityError('Invalid quantity');
    return;
  }

  // Debug: Check the product ID
  console.log('Product ID from URL:', productId);
  console.log('Product object:', product);

  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Use the productId from URL params as the primary ID
  const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

  if (existingItemIndex >= 0) {
    const newQuantity = cartItems[existingItemIndex].quantity + quantity;
    if (newQuantity > product.stock) {
      setQuantityError(`Only ${product.stock} available`);
      return;
    }
    cartItems[existingItemIndex].quantity = newQuantity;
  } else {
    cartItems.push({
      productId: productId, // Using the ID from URL params
      name: product.name,
      price: product.price,
      productImage: product.productImage,
      category: product.category,
      stock: product.stock,
      quantity: quantity
    });
  }

  localStorage.setItem('cart', JSON.stringify(cartItems));
  console.log('Updated cart:', cartItems); // Debug cart contents
  alert(`${quantity} ${product.name}(s) added to cart!`);
  navigate('/cart');
};

  if (loading) {
    return <Typography>Loading product details...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 ,marginTop:'100px' }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Menu
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="500"
              image={`http://localhost:4000/images/${product.productImage}`}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h3" gutterBottom>
              {product.name}
            </Typography>
            
            <Chip 
              label={product.category} 
              color="primary" 
              sx={{ mb: 2, alignSelf: 'flex-start' }}
            />
            
            <Typography variant="h4" color="#FF5722" gutterBottom>
              LKR {product.price}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {product.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Availability
              </Typography>
              <Chip 
                label={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'} 
                color={product.stock > 0 ? 'success' : 'error'} 
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                inputProps={{
                  min: 1,
                  max: product.stock
                }}
                error={Boolean(quantityError)}
                helperText={quantityError}
                disabled={product.stock <= 0}
                sx={{ width: '120px' }}
              />
            </Box>
            
            <Button
              variant="contained"
              size="large"
              disabled={product.stock <= 0 || Boolean(quantityError)}
              onClick={addToCart}
              sx={{
                backgroundColor: '#FF5722',
                '&:hover': {
                  backgroundColor: '#E64A19'
                },
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;