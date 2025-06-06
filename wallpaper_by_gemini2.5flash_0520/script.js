document.addEventListener('DOMContentLoaded', () => {
    const wallpaperContainer = document.getElementById('wallpaper-container');

    wallpaperContainer.addEventListener('mouseenter', () => {
        wallpaperContainer.style.backgroundColor = '#4CAF50'; // Green on hover
    });

    wallpaperContainer.addEventListener('mouseleave', () => {
        wallpaperContainer.style.backgroundColor = '#282c34'; // Back to dark
    });
});
