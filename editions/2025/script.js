document.addEventListener('DOMContentLoaded', () => {
    // Fade-in animation for elements
    const fadeElements = document.querySelectorAll('.hero, .sponsor-card, .working-image-container, .group-image .working-image-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Update copyright year
    const copyrightElement = document.querySelector('.footer-content p');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }
});
