// ==UserScript==
// @name         Letterboxd Quick Rate (Tinder Style)
// @namespace    https://github.com/T3lluz/letterboxd-quickrate
// @version      1.6.0
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
            
            #lb-quickrate-stars button {
                font-size: 1.8em; 
                margin: 0 2px; 
                background: none; 
                border: none; 
                color: #333; 
                cursor: pointer;
                transition: all 0.2s ease;
                filter: grayscale(1);
                padding: 2px;
                min-width: 24px;
            }
            
            #lb-quickrate-stars button:hover {
                color: #ffcc00;
                filter: grayscale(0);
                transform: scale(1.1);
            }
            
            #lb-quickrate-stars button.active {
                color: #ffcc00;
                filter: grayscale(0);
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
                        `<button data-star="${n}" title="${n} star${n !== 1 ? 's' : ''}" style="pointer-events: auto;">${n % 1 === 0 ? '&#9733;' : '&#9734;'}</button>`
                    ).join('')}
                </div>
                <div id="lb-quickrate-buttons">
                    <button id="lb-quickrate-skip">Skip</button>
                    <button id="lb-quickrate-next">Next</button>
                </div>
                <div id="lb-quickrate-progress" style="width: ${progress}%"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add star hover effects with half-stars
        let stars = modal.querySelectorAll('button[data-star]');
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', (e) => {
                e.preventDefault();
                e.stopPropagation();
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                onRate(parseFloat(star.dataset.star));
                modal.remove();
            });
        });
        
        modal.querySelector('#lb-quickrate-stars').addEventListener('mouseleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            stars.forEach(s => s.classList.remove('active'));
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
        
        // First, try to extract from current page
        let currentPageMovies = extractMoviesFromCurrentPage();
        console.log('Letterboxd Quick Rate: Found', currentPageMovies.length, 'movies on current page');
        
        if (currentPageMovies.length >= 10) {
            console.log('Letterboxd Quick Rate: Enough movies from current page, using those');
            callback(currentPageMovies);
            return;
        }
        
        // If not enough movies on current page, try to navigate to popular films
        console.log('Letterboxd Quick Rate: Not enough movies on current page, trying to navigate to popular films...');
        
        // Create a hidden iframe to load popular films
        let iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'https://letterboxd.com/films/popular/this/all-time/';
        
        iframe.onload = function() {
            try {
                console.log('Letterboxd Quick Rate: Iframe loaded, extracting movies...');
                let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                // Extract movies from iframe
                let iframeMovies = extractMoviesFromDocument(iframeDoc, 'iframe');
                console.log('Letterboxd Quick Rate: Found', iframeMovies.length, 'movies in iframe');
                
                // Combine movies
                let allMovies = [...currentPageMovies];
                iframeMovies.forEach(movie => {
                    if (!allMovies.find(m => m.slug === movie.slug)) {
                        allMovies.push(movie);
                    }
                });
                
                console.log('Letterboxd Quick Rate: Total movies found:', allMovies.length);
                callback(allMovies);
                
            } catch (error) {
                console.error('Letterboxd Quick Rate: Error extracting from iframe:', error);
                callback(currentPageMovies);
            } finally {
                iframe.remove();
            }
        };
        
        iframe.onerror = function() {
            console.error('Letterboxd Quick Rate: Failed to load iframe');
            callback(currentPageMovies);
            iframe.remove();
        };
        
        document.body.appendChild(iframe);
    }
    
    function extractMoviesFromDocument(doc, source) {
        console.log(`Letterboxd Quick Rate: Extracting movies from ${source}...`);
        let movies = [];
        
        // Try multiple selectors for maximum compatibility
        let selectors = [
            'a[href*="/film/"]',
            '.poster-list a[href*="/film/"]',
            '.poster-list .film-poster',
            '.poster-list li',
            '.poster-list .poster',
            '.poster-list .poster-container',
            '.poster-list .poster-view',
            '.poster-list .poster-view a',
            '.poster-list .poster-view .poster',
            '.poster-list .poster-view .poster a',
            '.poster-list .poster-view .poster img',
            '.poster-list .poster-view .poster-container',
            '.poster-list .poster-view .poster-container a',
            '.poster-list .poster-view .poster-container img',
            '.poster-list .poster-view .poster-container .poster',
            '.poster-list .poster-view .poster-container .poster a',
            '.poster-list .poster-view .poster-container .poster img',
            '.poster-list .poster-view .poster-container .poster .poster-title',
            '.poster-list .poster-view .poster-container .poster .poster-title a',
            '.poster-list .poster-view .poster-container .poster .poster-title img',
            '.poster-list .poster-view .poster-container .poster .poster-title .poster-title',
            '.poster-list .poster-view .poster-container .poster .poster-title .poster-title a',
            '.poster-list .poster-view .poster-container .poster .poster-title .poster-title img',
            '.poster-list .poster-view .poster-container .poster .poster-title .poster-title .poster-title',
            '.poster-list .poster-view .poster-container .poster .poster-title .poster-title .poster-title a',
            '.poster-list .poster-view .poster-container .poster .poster-title .poster-title .poster-title img'
        ];
        
        let elements = [];
        for (let selector of selectors) {
            let found = doc.querySelectorAll(selector);
            console.log(`Letterboxd Quick Rate: Selector "${selector}" found ${found.length} elements in ${source}`);
            if (found.length > 0) {
                elements = found;
                break;
            }
        }
        
        console.log(`Letterboxd Quick Rate: Processing ${elements.length} elements from ${source}`);
        
        elements.forEach((element, index) => {
            try {
                console.log(`Letterboxd Quick Rate: Processing element ${index + 1} from ${source}:`, element.outerHTML.substring(0, 200));
                
                // Get film slug from multiple sources
                let slug = element.getAttribute('data-film-slug');
                if (!slug) {
                    // Try to find any link with /film/ in it
                    let links = element.querySelectorAll('a[href*="/film/"]');
                    for (let link of links) {
                        let href = link.href;
                        let match = href.match(/\/film\/([^\/\?]+)/);
                        if (match) {
                            slug = match[1];
                            console.log(`Letterboxd Quick Rate: Found slug from link: ${slug}`);
                            break;
                        }
                    }
                }
                
                // If still no slug, try the element itself
                if (!slug && element.href) {
                    let match = element.href.match(/\/film\/([^\/\?]+)/);
                    if (match) {
                        slug = match[1];
                        console.log(`Letterboxd Quick Rate: Found slug from element href: ${slug}`);
                    }
                }
                
                // Get title from multiple sources
                let title = element.getAttribute('data-film-name') || 
                           element.getAttribute('data-original-title') ||
                           element.getAttribute('title') ||
                           element.querySelector('.frame-title')?.textContent?.trim() ||
                           element.querySelector('img')?.alt ||
                           element.querySelector('.poster-title')?.textContent?.trim() ||
                           element.querySelector('h3')?.textContent?.trim() ||
                           element.querySelector('a')?.title ||
                           element.querySelector('.poster-title a')?.textContent?.trim() ||
                           element.querySelector('.poster-title .poster-title')?.textContent?.trim() ||
                           'Unknown Title';
                
                // Get poster image
                let posterImg = element.querySelector('img')?.src ||
                               element.querySelector('img')?.getAttribute('data-src') ||
                               element.querySelector('img')?.getAttribute('data-srcset')?.split(' ')[0] ||
                               element.querySelector('.poster img')?.src ||
                               element.querySelector('.poster img')?.getAttribute('data-src') ||
                               element.querySelector('.poster img')?.getAttribute('data-srcset')?.split(' ')[0] ||
                               'https://via.placeholder.com/250x375/333/666?text=No+Poster';
                
                console.log(`Letterboxd Quick Rate: Extracted from ${source} - Title: "${title}", Slug: "${slug}", Image: "${posterImg}"`);
                
                // If title is still unknown, try to extract from slug
                if (title === 'Unknown Title' && slug && slug.length > 0) {
                    title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    console.log(`Letterboxd Quick Rate: Generated title from slug: "${title}"`);
                }
                
                if (slug && slug.length > 0 && title !== 'Unknown Title' && title.length > 0) {
                    movies.push({ title, slug, poster: posterImg });
                    console.log(`Letterboxd Quick Rate: Successfully added movie from ${source}: ${title} (${slug})`);
                } else {
                    console.log(`Letterboxd Quick Rate: Skipping movie from ${source} - invalid data: title="${title}", slug="${slug}"`);
                }
            } catch (error) {
                console.error(`Letterboxd Quick Rate: Error parsing element from ${source}:`, error);
            }
        });
        
        return movies;
    }
    
    // Extract movies from current page
    function extractMoviesFromCurrentPage() {
        console.log('Letterboxd Quick Rate: Extracting movies from current page...');
        return extractMoviesFromDocument(document, 'current page');
    }

    // --- RATING FUNCTION ---
    function rateMovie(slug, stars) {
        console.log(`Letterboxd Quick Rate: Rating movie ${slug} with ${stars} stars`);
        
        // Create the rating URL
        let ratingURL = `https://letterboxd.com/film/${slug}/rate/${stars}/`;
        
        // Use fetch to submit the rating
        fetch(ratingURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include' // Include cookies for authentication
        })
        .then(response => {
            console.log(`Letterboxd Quick Rate: Rating response status: ${response.status}`);
            if (response.ok) {
                console.log(`Letterboxd Quick Rate: Successfully rated ${slug} with ${stars} stars`);
                // Show success feedback
                showRatingFeedback(true, stars);
            } else {
                console.error(`Letterboxd Quick Rate: Failed to rate movie: ${response.status}`);
                showRatingFeedback(false, stars);
            }
        })
        .catch(error => {
            console.error('Letterboxd Quick Rate: Error rating movie:', error);
            // Fallback: open in new tab
            window.open(ratingURL, '_blank');
            showRatingFeedback(false, stars);
        });
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
            btn.textContent = 'Quick Rate';
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