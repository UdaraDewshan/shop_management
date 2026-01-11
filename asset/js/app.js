const API_URL = 'https://dummyjson.com/products';
const productGrid = document.getElementById('productGrid');
const productModal = new bootstrap.Modal(document.getElementById('productModal'));

document.addEventListener('DOMContentLoaded', loadProducts);
