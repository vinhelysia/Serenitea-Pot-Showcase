// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Modified Image modal functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentGalleryItem = null;
let currentImageIndex = 0;

function showModalImage(item, index) {
    const images = item.querySelectorAll('.slide, img');
    currentImageIndex = index;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

function nextModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide, img');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

function prevModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide, img');
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

galleryItems.forEach(item => {
    const images = item.querySelectorAll('.slide, img');
    images.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            currentGalleryItem = item;
            showModalImage(item, index);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
});

// Add keyboard event listener
window.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
        if (e.key === 'ArrowLeft' || e.key === '<') {
            prevModalImage();
        } else if (e.key === 'ArrowRight' || e.key === '>') {
            nextModalImage();
        } else if (e.key === 'Escape') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const slides = item.querySelectorAll('.slide');
        const slideshowContainer = item.querySelector('.slideshow-container');
        const prevBtn = item.querySelector('.prev-btn');
        const nextBtn = item.querySelector('.next-btn');
        let currentSlide = 0;
        let slideshowInterval;
        
        // Create dots navigation
        const dotsNav = document.createElement('div');
        dotsNav.className = 'dots-nav';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showSlide(index);
            });
            dotsNav.appendChild(dot);
        });
        slideshowContainer.appendChild(dotsNav);
        
        // Function to show a specific slide
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            
            // Update dots
            dotsNav.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        // Swipe handling
        let touchStartX = 0;
        let touchEndX = 0;
        
        slideshowContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshowContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }
        
        // Function to go to next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // Function to go to previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        // Navigation button click handlers
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevSlide();
            clearInterval(slideshowInterval);
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextSlide();
            clearInterval(slideshowInterval);
        });
        
        // Initialize first slide
        showSlide(currentSlide);
        
        // Start slideshow on hover
        item.addEventListener('mouseenter', () => {
            slideshowInterval = setInterval(nextSlide, 3000);
        });
        
        // Stop slideshow when mouse leaves
        item.addEventListener('mouseleave', () => {
            clearInterval(slideshowInterval);
        });
    });
});

// Modal enhancements
const modalContent = document.querySelector('.modal-content');

// Add navigation buttons to modal
const modalPrevBtn = document.createElement('button');
modalPrevBtn.className = 'nav-btn prev-btn';
modalPrevBtn.innerHTML = '&lt;';
modalContent.appendChild(modalPrevBtn);

const modalNextBtn = document.createElement('button');
modalNextBtn.className = 'nav-btn next-btn';
modalNextBtn.innerHTML = '&gt;';
modalContent.appendChild(modalNextBtn);

// Add dots navigation to modal
const modalDotsNav = document.createElement('div');
modalDotsNav.className = 'dots-nav';
modalContent.appendChild(modalDotsNav);

function updateModalDots(currentIndex, totalSlides) {
    modalDotsNav.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.addEventListener('click', () => showModalImage(currentGalleryItem, i));
        modalDotsNav.appendChild(dot);
    }
}

// Add modal swipe support
let modalTouchStartX = 0;
let modalTouchEndX = 0;

modalContent.addEventListener('touchstart', e => {
    modalTouchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modalContent.addEventListener('touchend', e => {
    modalTouchEndX = e.changedTouches[0].screenX;
    handleModalSwipe();
}, { passive: true });

function handleModalSwipe() {
    const swipeThreshold = 50;
    const diff = modalTouchEndX - modalTouchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            prevModalImage();
        } else {
            nextModalImage();
        }
    }
}

// Update modal navigation button handlers
modalPrevBtn.addEventListener('click', prevModalImage);
modalNextBtn.addEventListener('click', nextModalImage);

document.querySelectorAll('.replica-id').forEach(span => {
    span.addEventListener('click', function(e) {
        const id = this.dataset.id;
        navigator.clipboard.writeText(id).then(() => {
            // Optional: show feedback
            this.textContent = "Copied!";
            setTimeout(() => {
                this.textContent = id;
            }, 1000);
        });
        e.stopPropagation(); // Prevent modal from opening if inside image
    });
});