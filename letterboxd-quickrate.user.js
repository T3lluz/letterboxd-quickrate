// ==UserScript==
// @name         Letterboxd Quick Rate (Tinder Style)
// @namespace    https://github.com/T3lluz/letterboxd-quickrate
// @version      3.3.0
// @description  Quickly rate popular movies with a swipe-like interface on Letterboxd
// @author       T3lluz
// @match        https://letterboxd.com/*
// @homepage     https://github.com/T3lluz/letterboxd-quickrate
// @updateURL    https://github.com/T3lluz/letterboxd-quickrate/raw/main/letterboxd-quickrate.user.js
// @downloadURL  https://github.com/T3lluz/letterboxd-quickrate/raw/main/letterboxd-quickrate.user.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STYLES ---
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #lb-quickrate-modal {
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100vw; 
                height: 100vh;
                background: rgba(0,0,0,0.9); 
                z-index: 99999; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            #lb-quickrate-card {
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                color: #fff; 
                border-radius: 16px; 
                padding: 40px; 
                width: 400px; 
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                border: 1px solid #333;
                position: relative;
                overflow: hidden;
            }
            
            #lb-quickrate-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #ff8000, #ff6b35, #ff8000);
            }
            
            #lb-quickrate-card h2 {
                margin: 0 0 20px 0;
                font-size: 24px;
                font-weight: 600;
                color: #fff;
            }
            
            #lb-quickrate-card img { 
                width: 250px; 
                height: 375px;
                border-radius: 12px; 
                object-fit: cover;
                margin: 0 auto 24px auto;
                display: block;
                box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            }
            
            /* Letterboxd's exact star rating system */
            .rating-stars {
                display: flex;
                flex-direction: row-reverse;
                justify-content: center;
                margin: 24px 0;
                font-size: 0;
                line-height: 1;
            }
            
            .rating-stars input {
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }
            
            .rating-stars label {
                cursor: pointer;
                font-size: 0;
                color: rgba(255,255,255,0.2);
                transition: color 0.1s ease-in-out;
                margin: 0 2px;
                position: relative;
            }
            
            .rating-stars label:before {
                content: "★";
                display: inline-block;
                font-size: 32px;
                font-family: 'Georgia', serif;
            }
            
            .rating-stars input:checked ~ label {
                color: #ffcc00;
            }
            
            .rating-stars label:hover,
            .rating-stars label:hover ~ label {
                color: #ffcc00;
            }
            
            .rating-stars input:checked + label:hover,
            .rating-stars input:checked + label:hover ~ label,
            .rating-stars input:checked ~ label:hover,
            .rating-stars input:checked ~ label:hover ~ label,
            .rating-stars label:hover ~ input:checked ~ label {
                color: #ffcc00;
            }
            
            /* Half-star support */
            .rating-stars .half-star {
                position: relative;
            }
            
            .rating-stars .half-star:before {
                content: "★";
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                overflow: hidden;
                color: #ffcc00;
            }
            
            .rating-stars .half-star:after {
                content: "☆";
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                color: rgba(255,255,255,0.2);
            }
            
            #lb-quickrate-buttons {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-top: 20px;
            }
            
            #lb-quickrate-buttons button {
                flex: 1;
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }
            
            #lb-quickrate-skip { 
                background-color: #444;
                color: #ccc;
            }
            
            #lb-quickrate-skip:hover {
                background-color: #555;
                color: #fff;
            }
            
            #lb-quickrate-rate {
                background-color: #ff6b35;
                color: white;
            }
            
            #lb-quickrate-rate:hover {
                background-color: #ff5722;
            }
            
            #lb-quickrate-close { 
                position: absolute; 
                top: 20px; 
                right: 20px; 
                color: #fff; 
                font-size: 2em; 
                cursor: pointer;
                background: none;
                border: none;
                padding: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            #lb-quickrate-close:hover {
                background: rgba(255,255,255,0.1);
            }
            
            #lb-quickrate-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                background: linear-gradient(90deg, #ff8000, #ff6b35);
                transition: width 0.3s ease;
            }
            
            .lb-quickrate-btn {
                background: linear-gradient(135deg, #ff8000 0%, #ff6b35 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                text-decoration: none;
                display: inline-block;
                margin: 0 8px;
                box-shadow: 0 4px 12px rgba(255, 128, 0, 0.3);
            }
            
            .lb-quickrate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(255, 128, 0, 0.5);
            }
            
            .lb-quickrate-floating {
                position: fixed;
                bottom: 32px;
                right: 32px;
                z-index: 99998;
                animation: lb-quickrate-pulse 2s infinite;
                border-radius: 12px;
                padding: 8px;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(10px);
            }
            
            @keyframes lb-quickrate-pulse {
                0% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 128, 0, 0.3); }
                50% { transform: scale(1.05); box-shadow: 0 8px 24px rgba(255, 128, 0, 0.6); }
                100% { transform: scale(1); box-shadow: 0 4px 12px rgba(255, 128, 0, 0.3); }
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // --- MOVIE EXTRACTION ---
    function extractMoviesFromPage() {
        console.log('Letterboxd Quick Rate: Extracting movies from current page...');
        
        let movies = [];
        
        // Method 1: Extract from film grid/list items
        let filmItems = document.querySelectorAll('.film-detail, .poster-container, .film-poster, .poster-list-item');
        console.log(`Letterboxd Quick Rate: Found ${filmItems.length} film items`);
        
        filmItems.forEach((item, index) => {
            try {
                // Find the link to the film
                let link = item.querySelector('a[href*="/film/"]') || item.closest('a[href*="/film/"]');
                if (!link) return;
                
                let href = link.href;
                let slugMatch = href.match(/\/film\/([^\/\?]+)/);
                if (!slugMatch) return;
                
                let slug = slugMatch[1];
                
                // Get title from multiple sources
                let title = link.getAttribute('data-original-title') ||
                           link.getAttribute('title') ||
                           link.querySelector('.frame-title')?.textContent?.trim() ||
                           link.querySelector('.film-title')?.textContent?.trim() ||
                           link.querySelector('.poster-title')?.textContent?.trim();
                
                // Generate title from slug if needed
                if (!title || title.includes('Watched by') || title.includes('members')) {
                    title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                }
                
                // Get poster image - try multiple methods
                let poster = extractPosterImage(item, link, slug);
                
                if (slug && title && !movies.find(m => m.slug === slug)) {
                    movies.push({ title, slug, poster });
                    console.log(`Letterboxd Quick Rate: Added movie ${index + 1}: "${title}" (${slug})`);
                }
            } catch (error) {
                console.error('Letterboxd Quick Rate: Error processing film item:', error);
            }
        });
        
        // Method 2: If no movies found, try direct link extraction
        if (movies.length === 0) {
            console.log('Letterboxd Quick Rate: No film items found, trying direct link extraction...');
            let movieLinks = document.querySelectorAll('a[href*="/film/"]');
            
            movieLinks.forEach((link, index) => {
                try {
                    let href = link.href;
                    let slugMatch = href.match(/\/film\/([^\/\?]+)/);
                    if (!slugMatch) return;
                    
                    let slug = slugMatch[1];
                    
                    // Get title
                    let title = link.getAttribute('data-original-title') ||
                               link.getAttribute('title') ||
                               link.querySelector('.frame-title')?.textContent?.trim() ||
                               link.querySelector('.film-title')?.textContent?.trim();
                    
                    if (!title || title.includes('Watched by') || title.includes('members')) {
                        title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    }
                    
                    // Get poster
                    let poster = extractPosterImage(link.parentElement, link, slug);
                    
                    if (slug && title && !movies.find(m => m.slug === slug)) {
                        movies.push({ title, slug, poster });
                        console.log(`Letterboxd Quick Rate: Added movie ${index + 1}: "${title}" (${slug})`);
                    }
                } catch (error) {
                    console.error('Letterboxd Quick Rate: Error processing movie link:', error);
                }
            });
        }
        
        console.log(`Letterboxd Quick Rate: Total movies extracted: ${movies.length}`);
        return movies;
    }
    
    function extractPosterImage(container, link, slug) {
        // Method 1: Look for img with data-src or src
        let img = container?.querySelector('img') || link?.querySelector('img');
        if (img) {
            let poster = img.getAttribute('data-src') || 
                        img.src ||
                        img.getAttribute('data-srcset')?.split(' ')[0] ||
                        img.getAttribute('data-original');
            
            if (poster && !poster.includes('letterboxd.com/assets')) {
                console.log(`Letterboxd Quick Rate: Found poster from img: ${poster}`);
                return poster;
            }
        }
        
        // Method 2: Look in parent containers
        let parentContainer = container?.closest('.poster-container, .film-poster, .poster, .poster-list-item');
        if (parentContainer) {
            let parentImg = parentContainer.querySelector('img');
            if (parentImg) {
                let poster = parentImg.getAttribute('data-src') || 
                           parentImg.src ||
                           parentImg.getAttribute('data-srcset')?.split(' ')[0] ||
                           parentImg.getAttribute('data-original');
                
                if (poster && !poster.includes('letterboxd.com/assets')) {
                    console.log(`Letterboxd Quick Rate: Found poster from parent: ${poster}`);
                    return poster;
                }
            }
        }
        
        // Method 3: Try to construct poster URL from slug using Letterboxd's CDN
        let constructedPoster = `https://a.ltrbxd.com/resized/film-poster/${slug}-0-600-0-900-crop.jpg`;
        console.log(`Letterboxd Quick Rate: Using constructed poster: ${constructedPoster}`);
        return constructedPoster;
    }

    // --- IMPROVED RATING SYSTEM ---
    async function rateMovieDirectly(slug, stars) {
        console.log(`Letterboxd Quick Rate: Rating movie ${slug} with ${stars} stars directly`);
        
        try {
            // First, try to get the movie page to extract the rating form and CSRF token
            const moviePageResponse = await fetch(`https://letterboxd.com/film/${slug}/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!moviePageResponse.ok) {
                throw new Error(`Failed to fetch movie page: ${moviePageResponse.status}`);
            }
            
            const moviePageHtml = await moviePageResponse.text();
            const parser = new DOMParser();
            const movieDoc = parser.parseFromString(moviePageHtml, 'text/html');
            
            // Look for the rating form
            const ratingForm = movieDoc.querySelector('form[action*="/rate/"]');
            if (!ratingForm) {
                throw new Error('No rating form found on movie page');
            }
            
            // Extract form action and CSRF token
            const formAction = ratingForm.getAttribute('action');
            const csrfToken = ratingForm.querySelector('input[name="csrfmiddlewaretoken"]')?.value ||
                             movieDoc.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                             movieDoc.querySelector('meta[name="csrfmiddlewaretoken"]')?.getAttribute('content');
            
            if (!csrfToken) {
                throw new Error('No CSRF token found on movie page');
            }
            
            console.log(`Letterboxd Quick Rate: Found CSRF token and form action: ${formAction}`);
            
            // Submit the rating using the form action
            const ratingResponse = await fetch(formAction, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': `https://letterboxd.com/film/${slug}/`,
                    'Origin': 'https://letterboxd.com'
                },
                body: `rating=${stars}&csrfmiddlewaretoken=${csrfToken}`,
                credentials: 'include'
            });
            
            console.log(`Letterboxd Quick Rate: Rating response status: ${ratingResponse.status}`);
            
            if (ratingResponse.ok || ratingResponse.status === 302 || ratingResponse.status === 200) {
                console.log(`Letterboxd Quick Rate: Successfully rated ${slug} with ${stars} stars`);
                showRatingFeedback(true, stars, slug);
                return true;
            } else {
                const responseText = await ratingResponse.text();
                console.error(`Letterboxd Quick Rate: Rating failed with status ${ratingResponse.status}:`, responseText);
                throw new Error(`HTTP ${ratingResponse.status}`);
            }
        } catch (error) {
            console.error('Letterboxd Quick Rate: Error rating movie directly:', error);
            showRatingFeedback(false, stars, slug);
            return false;
        }
    }
    
    function showRatingFeedback(success, stars, slug) {
        let feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${success ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 100000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        feedback.textContent = success ? 
            `✓ Rated with ${stars} star${stars !== 1 ? 's' : ''}` : 
            `⚠ Rating failed - will open movie page`;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

    // --- UI ---
    function showModal(movie, onRate, onSkip, onClose, progress) {
        let modal = document.createElement('div');
        modal.id = 'lb-quickrate-modal';
        modal.innerHTML = `
            <div id="lb-quickrate-close">&times;</div>
            <div id="lb-quickrate-card">
                <h2>${movie.title}</h2>
                <img src="${movie.poster}" alt="${movie.title} poster" onerror="this.src='https://via.placeholder.com/250x375/333/666?text=No+Poster'"/>
                <form class="rating-stars">
                    <input type="radio" id="star5" name="rating" value="5" />
                    <label for="star5" title="5 stars"></label>
                    <input type="radio" id="star4" name="rating" value="4" />
                    <label for="star4" title="4 stars"></label>
                    <input type="radio" id="star3" name="rating" value="3" />
                    <label for="star3" title="3 stars"></label>
                    <input type="radio" id="star2" name="rating" value="2" />
                    <label for="star2" title="2 stars"></label>
                    <input type="radio" id="star1" name="rating" value="1" />
                    <label for="star1" title="1 star"></label>
                </form>
                <div id="lb-quickrate-buttons">
                    <button id="lb-quickrate-skip">Skip</button>
                    <button id="lb-quickrate-rate">Rate</button>
                </div>
                <div id="lb-quickrate-progress" style="width: ${progress}%"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Letterboxd-style star rating system with radio buttons
        let selectedRating = 0;
        let ratingForm = modal.querySelector('.rating-stars');
        let radioInputs = ratingForm.querySelectorAll('input[type="radio"]');
        
        // Handle radio button changes
        radioInputs.forEach(radio => {
            radio.addEventListener('change', (e) => {
                selectedRating = parseInt(e.target.value);
                console.log(`Letterboxd Quick Rate: Selected rating: ${selectedRating}`);
            });
        });
        
        modal.querySelector('#lb-quickrate-rate').addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (selectedRating > 0) {
                const success = await rateMovieDirectly(movie.slug, selectedRating);
                if (success) {
                    onRate(selectedRating);
                } else {
                    // Fallback: open movie page
                    window.open(`https://letterboxd.com/film/${movie.slug}/`, '_blank');
                    onRate(selectedRating);
                }
                modal.remove();
            }
        });
        
        modal.querySelector('#lb-quickrate-skip').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onSkip(); 
            modal.remove(); 
        });
        
        modal.querySelector('#lb-quickrate-close').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose(); 
            modal.remove(); 
        });
    }

    // --- MAIN LOGIC ---
    function startQuickRate() {
        console.log('Letterboxd Quick Rate: Starting quick rating session');

        // Show loading message
        let loadingModal = document.createElement('div');
        loadingModal.id = 'lb-quickrate-modal';
        loadingModal.innerHTML = `
            <div id="lb-quickrate-card">
                <h2>Loading Movies...</h2>
                <p>Extracting movies from current page...</p>
            </div>
        `;
        document.body.appendChild(loadingModal);

        // Extract movies from current page
        let movies = extractMoviesFromPage();
        
        loadingModal.remove();
        
        if (movies.length === 0) {
            alert('No movies found on this page. Please navigate to a page with movies (like your films page, popular films, or any movie list) and try again.');
            return;
        }

        // Dedupe by slug
        let seen = new Set();
        movies = movies.filter(m => m.slug && !seen.has(m.slug) && seen.add(m.slug));
        
        // Shuffle the movies
        for (let i = movies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [movies[i], movies[j]] = [movies[j], movies[i]];
        }

        let i = 0;
        let rated = 0;
        let skipped = 0;
        
        function next() {
            if (i >= movies.length) {
                alert(`Quick Rate Complete!\n\nRated: ${rated} movies\nSkipped: ${skipped} movies\nTotal: ${movies.length} movies`);
                return;
            }
            
            let movie = movies[i++];
            let progress = (i / movies.length) * 100;
            
            showModal(movie,
                stars => { 
                    rated++;
                    next(); 
                },
                () => { 
                    skipped++;
                    next(); 
                },
                () => { 
                    alert(`Quick Rate Stopped\n\nRated: ${rated} movies\nSkipped: ${skipped} movies\nRemaining: ${movies.length - i} movies`);
                },
                progress
            );
        }
        next();
    }

    // --- NAV BUTTON ---
    function addQuickRateButton() {
        setTimeout(() => {
            // Remove any existing buttons first
            let existingButtons = document.querySelectorAll('.lb-quickrate-btn');
            existingButtons.forEach(btn => {
                if (btn.parentNode) {
                    btn.parentNode.removeChild(btn);
                }
            });
            
            // Create floating button
            let btn = document.createElement('div');
            btn.className = 'lb-quickrate-floating';
            btn.innerHTML = '<a class="lb-quickrate-btn">Quick Rate</a>';
            btn.onclick = startQuickRate;
            document.body.appendChild(btn);
            console.log('Letterboxd Quick Rate: Floating button added');
        }, 1000);
    }

    // --- INIT ---
    function init() {
        try {
            console.log('Letterboxd Quick Rate: Version 3.3.0 - Initializing...');
            
            addStyles();
            console.log('Letterboxd Quick Rate: Styles added successfully');
            
            addQuickRateButton();
            
        } catch (error) {
            console.error('Letterboxd Quick Rate: Error during initialization:', error);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(); 