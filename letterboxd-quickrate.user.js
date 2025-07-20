// ==UserScript==
// @name         Letterboxd Quick Rate (Tinder Style)
// @namespace    https://github.com/T3lluz/letterboxd-quickrate
// @version      1.0.2
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
            }
            
            #lb-quickrate-stars button {
                font-size: 2.5em; 
                margin: 0 8px; 
                background: none; 
                border: none; 
                color: #333; 
                cursor: pointer;
                transition: all 0.2s ease;
                filter: grayscale(1);
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
            
            #lb-quickrate-skip { 
                margin-top: 20px; 
                color: #888; 
                cursor: pointer;
                padding: 12px 24px;
                border: 1px solid #444;
                border-radius: 8px;
                transition: all 0.2s ease;
                display: inline-block;
            }
            
            #lb-quickrate-skip:hover {
                color: #fff;
                border-color: #666;
                background: rgba(255,255,255,0.1);
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
        // Try to get username from navigation
        let userLink = document.querySelector('a[href^="/user/"]');
        if (userLink) {
            let match = userLink.href.match(/letterboxd\.com\/user\/([^/]+)/);
            if (match) return match[1];
        }
        
        // Try to get from profile link
        let profileLink = document.querySelector('a[href*="/profile/"]');
        if (profileLink) {
            let match = profileLink.href.match(/letterboxd\.com\/profile\/([^/]+)/);
            if (match) return match[1];
        }
        
        // Try to get from meta tag
        let meta = document.querySelector('meta[name="twitter:app:url:iphone"]');
        if (meta) {
            let match = meta.content.match(/letterboxd:\/\/profile\/([^/]+)/);
            if (match) return match[1];
        }
        
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
                    ${[1,2,3,4,5].map(n => `<button data-star="${n}" title="${n} star${n > 1 ? 's' : ''}">&#9733;</button>`).join('')}
                </div>
                <div id="lb-quickrate-skip">Skip this movie</div>
                <div id="lb-quickrate-progress" style="width: ${progress}%"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add star hover effects
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
                onRate(parseInt(star.dataset.star));
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
        modal.querySelector('#lb-quickrate-close').onclick = () => { 
            onClose(); 
            modal.remove(); 
        };
    }

    // --- FETCH MOVIES ---
    function fetchMovies(username, callback) {
        let movies = [];
        let loaded = 0;
        let needed = 2;

        // Watched films
        fetch(`https://letterboxd.com/${username}/films/`)
            .then(response => response.text())
            .then(html => {
                try {
                    let doc = new DOMParser().parseFromString(html, "text/html");
                    let watched = Array.from(doc.querySelectorAll('.poster-list .film-poster')).map(el => ({
                        title: el.getAttribute('data-film-name') || el.querySelector('img')?.alt || 'Unknown Title',
                        slug: el.getAttribute('data-film-slug'),
                        poster: el.querySelector('img')?.src || 'https://via.placeholder.com/250x375/333/666?text=No+Poster'
                    })).filter(m => m.slug); // Only include movies with valid slugs
                    movies = movies.concat(watched);
                    console.log('Letterboxd Quick Rate: Fetched', watched.length, 'watched films');
                } catch (e) {
                    console.error('Error parsing watched films:', e);
                }
                if (++loaded === needed) callback(movies);
            })
            .catch(error => {
                console.error('Failed to fetch watched films:', error);
                if (++loaded === needed) callback(movies);
            });

        // Most popular all time
        fetch(`https://letterboxd.com/films/popular/this/all-time/`)
            .then(response => response.text())
            .then(html => {
                try {
                    let doc = new DOMParser().parseFromString(html, "text/html");
                    let popular = Array.from(doc.querySelectorAll('.poster-list .film-poster')).map(el => ({
                        title: el.getAttribute('data-film-name') || el.querySelector('img')?.alt || 'Unknown Title',
                        slug: el.getAttribute('data-film-slug'),
                        poster: el.querySelector('img')?.src || 'https://via.placeholder.com/250x375/333/666?text=No+Poster'
                    })).filter(m => m.slug); // Only include movies with valid slugs
                    movies = movies.concat(popular);
                    console.log('Letterboxd Quick Rate: Fetched', popular.length, 'popular films');
                } catch (e) {
                    console.error('Error parsing popular films:', e);
                }
                if (++loaded === needed) callback(movies);
            })
            .catch(error => {
                console.error('Failed to fetch popular films:', error);
                if (++loaded === needed) callback(movies);
            });
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