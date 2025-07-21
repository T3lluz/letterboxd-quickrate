// ==UserScript==
// @name         Letterboxd Quick Rate (Tinder Style)
// @namespace    https://github.com/T3lluz/letterboxd-quickrate
// @version      2.3.0
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
            
            #lb-quickrate-stars { 
                margin: 24px 0;
                display: flex;
                justify-content: center;
                gap: 4px;
                flex-wrap: wrap;
            }
            
            #lb-quickrate-stars .star {
                font-size: 28px; 
                margin: 0 2px; 
                background: none; 
                border: none; 
                color: #666; 
                cursor: pointer;
                transition: all 0.2s ease;
                padding: 4px;
                min-width: 24px;
                position: relative;
                font-family: 'Georgia', serif;
            }
            
            #lb-quickrate-stars .star:hover,
            #lb-quickrate-stars .star.hover {
                color: #ffcc00;
                transform: scale(1.1);
            }
            
            #lb-quickrate-stars .star.active {
                color: #ffcc00;
            }
            
            #lb-quickrate-stars .star.half {
                color: #ffcc00;
            }
            
            #lb-quickrate-stars .star.half::before {
                content: '★';
                position: absolute;
                left: 0;
                top: 0;
                width: 50%;
                overflow: hidden;
                color: #ffcc00;
            }
            
            #lb-quickrate-stars .star.half::after {
                content: '☆';
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                color: #666;
            }
            
            #lb-quickrate-buttons {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-top: 20px;
            }
            
            #lb-quickrate-close:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
                transform: scale(1.1);
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
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
            
            #lb-quickrate-next {
                background-color: #ff6b35;
                color: white;
            }
            
            #lb-quickrate-next:hover {
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
            
            .lb-quickrate-btn:active {
                transform: translateY(0);
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
        `;
        document.head.appendChild(style);
    }

    // --- UTILS ---
    function getUsername() {
        // Try URL detection for any username context
        let currentPath = window.location.pathname;
        let match = currentPath.match(/^\/([^\/]+)\/films/);
        if (match && match[1]) {
            console.log('Letterboxd Quick Rate: Found username from URL:', match[1]);
            return match[1];
        }
        
        console.log('Letterboxd Quick Rate: No username found');
        return null;
    }

    // --- UI ---
    function showModal(movie, onRate, onSkip, onClose, progress) {
        let modal = document.createElement('div');
        modal.id = 'lb-quickrate-modal';
        modal.innerHTML = `
            <div id="lb-quickrate-close" style="
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 24px;
                color: #999;
                cursor: pointer;
                z-index: 1000;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            ">&times;</div>
            <div id="lb-quickrate-card">
                <h2>${movie.title}</h2>
                <img src="${movie.poster}" alt="${movie.title} poster" onerror="this.src='https://via.placeholder.com/250x375/333/666?text=No+Poster'"/>
                <div id="lb-quickrate-stars">
                    ${[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(n => 
                        `<button class="star" data-star="${n}" title="${n} star${n !== 1 ? 's' : ''}">☆</button>`
                    ).join('')}
                </div>
                <div id="lb-quickrate-buttons">
                    <button id="lb-quickrate-skip">Skip</button>
                    <button id="lb-quickrate-rate">Rate</button>
                    <button id="lb-quickrate-next">Next</button>
                </div>
                <div id="lb-quickrate-progress" style="width: ${progress}%"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Better star rating system
        let stars = modal.querySelectorAll('.star');
        let selectedRating = 0;
        
        stars.forEach((star) => {
            let starValue = parseFloat(star.dataset.star);
            
            star.addEventListener('mouseenter', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Clear all stars
                stars.forEach(s => {
                    s.textContent = '☆';
                    s.classList.remove('active', 'half');
                });
                
                // Fill stars up to current hover
                stars.forEach((s) => {
                    let sValue = parseFloat(s.dataset.star);
                    if (sValue <= starValue) {
                        if (sValue % 1 === 0) {
                            s.textContent = '★';
                            s.classList.add('active');
                        } else {
                            s.textContent = '★';
                            s.classList.add('half');
                        }
                    }
                });
            });
            
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectedRating = starValue;
                
                // Update visual feedback
                stars.forEach(s => {
                    s.textContent = '☆';
                    s.classList.remove('active', 'half');
                });
                
                stars.forEach((s) => {
                    let sValue = parseFloat(s.dataset.star);
                    if (sValue <= selectedRating) {
                        if (sValue % 1 === 0) {
                            s.textContent = '★';
                            s.classList.add('active');
                        } else {
                            s.textContent = '★';
                            s.classList.add('half');
                        }
                    }
                });
            });
        });
        
        modal.querySelector('#lb-quickrate-stars').addEventListener('mouseleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Show selected rating if any
            if (selectedRating > 0) {
                stars.forEach(s => {
                    s.textContent = '☆';
                    s.classList.remove('active', 'half');
                });
                
                stars.forEach((s) => {
                    let sValue = parseFloat(s.dataset.star);
                    if (sValue <= selectedRating) {
                        if (sValue % 1 === 0) {
                            s.textContent = '★';
                            s.classList.add('active');
                        } else {
                            s.textContent = '★';
                            s.classList.add('half');
                        }
                    }
                });
            }
        });
        
        modal.querySelector('#lb-quickrate-rate').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (selectedRating > 0) {
                onRate(selectedRating);
                modal.remove();
            }
        });
        
        modal.querySelector('#lb-quickrate-skip').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onSkip(); 
            modal.remove(); 
        });
        
        modal.querySelector('#lb-quickrate-next').addEventListener('click', (e) => {
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

    // --- FETCH MOVIES ---
    function fetchMovies(callback) {
        console.log('Letterboxd Quick Rate: Starting movie extraction...');
        
        // Try to fetch from Letterboxd's Top All Time list first
        fetchTopAllTimeMovies(callback);
    }
    
    // Fetch from Letterboxd's popular lists
    function fetchTopAllTimeMovies(callback) {
        console.log('Letterboxd Quick Rate: Fetching from popular lists...');
        
        // Try multiple popular lists in order of preference
        const popularUrls = [
            'https://letterboxd.com/films/',
            'https://letterboxd.com/films/popular/',
            'https://letterboxd.com/films/trending/',
            'https://letterboxd.com/films/this-week/',
            'https://letterboxd.com/films/this-month/',
            'https://letterboxd.com/films/this-year/',
            'https://letterboxd.com/films/all-time/'
        ];
        
        tryFetchFromUrls(popularUrls, 0, callback);
    }
    
    // Recursively try URLs until one works
    function tryFetchFromUrls(urls, index, callback) {
        if (index >= urls.length) {
            console.log('Letterboxd Quick Rate: All popular lists failed, falling back to current page...');
            extractFromCurrentPage(callback);
            return;
        }
        
        const url = urls[index];
        console.log(`Letterboxd Quick Rate: Trying ${url}...`);
        
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Create a temporary div to parse the HTML
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            
            let movies = [];
            
            // Find all movie links on the page - try multiple approaches
            let movieLinks = doc.querySelectorAll('a[href*="/film/"]');
            console.log(`Letterboxd Quick Rate: Found ${movieLinks.length} movie links on ${url}`);
            
            movieLinks.forEach((link, index) => {
                try {
                    let href = link.href;
                    let slugMatch = href.match(/\/film\/([^\/\?]+)/);
                    
                    if (slugMatch) {
                        let slug = slugMatch[1];
                        
                        // Get title from multiple sources
                        let title = link.getAttribute('data-original-title') ||
                                   link.getAttribute('title') ||
                                   link.querySelector('.frame-title')?.textContent?.trim() ||
                                   link.querySelector('.film-title')?.textContent?.trim() ||
                                   link.querySelector('.poster-title')?.textContent?.trim() ||
                                   link.querySelector('.poster-title')?.textContent?.trim();
                        
                        // If still no title, generate from slug
                        if (!title || title.includes('Watched by') || title.includes('members')) {
                            title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        }
                        
                        // Get poster image - try EVERYTHING
                        let posterUrl = null;
                        
                        // Method 1: Direct img in link
                        let img = link.querySelector('img');
                        if (img) {
                            posterUrl = img.src || 
                                       img.getAttribute('data-src') ||
                                       img.getAttribute('data-srcset')?.split(' ')[0] ||
                                       img.getAttribute('data-original');
                        }
                        
                        // Method 2: Look in parent containers
                        if (!posterUrl) {
                            let container = link.closest('.poster-container, .film-poster, .poster, .poster-list-item');
                            if (container) {
                                let containerImg = container.querySelector('img');
                                if (containerImg) {
                                    posterUrl = containerImg.src || 
                                               containerImg.getAttribute('data-src') ||
                                               containerImg.getAttribute('data-srcset')?.split(' ')[0] ||
                                               containerImg.getAttribute('data-original');
                                }
                            }
                        }
                        
                        // Method 3: Look for any img with the slug in its src
                        if (!posterUrl) {
                            let allImgs = doc.querySelectorAll('img[src*="' + slug + '"]');
                            if (allImgs.length > 0) {
                                posterUrl = allImgs[0].src;
                            }
                        }
                        
                        // Method 4: Try to construct poster URL from slug
                        if (!posterUrl) {
                            posterUrl = `https://a.ltrbxd.com/resized/film-poster/${slug}-0-600-0-900-crop.jpg`;
                        }
                        
                        // Method 5: Fallback placeholder
                        if (!posterUrl) {
                            posterUrl = 'https://via.placeholder.com/250x375/333/666?text=No+Poster';
                        }
                        
                        // Only add if we have a valid slug and title
                        if (slug && title && !movies.find(m => m.slug === slug)) {
                            movies.push({ title, slug, poster: posterUrl });
                            console.log(`Letterboxd Quick Rate: Added movie ${index + 1}: "${title}" (${slug}) - Poster: ${posterUrl}`);
                        }
                    }
                } catch (error) {
                    console.error('Letterboxd Quick Rate: Error processing movie link:', error);
                }
            });
            
            console.log(`Letterboxd Quick Rate: Total movies extracted from ${url}:`, movies.length);
            
            // If we got movies, use them
            if (movies.length > 0) {
                callback(movies);
            } else {
                // Try next URL
                tryFetchFromUrls(urls, index + 1, callback);
            }
        })
        .catch(error => {
            console.error(`Letterboxd Quick Rate: Error fetching ${url}:`, error);
            // Try next URL
            tryFetchFromUrls(urls, index + 1, callback);
        });
    }
    
    // Fallback: extract from current page
    function extractFromCurrentPage(callback) {
        let movies = [];
        
        // Find all movie links on the current page
        let movieLinks = document.querySelectorAll('a[href*="/film/"]');
        console.log('Letterboxd Quick Rate: Found', movieLinks.length, 'movie links on current page');
        
        movieLinks.forEach((link, index) => {
            try {
                // Get the href and extract slug
                let href = link.href;
                let slugMatch = href.match(/\/film\/([^\/\?]+)/);
                
                if (slugMatch) {
                    let slug = slugMatch[1];
                    
                    // Get title from multiple sources
                    let title = link.getAttribute('data-original-title') ||
                               link.getAttribute('title') ||
                               link.querySelector('.frame-title')?.textContent?.trim() ||
                               link.querySelector('.film-title')?.textContent?.trim();
                    
                    // If still no title, generate from slug
                    if (!title || title.includes('Watched by') || title.includes('members')) {
                        title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    }
                    
                    // Get poster image
                    let img = link.querySelector('img');
                    let poster = img?.src ||
                               img?.getAttribute('data-src') ||
                               img?.getAttribute('data-srcset')?.split(' ')[0] ||
                               'https://via.placeholder.com/250x375/333/666?text=No+Poster';
                    
                    // Only add if we have a valid slug and title
                    if (slug && title && !movies.find(m => m.slug === slug)) {
                        movies.push({ title, slug, poster });
                        console.log(`Letterboxd Quick Rate: Added movie ${index + 1}: "${title}" (${slug})`);
                    }
                }
            } catch (error) {
                console.error('Letterboxd Quick Rate: Error processing movie link:', error);
            }
        });
        
        console.log('Letterboxd Quick Rate: Total movies extracted from current page:', movies.length);
        callback(movies);
    }
    


    // --- RATING FUNCTION ---
    function rateMovie(slug, stars) {
        console.log(`Letterboxd Quick Rate: Rating movie ${slug} with ${stars} stars`);
        
        // Try to use Letterboxd's actual rating system
        tryLetterboxdRating(slug, stars);
    }
    
    // Try Letterboxd's actual rating system
    function tryLetterboxdRating(slug, stars) {
        // First, try to get the movie page to extract the rating form
        fetch(`https://letterboxd.com/film/${slug}/`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.text())
        .then(html => {
            // Create a temporary div to parse the HTML
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            
            // Look for the rating form
            let ratingForm = doc.querySelector('form[action*="/rate/"]');
            if (ratingForm) {
                // Extract the action URL and any hidden fields
                let action = ratingForm.getAttribute('action');
                let csrfToken = ratingForm.querySelector('input[name="csrfmiddlewaretoken"]')?.value || '';
                
                // Submit the rating
                submitRating(action, csrfToken, stars, slug);
            } else {
                // Fallback: open movie page
                openMoviePage(slug, stars);
            }
        })
        .catch(error => {
            console.error('Letterboxd Quick Rate: Error fetching movie page:', error);
            openMoviePage(slug, stars);
        });
    }
    
    // Submit rating to Letterboxd
    function submitRating(action, csrfToken, stars, slug) {
        let formData = new FormData();
        formData.append('rating', stars.toString());
        formData.append('_method', 'POST');
        if (csrfToken) {
            formData.append('csrfmiddlewaretoken', csrfToken);
        }
        
        fetch(action, {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            console.log(`Letterboxd Quick Rate: Rating response status: ${response.status}`);
            if (response.ok || response.status === 302 || response.status === 200) {
                console.log(`Letterboxd Quick Rate: Successfully rated ${slug} with ${stars} stars`);
                showRatingFeedback(true, stars);
            } else {
                console.error(`Letterboxd Quick Rate: Failed to rate movie: ${response.status}`);
                openMoviePage(slug, stars);
            }
        })
        .catch(error => {
            console.error('Letterboxd Quick Rate: Error rating movie:', error);
            openMoviePage(slug, stars);
        });
    }
    
    // Fallback: open movie page
    function openMoviePage(slug, stars) {
        let movieURL = `https://letterboxd.com/film/${slug}/`;
        window.open(movieURL, '_blank');
        showRatingFeedback(true, stars);
        localStorage.setItem(`lb_rating_${slug}`, stars.toString());
    }
    
    // Get CSRF token from page
    function getCSRFToken() {
        let token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                   document.querySelector('input[name="csrfmiddlewaretoken"]')?.value ||
                   '';
        return token;
    }
    
    function showRatingFeedback(success, stars) {
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
            `⚠ Rating failed - opened in new tab`;
        
        document.body.appendChild(feedback);
        
        // Remove after 3 seconds
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

    // --- MAIN LOGIC ---
    function startQuickRate() {
        console.log('Letterboxd Quick Rate: Starting quick rating session');

        // Show loading message
        let loadingModal = document.createElement('div');
        loadingModal.id = 'lb-quickrate-modal';
        loadingModal.innerHTML = `
            <div id="lb-quickrate-card">
                <h2>Loading Popular Movies...</h2>
                <p>Fetching the most popular films on Letterboxd...</p>
            </div>
        `;
        document.body.appendChild(loadingModal);

        fetchMovies(allMovies => {
            loadingModal.remove();
            
            if (allMovies.length === 0) {
                alert('No movies found. Please navigate to a page with movies (like your films page, popular films, or any movie list) and try again.');
                return;
            }

            // Dedupe by slug
            let seen = new Set();
            let movies = allMovies.filter(m => m.slug && !seen.has(m.slug) && seen.add(m.slug));
            
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
                        rateMovie(movie.slug, stars); 
                        rated++;
                        next(); 
                    },
                    () => { 
                        skipped++;
                        next(); 
                    },
                    () => { 
                        // User closed the modal
                        alert(`Quick Rate Stopped\n\nRated: ${rated} movies\nSkipped: ${skipped} movies\nRemaining: ${movies.length - i} movies`);
                    },
                    progress
                );
            }
            next();
        });
    }

    // --- NAV BUTTON ---
    function addQuickRateButton() {
        // Only create the floating button - remove all navigation button logic
        setTimeout(() => {
            // Remove any existing buttons first
            let existingButtons = document.querySelectorAll('.lb-quickrate-btn');
            existingButtons.forEach(btn => {
                if (btn.parentNode) {
                    btn.parentNode.removeChild(btn);
                }
            });
            
            // Create only the floating button
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
            // Force cache refresh and version check
            console.log('Letterboxd Quick Rate: Version 2.0.0 - Cache busting...');
            
            // Add styles first
            addStyles();
            console.log('Letterboxd Quick Rate: Styles added successfully');
            
            // Add button
            addQuickRateButton();
            
        } catch (error) {
            console.error('Letterboxd Quick Rate: Error during initialization:', error);
            // Fallback: create a simple floating button
            let btn = document.createElement('div');
            btn.style.cssText = `
                position: fixed;
                bottom: 32px;
                right: 32px;
                z-index: 99998;
                background: #ff8000;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(255, 128, 0, 0.3);
            `;
            btn.textContent = 'Quick Rate v2.0.0';
            btn.onclick = startQuickRate;
            document.body.appendChild(btn);
            console.log('Letterboxd Quick Rate: Fallback button added');
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(); 