// ==UserScript==
// @name         Letterboxd Quick Rate (Tinder Style)
// @namespace    https://github.com/T3lluz/letterboxd-quickrate
// @version      1.3.0
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
        console.log('Letterboxd Quick Rate: Fetching popular movies...');
        
        // Multiple popular movie sources for reliability
        const popularSources = [
            'https://letterboxd.com/films/popular/this/all-time/',
            'https://letterboxd.com/films/popular/this/year/',
            'https://letterboxd.com/films/popular/this/month/'
        ];
        
        function fetchMoviesFromURL(url, source) {
            return fetch(url)
                .then(response => {
                    console.log(`Letterboxd Quick Rate: ${source} response status:`, response.status);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    let doc = new DOMParser().parseFromString(html, "text/html");
                    let extracted = [];
                    
                    // Multiple selectors for maximum compatibility
                    let posters = doc.querySelectorAll('.poster-list .film-poster, .poster-list li, .poster-list .poster, .poster-list a[href*="/film/"]');
                    console.log(`Letterboxd Quick Rate: Found ${posters.length} posters in ${source}`);
                    
                    posters.forEach(poster => {
                        try {
                            // Get film slug from multiple sources
                            let slug = poster.getAttribute('data-film-slug');
                            if (!slug) {
                                let link = poster.querySelector('a[href*="/film/"]') || poster;
                                if (link && link.href) {
                                    let href = link.href;
                                    let match = href.match(/\/film\/([^\/\?]+)/);
                                    if (match) {
                                        slug = match[1];
                                    }
                                }
                            }
                            
                            // Get title from multiple sources
                            let title = poster.getAttribute('data-film-name') || 
                                       poster.querySelector('img')?.alt ||
                                       poster.querySelector('.poster-title')?.textContent?.trim() ||
                                       poster.querySelector('h3')?.textContent?.trim() ||
                                       poster.querySelector('a')?.title ||
                                       'Unknown Title';
                            
                            // Get poster image
                            let posterImg = poster.querySelector('img')?.src ||
                                           poster.querySelector('img')?.getAttribute('data-src') ||
                                           poster.querySelector('img')?.getAttribute('data-srcset')?.split(' ')[0] ||
                                           'https://via.placeholder.com/250x375/333/666?text=No+Poster';
                            
                            if (slug && slug.length > 0 && title !== 'Unknown Title' && title.length > 0) {
                                extracted.push({ title, slug, poster: posterImg });
                                console.log(`Letterboxd Quick Rate: Found movie in ${source}:`, title, '(', slug, ')');
                            }
                        } catch (error) {
                            console.error('Letterboxd Quick Rate: Error parsing poster:', error);
                        }
                    });
                    
                    return extracted;
                })
                .catch(error => {
                    console.error(`Failed to fetch ${source}:`, error);
                    return [];
                });
        }

        // Try multiple sources until we get enough movies
        let allMovies = [];
        let currentSourceIndex = 0;
        
        function tryNextSource() {
            if (currentSourceIndex >= popularSources.length) {
                console.log('Letterboxd Quick Rate: All sources tried, returning', allMovies.length, 'movies');
                callback(allMovies);
                return;
            }
            
            let url = popularSources[currentSourceIndex];
            let sourceName = `popular source ${currentSourceIndex + 1}`;
            currentSourceIndex++;
            
            console.log('Letterboxd Quick Rate: Trying source:', url);
            
            fetchMoviesFromURL(url, sourceName)
                .then(movies => {
                    // Add new movies without duplicates
                    movies.forEach(movie => {
                        if (!allMovies.find(m => m.slug === movie.slug)) {
                            allMovies.push(movie);
                        }
                    });
                    
                    console.log('Letterboxd Quick Rate: Total movies so far:', allMovies.length);
                    
                    // If we have enough movies, stop
                    if (allMovies.length >= 20) {
                        console.log('Letterboxd Quick Rate: Got enough movies, stopping');
                        callback(allMovies);
                    } else {
                        // Try next source
                        setTimeout(tryNextSource, 500);
                    }
                })
                .catch(error => {
                    console.error('Letterboxd Quick Rate: Error with source, trying next:', error);
                    setTimeout(tryNextSource, 500);
                });
        }
        
        tryNextSource();
    }

    // --- RATING FUNCTION ---
    function rateMovie(slug, stars) {
        // Open the movie's rate page in a new tab
        window.open(`https://letterboxd.com${slug}rate/${stars}/`, '_blank');
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
                alert('No movies found. Please try again later.');
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