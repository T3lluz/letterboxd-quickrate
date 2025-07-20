// ==UserScript==
// @name         Letterboxd Quick Rate (Tinder Style)
// @namespace    https://github.com/T3lluz/letterboxd-quickrate
// @version      1.1.0
// @description  Quickly rate movies from your watched and popular films with a swipe-like interface on Letterboxd
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
        console.log('Letterboxd Quick Rate: Detecting username...');
        
        // Get from current URL - this is the most reliable method
        let currentPath = window.location.pathname;
        console.log('Letterboxd Quick Rate: Current path:', currentPath);
        
        // Extract username from /username/films/ pattern
        let match = currentPath.match(/^\/([^\/]+)\/films/);
        if (match && match[1]) {
            console.log('Letterboxd Quick Rate: Found username from URL:', match[1]);
            return match[1];
        }
        
        // Fallback: try to get from any link that looks like a username
        let links = document.querySelectorAll('a[href*="/"]');
        for (let link of links) {
            let href = link.href;
            let urlMatch = href.match(/letterboxd\.com\/([^\/\?]+)/);
            if (urlMatch && urlMatch[1] && 
                urlMatch[1].length > 2 && 
                !['films', 'members', 'lists', 'request-password-reset', 'sign-in', 'sign-up', 'about', 'help', 'contact', 'popular', 'this', 'all-time'].includes(urlMatch[1])) {
                console.log('Letterboxd Quick Rate: Found username from link:', urlMatch[1]);
                return urlMatch[1];
            }
        }
        
        console.log('Letterboxd Quick Rate: Could not detect username');
        return null;
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
                <div id="lb-quickrate-stars">
                    ${[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(n => 
                        `<button data-star="${n}" title="${n} star${n !== 1 ? 's' : ''}">${n % 1 === 0 ? '&#9733;' : '&#9734;'}</button>`
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
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('click', () => {
                onRate(parseFloat(star.dataset.star));
                modal.remove();
            });
        });
        
        modal.querySelector('#lb-quickrate-stars').addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('active'));
        });
        
        modal.querySelector('#lb-quickrate-skip').onclick = () => { 
            onSkip(); 
            modal.remove(); 
        };
        
        modal.querySelector('#lb-quickrate-next').onclick = () => { 
            onSkip(); 
            modal.remove(); 
        };
        
        modal.querySelector('#lb-quickrate-close').onclick = () => { 
            onClose(); 
            modal.remove(); 
        };
    }

    // --- FETCH MOVIES ---
    function fetchMovies(username, callback) {
        console.log('Letterboxd Quick Rate: Starting fetchMovies for username:', username);
        let movies = [];

        // Simple function to extract movies from current page
        function extractMoviesFromCurrentPage() {
            console.log('Letterboxd Quick Rate: Extracting movies from current page...');
            
            // Look for all movie links on the page
            let movieLinks = document.querySelectorAll('a[href*="/film/"]');
            console.log('Letterboxd Quick Rate: Found', movieLinks.length, 'movie links');
            
            let extracted = [];
            movieLinks.forEach(link => {
                let href = link.getAttribute('href');
                if (href && href.includes('/film/')) {
                    // Extract slug from href
                    let slug = href.replace('/film/', '').replace(/\/$/, '');
                    
                    // Get title from various sources
                    let title = link.getAttribute('title') || 
                               link.querySelector('img')?.alt ||
                               link.textContent?.trim() ||
                               'Unknown Title';
                    
                    // Get poster from img tag
                    let poster = link.querySelector('img')?.src ||
                                link.querySelector('img')?.getAttribute('data-src') ||
                                'https://via.placeholder.com/250x375/333/666?text=No+Poster';
                    
                    // Only add if we have a valid slug and it's not already added
                    if (slug && slug.length > 0 && !extracted.find(m => m.slug === slug)) {
                        extracted.push({ title, slug, poster });
                        console.log('Letterboxd Quick Rate: Found movie:', title, '(', slug, ')');
                    }
                }
            });
            
            console.log('Letterboxd Quick Rate: Extracted', extracted.length, 'unique movies from current page');
            return extracted;
        }

        // Extract from current page first (most reliable)
        let currentMovies = extractMoviesFromCurrentPage();
        movies = movies.concat(currentMovies);
        
        // If we didn't find enough movies, try to fetch popular ones
        if (movies.length < 10) {
            console.log('Letterboxd Quick Rate: Not enough movies found, fetching popular films...');
            fetch('https://letterboxd.com/films/popular/this/all-time/')
                .then(response => response.text())
                .then(html => {
                    let doc = new DOMParser().parseFromString(html, "text/html");
                    let popularLinks = doc.querySelectorAll('a[href*="/film/"]');
                    
                    popularLinks.forEach(link => {
                        let href = link.getAttribute('href');
                        if (href && href.includes('/film/')) {
                            let slug = href.replace('/film/', '').replace(/\/$/, '');
                            let title = link.getAttribute('title') || 
                                       link.querySelector('img')?.alt ||
                                       link.textContent?.trim() ||
                                       'Unknown Title';
                            let poster = link.querySelector('img')?.src ||
                                        link.querySelector('img')?.getAttribute('data-src') ||
                                        'https://via.placeholder.com/250x375/333/666?text=No+Poster';
                            
                            if (slug && slug.length > 0 && !movies.find(m => m.slug === slug)) {
                                movies.push({ title, slug, poster });
                            }
                        }
                    });
                    
                    console.log('Letterboxd Quick Rate: Total movies found:', movies.length);
                    callback(movies);
                })
                .catch(error => {
                    console.error('Failed to fetch popular films:', error);
                    callback(movies);
                });
        } else {
            console.log('Letterboxd Quick Rate: Total movies found:', movies.length);
            callback(movies);
        }
    }

    // --- RATING FUNCTION ---
    function rateMovie(slug, stars) {
        // Open the movie's rate page in a new tab
        window.open(`https://letterboxd.com${slug}rate/${stars}/`, '_blank');
    }

    // --- MAIN LOGIC ---
    function startQuickRate() {
        let username = getUsername();
        if (!username) {
            alert('Could not detect your username. Please make sure you are logged into Letterboxd.');
            return;
        }

        // Show loading message
        let loadingModal = document.createElement('div');
        loadingModal.id = 'lb-quickrate-modal';
        loadingModal.innerHTML = `
            <div id="lb-quickrate-card">
                <h2>Loading Movies...</h2>
                <p>Fetching your watched films and popular movies...</p>
            </div>
        `;
        document.body.appendChild(loadingModal);

        fetchMovies(username, allMovies => {
            loadingModal.remove();
            
            if (allMovies.length === 0) {
                alert('No movies found. Please make sure you have some watched films or try again later.');
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