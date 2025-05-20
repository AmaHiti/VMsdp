import {
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import React, { useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const AddProduct = () => {
  const colors = {
    primary: '#FF5722',
    secondary: '#FFFFFF',
    background: '#F5F5F5',
    paper: '#FFFFFF',
    text: '#333333',
    accent: '#FF9E80'
  };

  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const categories = [
    'Offers',
    'Meals',
    'Beverages',
    'Desserts',
    'Sides',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const { product_id, name, category, price, stock } = formData;
  if (!product_id || !name || !category || !price || !stock) {
    alert('Please fill in all required fields.');
    setIsSubmitting(false);
    return;
  }

  const formDataToSend = new FormData();
  // Change product_id to productId to match backend expectation
  formDataToSend.append('productId', product_id);
  formDataToSend.append('name', name);
  formDataToSend.append('category', category);
  formDataToSend.append('price', price);
  formDataToSend.append('stock', stock);
  formDataToSend.append('description', formData.description);
  
  if (productImage) {
    formDataToSend.append('productImage', productImage); // This should match your multer configuration
  }

  try {
    await axios.post('http://localhost:4000/api/product/add', formDataToSend, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        product_id: '',
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
      });
      setProductImage(null);
      setImagePreview(null);
      setShowCustomCategory(false);
      setFormSubmitted(false);
    }, 3000);
  } catch (error) {
    console.error('Error:', error);
    alert(error.response?.data?.message || 'Failed to add product. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: colors.paper,
          borderRadius: '16px',
          p: { xs: 2, sm: 4 },
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', backgroundColor: colors.primary }} />

        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              fontWeight: 700, 
              color: colors.text,
              mb: 3,
              letterSpacing: '0.5px'
            }}
          >
            Add New Product
          </Typography>

          <Divider sx={{ 
            mb: 4, 
            opacity: 0.6,
            '&::before, &::after': {
              borderColor: alpha(colors.primary, 0.2),
            }
          }} />

          {formSubmitted ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>Product Added Successfully!</Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                The product has been added to your inventory.
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 2 } }}>
                <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
                  <TextField
                    label="Product ID"
                    name="product_id"
                    fullWidth
                    onChange={handleChange}
                    value={formData.product_id}
                    required
                    size="medium"
                    variant="outlined"
                    sx={{
                      margin: '16px 0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: colors.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.primary,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
                  <TextField
                    label="Product Name"
                    name="name"
                    fullWidth
                    onChange={handleChange}
                    value={formData.name}
                    required
                    size="medium"
                    variant="outlined"
                    sx={{
                      margin: '16px 0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: colors.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.primary,
                      },
                    }}
                  />
                </Box>
              </Box>
              
              {!showCustomCategory ? (
                <TextField
                  select
                  label="Category"
                  name="category"
                  fullWidth
                  onChange={handleCategoryChange}
                  value={formData.category}
                  required
                  variant="outlined"
                  sx={{
                    margin: '16px 0',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: colors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.primary,
                    },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          borderRadius: '8px',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        },
                      },
                    },
                  }}
                >
                  {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  label="Custom Category"
                  name="category"
                  fullWidth
                  onChange={handleChange}
                  value={formData.category}
                  required
                  variant="outlined"
                  sx={{
                    margin: '16px 0',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: colors.primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.primary,
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.primary,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          size="small" 
                          startIcon={<ArrowBackIcon />}
                          onClick={() => {
                            setShowCustomCategory(false);
                            setFormData(prev => ({
                              ...prev,
                              category: ''
                            }));
                          }}
                          sx={{
                            color: colors.primary,
                            '&:hover': {
                              backgroundColor: alpha(colors.primary, 0.08),
                            }
                          }}
                        >
                          Back to list
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 2 } }}>
                <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                    value={formData.price}
                    required
                    variant="outlined"
                    sx={{
                      margin: '16px 0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: colors.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.primary,
                      },
                    }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                    }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
                  <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                    value={formData.stock}
                    required
                    variant="outlined"
                    sx={{
                      margin: '16px 0',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '&:hover fieldset': {
                          borderColor: colors.primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.primary,
                      },
                    }}
                  />
                </Box>
              </Box>
              
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                onChange={handleChange}
                value={formData.description}
                variant="outlined"
                sx={{
                  margin: '16px 0',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.primary,
                  },
                }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mt: 4,
                mb: 2,
                p: 3,
                borderRadius: '12px',
                backgroundColor: alpha(colors.primary, 0.03),
                border: `1px dashed ${alpha(colors.primary, 0.3)}`,
              }}>
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Product Image"
                    sx={{ 
                      width: 180, 
                      height: 180, 
                      objectFit: 'contain',
                      marginBottom: 2,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                ) : (
                  <Box
                    sx={{ 
                      width: 180, 
                      height: 180,
                      marginBottom: 2,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: alpha(colors.primary, 0.04),
                      color: alpha(colors.primary, 0.7)
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, mb: 1, opacity: 0.7 }} />
                    <Typography color="textSecondary" variant="body2">
                      Upload product image
                    </Typography>
                  </Box>
                )}

                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="product-image-upload"
                />
                <label htmlFor="product-image-upload">
                  <Button 
                    variant="outlined" 
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ 
                      mt: 2,
                      borderRadius: '8px',
                      borderColor: colors.primary,
                      color: colors.primary,
                      '&:hover': {
                        borderColor: colors.primary,
                        backgroundColor: alpha(colors.primary, 0.08),
                      }
                    }}
                  >
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </Button>
                </label>
              </Box>

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                endIcon={<AddCircleOutlineIcon />}
                fullWidth
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  py: 1.5,
                  backgroundColor: colors.primary,
                  borderRadius: '8px',
                  fontWeight: 600,
                  boxShadow: `0 4px 14px ${alpha(colors.primary, 0.4)}`,
                  '&:hover': {
                    backgroundColor: alpha(colors.primary, 0.9),
                    boxShadow: `0 6px 18px ${alpha(colors.primary, 0.5)}`,
                  }
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </form>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct;