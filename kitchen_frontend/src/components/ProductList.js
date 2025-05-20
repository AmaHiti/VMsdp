import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import axios from 'axios';

// Import icons










const ProductList = () => {
  // Modern color palette to match the sidebar and add product form
  const colors = {
    primary: '#FF5722', // Vibrant orange
    secondary: '#FFFFFF',
    background: '#F5F5F5', // Light gray background
    paper: '#FFFFFF',
    text: '#333333',
    accent: '#FF9E80', // Light orange
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107'
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productId.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/product/get');
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (productId) => {
    setProductToDelete(productId);
    setConfirmDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:4000/api/product/delete', { 
        data: { productId: productToDelete } 
      });
      setProducts(products.filter(product => product.productId !== productToDelete));
      setFilteredProducts(filteredProducts.filter(product => product.productId !== productToDelete));
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setConfirmDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct({...product});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = async () => {
    if (!selectedProduct.productId || !selectedProduct.name || !selectedProduct.category || 
        !selectedProduct.price || !selectedProduct.stock) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await axios.put('http://localhost:4000/api/product/update', selectedProduct);
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleChange = (e) => {
    setSelectedProduct({ ...selectedProduct, [e.target.name]: e.target.value });
  };

  // Custom styled TextField component
  const StyledTextField = ({ ...props }) => (
    <TextField
      {...props}
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
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: colors.paper,
          borderRadius: '16px',
          p: { xs: 2, sm: 3 },
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative header accent */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '8px', 
            backgroundColor: colors.primary 
          }} 
        />

        <Box sx={{ mt: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3 
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: colors.text,
                letterSpacing: '0.5px',
              }}
            >
              Product Inventory
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                placeholder="Search products..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: alpha(colors.primary, 0.7) }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: '100%', sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&:hover fieldset': {
                      borderColor: colors.primary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.primary,
                    }
                  }
                }}
              />
              
              <IconButton 
                onClick={fetchProducts}
                sx={{ 
                  color: colors.primary,
                  backgroundColor: alpha(colors.primary, 0.08),
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: alpha(colors.primary, 0.15),
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 3, opacity: 0.6 }} />

          <TableContainer 
            sx={{ 
              borderRadius: '12px',
              boxShadow: 'none',
              border: `1px solid ${alpha('#000', 0.08)}`,
              overflow: 'hidden',
              mb: 2
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: alpha(colors.primary, 0.04) }}>
                  <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Product ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        Loading products...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        {searchQuery ? 'No products match your search.' : 'No products available.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <TableRow 
                      key={product.productId}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: alpha('#f5f5f5', 0.3) },
                        '&:hover': { backgroundColor: alpha(colors.primary, 0.03) },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>
                        {product.productImage ? (
                          <Avatar 
                            src={`http://localhost:4000/images/${product.productImage}`} 
                            alt="Product" 
                            sx={{ 
                              width: 56, 
                              height: 56,
                              borderRadius: '8px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                            }} 
                            variant="rounded"
                          />
                        ) : (
                          <Avatar 
                            sx={{ 
                              width: 56, 
                              height: 56, 
                              backgroundColor: alpha(colors.primary, 0.7),
                              borderRadius: '8px'
                            }} 
                            variant="rounded"
                          >
                            {product.name.charAt(0)}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>{product.productId}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={product.category} 
                          size="small"
                          icon={<CategoryIcon />}
                          sx={{ 
                            backgroundColor: alpha(colors.primary, 0.1),
                            color: colors.primary,
                            fontWeight: 500,
                            borderRadius: '6px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>LKR {parseFloat(product.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${product.stock} in stock`}
                          size="small"
                          icon={<InventoryIcon />}
                          sx={{ 
                            backgroundColor: product.stock > 10 
                              ? alpha(colors.success, 0.1)
                              : product.stock > 0
                                ? alpha(colors.warning, 0.1)
                                : alpha(colors.error, 0.1),
                            color: product.stock > 10 
                              ? colors.success
                              : product.stock > 0
                                ? colors.warning
                                : colors.error,
                            fontWeight: 500,
                            borderRadius: '6px'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleUpdate(product)}
                            sx={{
                              backgroundColor: alpha(colors.primary, 0.9),
                              '&:hover': {
                                backgroundColor: colors.primary,
                              },
                              borderRadius: '6px',
                              boxShadow: 'none',
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => handleDeleteConfirmation(product.productId)}
                            sx={{
                              backgroundColor: alpha(colors.error, 0.9),
                              '&:hover': {
                                backgroundColor: colors.error,
                              },
                              borderRadius: '6px',
                              boxShadow: 'none',
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Typography variant="body2" color="textSecondary">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Update Product Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : '16px',
            maxWidth: '600px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${alpha('#000', 0.1)}`,
          backgroundColor: alpha(colors.primary, 0.04)
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Update Product
          </Typography>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 2 } }}>
            <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
              <StyledTextField
                label="Product ID"
                name="productId"
                value={selectedProduct?.productId || ''}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
              <StyledTextField
                label="Name"
                name="name"
                value={selectedProduct?.name || ''}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
          
          <StyledTextField
            label="Category"
            name="category"
            value={selectedProduct?.category || ''}
            onChange={handleChange}
            fullWidth
          />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 2 } }}>
            <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
              <StyledTextField
                label="Price"
                name="price"
                value={selectedProduct?.price || ''}
                onChange={handleChange}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 45%', minWidth: { xs: '100%', md: '45%' } }}>
              <StyledTextField
                label="Stock"
                name="stock"
                value={selectedProduct?.stock || ''}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Box>
          </Box>
          
          <StyledTextField
            label="Description"
            name="description"
            value={selectedProduct?.description || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: 2, 
            borderTop: `1px solid ${alpha('#000', 0.1)}`,
            backgroundColor: alpha(colors.primary, 0.02)
          }}
        >
          <Button 
            onClick={handleClose} 
            sx={{ 
              color: alpha('#000', 0.6),
              borderRadius: '8px',
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleSave} 
            startIcon={<SaveIcon />}
            sx={{ 
              backgroundColor: colors.primary,
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: `0 4px 12px ${alpha(colors.primary, 0.25)}`,
              '&:hover': {
                backgroundColor: alpha(colors.primary, 0.9)
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
            maxWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: colors.error }}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this product? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            sx={{ 
              color: alpha('#000', 0.6),
              borderRadius: '8px',
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleDelete}
            sx={{ 
              backgroundColor: colors.error,
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: alpha(colors.error, 0.9)
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductList;