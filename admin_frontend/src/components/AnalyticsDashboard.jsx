import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@mui/material';
import { Chart, registerables } from 'chart.js';
import { Document, Image, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

// Register Chart.js components
Chart.register(...registerables);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all');
  const [reportTitle, setReportTitle] = useState('Restaurant Analytics Report');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/analytics/analytics', {
        params: { range: timeRange }
      });
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    const input = document.getElementById('analytics-dashboard');
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('landscape');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${reportTitle}.pdf`);
  };

  const generateDetailedPDF = () => {
  // Helper function to safely display values
  const displayValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return value.toString();
  };

  const doc = (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>{reportTitle}</Text>
          <Text style={styles.subheader}>Generated on: {new Date().toLocaleDateString()}</Text>
          
          {/* Sales Trends */}
          <Text style={styles.sectionTitle}>Sales Trends</Text>
          {analyticsData?.salesTrends?.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeader]}>Month</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Total Sales</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Order Count</Text>
              </View>
              {analyticsData.salesTrends.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{displayValue(item.month)}</Text>
                  <Text style={styles.tableCell}>${displayValue(item.total_sales)}</Text>
                  <Text style={styles.tableCell}>{displayValue(item.order_count)} orders</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.text}>No sales data available</Text>
          )}
          
          {/* Product Sales */}
          <Text style={styles.sectionTitle}>Top Selling Products</Text>
          {analyticsData?.productSales?.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeader]}>Product</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Category</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Quantity Sold</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Revenue</Text>
              </View>
              {analyticsData.productSales.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{displayValue(item.name)}</Text>
                  <Text style={styles.tableCell}>{displayValue(item.category)}</Text>
                  <Text style={styles.tableCell}>{displayValue(item.total_sold)}</Text>
                  <Text style={styles.tableCell}>${displayValue(item.revenue)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.text}>No product sales data available</Text>
          )}

          {/* Add other sections following the same pattern */}
        </View>
      </Page>
    </Document>
  );

  pdf(doc).toBlob().then(blob => {
    saveAs(blob, `${reportTitle}.pdf`);
  });
};

  if (loading) return <Typography>Loading analytics...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!analyticsData) return <Typography>No data available</Typography>;

  return (
    <Box sx={{ p: 3 }} id="analytics-dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Restaurant Analytics</Typography>
        <Box>
          <FormControl sx={{ mr: 2, minWidth: 120 }} size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={generatePDF} sx={{ mr: 2 }}>
            Export as PDF (Simple)
          </Button>
          <Button variant="outlined" onClick={generateDetailedPDF}>
            Export as PDF (Detailed)
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Sales Trends */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Sales Trends</Typography>
            <Line
              data={{
                labels: analyticsData.salesTrends.map(item => item.month),
                datasets: [{
                  label: 'Total Sales',
                  data: analyticsData.salesTrends.map(item => item.total_sales),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                  yAxisID: 'y'
                }, {
                  label: 'Order Count',
                  data: analyticsData.salesTrends.map(item => item.order_count),
                  borderColor: 'rgb(54, 162, 235)',
                  tension: 0.1,
                  yAxisID: 'y1'
                }]
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Sales ($)' }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Order Count' }
                  }
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
            <Bar
              data={{
                labels: analyticsData.productSales.map(item => item.name),
                datasets: [{
                  label: 'Quantity Sold',
                  data: analyticsData.productSales.map(item => item.total_sold),
                  backgroundColor: 'rgba(153, 102, 255, 0.6)'
                }, {
                  label: 'Revenue ($)',
                  data: analyticsData.productSales.map(item => item.revenue),
                  backgroundColor: 'rgba(255, 159, 64, 0.6)'
                }]
              }}
              options={{
                responsive: true,
                scales: {
                  x: { stacked: false },
                  y: { beginAtZero: true }
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Order Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Order Status</Typography>
            <Pie
              data={{
                labels: analyticsData.orderStatus.map(item => item.status),
                datasets: [{
                  data: analyticsData.orderStatus.map(item => item.count),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                  ]
                }]
              }}
            />
          </Paper>
        </Grid>

        {/* Reservation Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Reservation Status</Typography>
            <Pie
              data={{
                labels: analyticsData.reservationStatus.map(item => item.status),
                datasets: [{
                  data: analyticsData.reservationStatus.map(item => item.count),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                  ]
                }]
              }}
            />
          </Paper>
        </Grid>

        {/* Payment Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Payment Status</Typography>
            <Pie
              data={{
                labels: analyticsData.paymentStatuses.map(item => item.payment_status),
                datasets: [{
                  data: analyticsData.paymentStatuses.map(item => item.count),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                  ]
                }]
              }}
            />
          </Paper>
        </Grid>

        {/* Popular Categories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Popular Categories</Typography>
            <Bar
              data={{
                labels: analyticsData.popularCategories.map(item => item.category),
                datasets: [{
                  label: 'Orders',
                  data: analyticsData.popularCategories.map(item => item.order_count),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
              }}
            />
          </Paper>
        </Grid>

        {/* Table Utilization */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Table Utilization</Typography>
            <Bar
              data={{
                labels: analyticsData.tableUtilization.map(item => `Table ${item.table_number}`),
                datasets: [{
                  label: 'Reservations',
                  data: analyticsData.tableUtilization.map(item => item.reservation_count),
                  backgroundColor: 'rgba(255, 159, 64, 0.6)'
                }]
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
});

export default AnalyticsDashboard;