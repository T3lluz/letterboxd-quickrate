# Letterboxd Quick Rate

🎬 **Quickly rate movies from your watched and popular films with a Tinder-like interface on Letterboxd**

A Greasemonkey/Tampermonkey userscript that adds a "Quick Rate" feature to Letterboxd, allowing you to rapidly rate movies without having to search for each one individually.

## ✨ Features

- **Tinder-like Interface**: Swipe through movies one at a time with a beautiful modal interface
- **Auto-Detection**: Automatically detects your Letterboxd username when logged in
- **Smart Movie Sources**: Pulls from both your watched films and Letterboxd's most popular all-time movies
- **Progress Tracking**: Shows your progress through the rating session
- **Star Rating**: Click 1-5 stars to rate movies instantly
- **Skip Option**: Skip movies you don't want to rate
- **Statistics**: Get a summary of your rating session
- **No Configuration Required**: Works out of the box once installed

## 🚀 Installation

### Prerequisites

1. Install a userscript manager:
   - **Firefox**: [Greasemonkey](https://www.greasespot.net/) or [Tampermonkey](https://www.tampermonkey.net/)
   - **Chrome**: [Tampermonkey](https://www.tampermonkey.net/)
   - **Safari**: [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)

### Install the Script

1. Click the **Install** button below:
   [![Install](https://img.shields.io/badge/Install-Letterboxd%20Quick%20Rate-orange?style=for-the-badge)](https://github.com/T3lluz/letterboxd-quickrate/raw/main/letterboxd-quickrate.user.js)

2. Or manually install:
   - Go to [letterboxd-quickrate.user.js](https://github.com/T3lluz/letterboxd-quickrate/raw/main/letterboxd-quickrate.user.js)
   - Your userscript manager should prompt you to install it
   - Click "Install" in the prompt

## 📖 How to Use

1. **Go to Letterboxd**: Visit [letterboxd.com](https://letterboxd.com) and make sure you're logged in
2. **Find the Button**: Look for the "Quick Rate" button in the navigation bar (or as a floating button)
3. **Start Rating**: Click the button to begin your quick rating session
4. **Rate Movies**:
   - Click 1-5 stars to rate the movie (opens rating page in new tab)
   - Click "Skip this movie" to skip
   - Click the X to stop the session
5. **View Results**: Get a summary of your rating session when complete

## 🎯 How It Works

The script:

1. **Detects your username** from your Letterboxd profile
2. **Fetches movies** from two sources:
   - Your watched films (`/films/`)
   - Letterboxd's most popular all-time movies
3. **Deduplicates and shuffles** the movie list
4. **Presents movies one by one** in a Tinder-like interface
5. **Opens rating pages** in new tabs when you rate movies

## 🎨 Features in Detail

### Smart Movie Selection

- Combines your watched films with popular movies for variety
- Automatically removes duplicates
- Randomizes the order for a fresh experience each time

### Beautiful Interface

- Modern, dark-themed modal design
- Smooth animations and hover effects
- Progress bar showing completion status
- Responsive design that works on different screen sizes

### User Experience

- No configuration required
- Works immediately after installation
- Graceful error handling
- Clear feedback and statistics

## 🔧 Technical Details

- **Compatible with**: Greasemonkey, Tampermonkey, Violentmonkey
- **Browser Support**: Firefox, Chrome, Safari, Edge
- **Auto-updates**: Script will automatically update when new versions are released
- **Privacy**: No data is sent to external servers, everything runs locally

## 🐛 Troubleshooting

### "Could not detect your username"

- Make sure you're logged into Letterboxd
- Try refreshing the page
- Check that you're on a Letterboxd page (letterboxd.com)

### "No movies found"

- Make sure you have some watched films in your account
- Try again later if the site is slow
- Check your internet connection

### Button not appearing

- Make sure the script is installed and enabled
- Try refreshing the page
- Check the browser console for any error messages

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve the documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [Letterboxd-Scripts](https://github.com/worldwidewaves/Letterboxd-Scripts) repository
- Built for the Letterboxd community
- Uses modern web technologies for the best user experience

## 📊 Statistics

- **Version**: 1.0.0
- **Last Updated**: January 2025
- **Compatibility**: Letterboxd.com
- **License**: MIT

---

**Made with ❤️ for the Letterboxd community**

If you find this script useful, consider giving it a ⭐ on GitHub!
