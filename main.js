// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Don Pee Wine Merchants loaded successfully');
    
    // Enhanced Age Verification
    const ageVerify = document.querySelector('.age-verify');
    const ageConfirm = document.querySelector('.age-confirm');
    
    // Check if age has already been confirmed
    if (!localStorage.getItem('ageConfirmed')) {
        if (ageVerify) {
            ageVerify.style.display = 'block';
            // Force reflow to enable transition
            ageVerify.offsetHeight;
        }
    } else {
        if (ageVerify) {
            ageVerify.classList.add('hidden');
        }
    }
    
    // Enhanced age confirmation handler with smooth animation
    if (ageConfirm) {
        ageConfirm.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Store confirmation
            localStorage.setItem('ageConfirmed', 'true');
            
            // Add hidden class to trigger animation
            if (ageVerify) {
                ageVerify.classList.add('hidden');
                
                // Remove element from DOM after animation completes
                setTimeout(() => {
                    ageVerify.style.display = 'none';
                }, 500); // Match the CSS transition duration
            }
            
            // Show welcome message
            showToast('Welcome to Don Pee Wine Merchants!');
        });
    }
    
    // Enhanced Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchModal = document.querySelector('.search-modal');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const searchResults = document.getElementById('searchResults');
    const recentSearches = document.getElementById('recentSearches');
    const recentSearchList = document.getElementById('recentSearchList');
    const clearResults = document.getElementById('clearResults');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    
    // Sample search data (in a real app, this would come from an API)
    const wineData = [
        { id: 1, name: 'Château Margaux 2015', type: 'Red Wine', region: 'Bordeaux', price: '₹42,500', category: 'Premium' },
        { id: 2, name: 'Barolo Riserva 2012', type: 'Red Wine', region: 'Piedmont', price: '₹26,800', category: 'Premium' },
        { id: 3, name: 'Dom Pérignon 2010', type: 'Champagne', region: 'Champagne', price: '₹38,900', category: 'Sparkling' },
        { id: 4, name: 'Sancerre Blanc 2020', type: 'White Wine', region: 'Loire Valley', price: '₹8,750', category: 'White' },
        { id: 5, name: 'Pinot Noir 2019', type: 'Red Wine', region: 'Burgundy', price: '₹12,500', category: 'Red' },
        { id: 6, name: 'Chardonnay Reserve', type: 'White Wine', region: 'California', price: '₹9,800', category: 'White' },
        { id: 7, name: 'Rosé Provence', type: 'Rosé Wine', region: 'Provence', price: '₹6,900', category: 'Rosé' },
        { id: 8, name: 'Cabernet Sauvignon', type: 'Red Wine', region: 'Napa Valley', price: '₹15,200', category: 'Red' }
    ];
    
    // Load recent searches from localStorage
    let recentSearchesList = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Update recent searches display
    function updateRecentSearches() {
        if (recentSearchList) {
            recentSearchList.innerHTML = '';
            
            if (recentSearchesList.length > 0) {
                recentSearches.style.display = 'block';
                
                recentSearchesList.slice(0, 5).forEach(search => {
                    const item = document.createElement('div');
                    item.className = 'recent-search-item';
                    item.innerHTML = `
                        <span class="recent-search-text">${search.query}</span>
                        <span class="recent-search-time">${search.time}</span>
                    `;
                    item.addEventListener('click', () => {
                        searchInput.value = search.query;
                        performSearch(search.query);
                    });
                    recentSearchList.appendChild(item);
                });
                
                // Add clear recent button
                const clearButton = document.createElement('button');
                clearButton.className = 'clear-recent';
                clearButton.textContent = 'Clear All';
                clearButton.addEventListener('click', clearAllRecentSearches);
                recentSearchList.appendChild(clearButton);
            } else {
                recentSearches.style.display = 'none';
            }
        }
    }
    
    // Save search to recent searches
    function saveToRecentSearches(query) {
        // Remove if already exists
        recentSearchesList = recentSearchesList.filter(item => item.query !== query);
        
        // Add new search with timestamp
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        recentSearchesList.unshift({
            query: query,
            time: timeString,
            timestamp: now.getTime()
        });
        
        // Keep only last 10 searches
        if (recentSearchesList.length > 10) {
            recentSearchesList = recentSearchesList.slice(0, 10);
        }
        
        // Save to localStorage
        localStorage.setItem('recentSearches', JSON.stringify(recentSearchesList));
        updateRecentSearches();
    }
    
    // Clear all recent searches
    function clearAllRecentSearches() {
        recentSearchesList = [];
        localStorage.setItem('recentSearches', JSON.stringify([]));
        updateRecentSearches();
        showToast('Recent searches cleared');
    }
    
    // Perform search function
    function performSearch(query) {
        if (!query.trim()) {
            showResults([], query);
            return;
        }
        
        // Show loading state
        searchResults.style.display = 'block';
        searchSuggestions.style.display = 'none';
        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.innerHTML = `
            <div class="search-loading">
                <div class="spinner"></div>
                <p>Searching wines...</p>
            </div>
        `;
        
        // Simulate API delay
        setTimeout(() => {
            // Filter wine data based on query
            const results = wineData.filter(wine => 
                wine.name.toLowerCase().includes(query.toLowerCase()) ||
                wine.type.toLowerCase().includes(query.toLowerCase()) ||
                wine.region.toLowerCase().includes(query.toLowerCase()) ||
                wine.category.toLowerCase().includes(query.toLowerCase())
            );
            
            showResults(results, query);
            saveToRecentSearches(query);
        }, 800);
    }
    
    // Display search results
    function showResults(results, query) {
        const resultsGrid = document.getElementById('resultsGrid');
        const searchQuerySpan = document.getElementById('searchQuery');
        
        if (searchQuerySpan) {
            searchQuerySpan.textContent = query;
        }
        
        if (results.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-wine-glass"></i>
                    <h6>No wines found</h6>
                    <p>Try a different search term or browse our collections</p>
                </div>
            `;
        } else {
            resultsGrid.innerHTML = '';
            results.forEach(wine => {
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerHTML = `
                    <h6>${wine.name}</h6>
                    <p>${wine.type} • ${wine.region}</p>
                    <div class="result-price">${wine.price}</div>
                `;
                item.addEventListener('click', () => {
                    // In a real app, this would navigate to the product page
                    showToast(`Viewing ${wine.name}`);
                    searchModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
                resultsGrid.appendChild(item);
            });
        }
    }
    
    // Clear search results
    if (clearResults) {
        clearResults.addEventListener('click', () => {
            searchResults.style.display = 'none';
            searchSuggestions.style.display = 'block';
            searchInput.value = '';
            searchInput.focus();
        });
    }
    
    // Initialize recent searches display
    updateRecentSearches();
    
    // Search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });
    }
    
    // Suggestion tag click handlers
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.getAttribute('data-search');
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        });
    });
    
    // Real-time search as user types
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 500);
            } else {
                searchResults.style.display = 'none';
                searchSuggestions.style.display = 'block';
            }
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                searchResults.style.display = 'none';
                searchSuggestions.style.display = 'block';
            }
        });
    }
    
    // Open search modal
    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            searchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on input after a short delay
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        });
    }
    
    // Close search modal
    if (searchClose) {
        searchClose.addEventListener('click', function() {
            closeSearchModal();
        });
    }
    
    function closeSearchModal() {
        searchModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        searchInput.value = '';
        searchResults.style.display = 'none';
        searchSuggestions.style.display = 'block';
    }
    
    // Close search modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
            closeSearchModal();
        }
    });
    
    // Close search modal when clicking outside
    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });
    }
    
    // Keep the existing functionality for wishlist, cart, etc...
    // ... (Keep all the existing code from previous script.js) ...
    
    // Wishlist functionality
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            const actionCount = document.querySelector('.wishlist-btn .action-count');
            
            if (icon.classList.contains('far')) {
                // Add to wishlist
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = 'var(--wine)';
                
                if (actionCount) {
                    let count = parseInt(actionCount.textContent) || 0;
                    actionCount.textContent = count + 1;
                }
                
                showToast('Added to wishlist');
            } else {
                // Remove from wishlist
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                
                if (actionCount) {
                    let count = parseInt(actionCount.textContent) || 1;
                    actionCount.textContent = Math.max(0, count - 1);
                }
                
                showToast('Removed from wishlist');
            }
        });
    });
    
    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const originalText = this.textContent;
            const cartCount = document.querySelector('.cart-btn .action-count');
            
            this.textContent = 'Added!';
            this.style.backgroundColor = 'var(--orange)';
            
            if (cartCount) {
                let count = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = count + 1;
                
                const cartIcon = document.querySelector('.cart-btn');
                if (cartIcon) {
                    cartIcon.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        cartIcon.style.transform = '';
                    }, 300);
                }
            }
            
            showToast('Added to cart');
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (emailInput && emailInput.value) {
                const originalText = submitBtn.textContent;
                
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                submitBtn.style.backgroundColor = 'var(--orange)';
                
                showToast('Successfully subscribed to newsletter!');
                
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
    
    // Quantity selector functionality
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('input');
        
        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                if (value > 1) {
                    input.value = value - 1;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                let value = parseInt(input.value) || 1;
                input.value = value + 1;
            });
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
    });
    
    // Product card hover animations
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Collection card animations
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.collection-image');
            if (image) {
                image.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.collection-image');
            if (image) {
                image.style.transform = '';
            }
        });
    });
    
    // Toast notification function
    function showToast(message) {
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--charcoal);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
            if (style.parentNode) {
                style.remove();
            }
        }, 3000);
    }
    
    // Initialize Bootstrap modal events
    $('.wine-modal').on('show.bs.modal', function () {
        // Add any modal show logic here
    });
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

        // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
    
    // Video fallback for mobile
    function checkVideoSupport() {
        const video = document.querySelector('.hero-video-bg');
        if (video && window.innerWidth < 768) {
            // Hide video on mobile for better performance
            video.style.display = 'none';
            const imageBg = document.querySelector('.hero-image-bg');
            if (imageBg) {
                imageBg.style.opacity = '1';
            }
        }
    }
    
    // Check on load and resize
    window.addEventListener('load', checkVideoSupport);
    window.addEventListener('resize', checkVideoSupport);
});