// Design type and location mappings
const designTypes = {
    'ex': 'Exterior',
    'in': 'Interior'
};

const realmNames = {
    'fontaine': 'Fontaine',
    'mond': 'Mondstadt', 
    'liyue': 'Liyue',
    'sumeru': 'Sumeru',
    'ina': 'Inazuma'
};

const mansionNames = {
    'fontaine': 'Fontaine Mansion',
    'mond': 'Mondstadt Mansion',
    'liyue': 'Liyue Mansion', 
    'sumeru': 'Sumeru Mansion',
    'ina': 'Inazuma Mansion'
};

// Generate gallery items from showcase data
function generateGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer || typeof showcaseData === 'undefined') return;
    
    galleryContainer.innerHTML = '';
    
    showcaseData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // Generate slides HTML
        let slidesHTML = '';
        item.images.forEach((imagePath, index) => {
            slidesHTML += `
                <div class="slide ${index === 0 ? 'active' : ''} loading">
                    <img src="${imagePath}" alt="${item.title} - Image ${index + 1}" loading="lazy">
                </div>
            `;
        });
        
        // Generate replica ID display
        let replicaIdHTML = '';
        if (Array.isArray(item.replicaIds)) {
            // Multiple replica IDs
            replicaIdHTML = item.replicaIds.map(replica => 
                `<p><strong>${replica.part}:</strong> <span class="replica-id" data-id="${replica.id}" title="Click to copy">${replica.id}</span></p>`
            ).join('');
        } else if (item.replicaId) {
            // Single replica ID
            replicaIdHTML = `<p><strong>Replica ID:</strong> <span class="replica-id" data-id="${item.replicaId}" title="Click to copy">${item.replicaId}</span></p>`;
        }
        
        // Generate owner link
        let ownerHTML = '';
        if (item.owner.name) {
            if (item.owner.url) {
                ownerHTML = `<a href="${item.owner.url}" target="_blank" rel="noopener">${item.owner.name}</a>`;
            } else {
                ownerHTML = item.owner.name;
            }
        }
        
        galleryItem.innerHTML = `
            <div class="slideshow-container">
                ${slidesHTML}
                <button class="nav-btn prev-btn">&lt;</button>
                <button class="nav-btn next-btn">&gt;</button>
            </div>
            <div class="gallery-info">
                <h3>${item.title || 'Untitled'}</h3>
                <p><strong>Type:</strong> <span class="design-type" data-design="${item.designType}"></span></p>
                <p><span class="location-type" data-realm="${item.realmType}" data-mansion="${item.mansionType}"></span></p>
                ${replicaIdHTML}
                <p><strong>Server:</strong> ${item.server}</p>
                ${ownerHTML ? `<p><strong>Owner:</strong> ${ownerHTML}</p>` : ''}
            </div>
        `;
        
        galleryContainer.appendChild(galleryItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Generate gallery first
    generateGallery();
    
    // Then apply the design type and location mappings
    document.querySelectorAll('.gallery-item').forEach(item => {
        const designTypeSpan = item.querySelector('.design-type');
        if (designTypeSpan) {
            const designKey = designTypeSpan.dataset.design;
            if (designKey && designTypes[designKey]) {
                designTypeSpan.textContent = designTypes[designKey];
            }
        }

        const locationSpan = item.querySelector('.location-type');
        if (locationSpan) {
            const designKey = designTypeSpan ? designTypeSpan.dataset.design : null;
            const locationParagraph = locationSpan.closest('p');
            
            if (designKey === 'ex') {
                // For exterior, use realm and change label
                const realmKey = locationSpan.dataset.realm;
                if (realmKey && realmNames[realmKey]) {
                    locationSpan.textContent = realmNames[realmKey];
                    // Update label to "Realm:"
                    if (locationParagraph) {
                        locationParagraph.innerHTML = `<strong>Realm:</strong> ${locationSpan.outerHTML}`;
                    }
                }
            } else if (designKey === 'in') {
                // For interior, use mansion and change label
                const mansionKey = locationSpan.dataset.mansion;
                if (mansionKey && mansionNames[mansionKey]) {
                    locationSpan.textContent = mansionNames[mansionKey];
                    // Update label to "Mansion:"
                    if (locationParagraph) {
                        locationParagraph.innerHTML = `<strong>Mansion:</strong> ${locationSpan.outerHTML}`;
                    }
                }
            }
        }
    });
    
    // Initialize slideshow functionality for dynamically created items
    initializeSlideshows();
});

function initializeSlideshows() {
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
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            dotsNav.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }
        
        // Touch/swipe functionality
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
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        // Button event listeners
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
        
        // Auto-slideshow on hover
        item.addEventListener('mouseenter', () => {
            slideshowInterval = setInterval(nextSlide, 3000);
        });
        
        item.addEventListener('mouseleave', () => {
            clearInterval(slideshowInterval);
        });
    });
    
    // Image loading handlers
    document.querySelectorAll('.slide img').forEach(img => {
        img.addEventListener('load', () => {
            img.parentElement.classList.remove('loading');
        });
        img.addEventListener('error', () => {
            img.parentElement.classList.remove('loading');
            img.parentElement.classList.add('error');
        });
        if (img.complete) {
            if (img.naturalWidth > 0) {
                img.parentElement.classList.remove('loading');
            } else {
                img.parentElement.classList.add('error');
            }
        }
    });

    // Replica ID copy functionality - Fixed toast styling
    document.querySelectorAll('.replica-id').forEach(span => {
        span.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const id = span.dataset.id;
            // Fallback for older browsers
            const copyText = (text) => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        return Promise.resolve();
                    } catch (err) {
                        return Promise.reject(err);
                    } finally {
                        document.body.removeChild(textarea);
                    }
                }
            };

            copyText(id).then(() => {
                // Show toast notification with proper CSS classes
                const toast = document.createElement('div');
                toast.className = 'toast-notification';
                toast.textContent = 'Copied Replica ID!';
                document.body.appendChild(toast);
                
                // Auto-remove after animation completes
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 2500);

                // Update span text for additional feedback
                const originalText = span.textContent;
                span.textContent = 'Copied!';
                setTimeout(() => {
                    span.textContent = originalText;
                }, 1000);
            }).catch(() => {
                // Show error toast with proper CSS classes
                const toast = document.createElement('div');
                toast.className = 'toast-notification error';
                toast.textContent = 'Failed to copy Replica ID';
                document.body.appendChild(toast);
                
                // Auto-remove after animation completes
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 2500);
            });
        });
    });

    // Initialize modal functionality
    initializeModal();
}

// Mobile menu functionality - Fixed to use proper CSS classes
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Update aria-expanded attribute for accessibility
        const expanded = navLinks.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', String(expanded));
    });
}

// Modal functionality - Fixed to use proper CSS modal structure
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');

let currentGalleryItem = null;
let currentImageIndex = 0;

function initializeModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const images = item.querySelectorAll('.slide img');
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
}

function showModalImage(item, index) {
    const images = item.querySelectorAll('.slide img');
    currentImageIndex = index;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

function nextModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide img');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

function prevModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide img');
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImg.classList.add('loading');
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    };
    updateModalDots(currentImageIndex, images.length);
}

// Keyboard navigation for modal
window.addEventListener('keydown', (e) => {
    if (modal && modal.style.display === 'flex') {
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

// Close modal functionality
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for anchor links
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
            if (navLinks) navLinks.classList.remove('active');
        }
    });
});

// Create modal navigation elements - Fixed to match CSS structure
document.addEventListener('DOMContentLoaded', () => {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;
    
    // Create prev/next buttons for modal with proper CSS classes
    const modalPrevBtn = document.createElement('button');
    modalPrevBtn.className = 'nav-btn prev-btn';
    modalPrevBtn.innerHTML = '&lt;';
    modalPrevBtn.setAttribute('aria-label', 'Previous image');
    modalContent.appendChild(modalPrevBtn);

    const modalNextBtn = document.createElement('button');
    modalNextBtn.className = 'nav-btn next-btn';
    modalNextBtn.innerHTML = '&gt;';
    modalNextBtn.setAttribute('aria-label', 'Next image');
    modalContent.appendChild(modalNextBtn);

    const modalDotsNav = document.createElement('div');
    modalDotsNav.className = 'dots-nav';
    modalContent.appendChild(modalDotsNav);

    // Modal navigation event listeners
    modalPrevBtn.addEventListener('click', prevModalImage);
    modalNextBtn.addEventListener('click', nextModalImage);

    // Touch/swipe for modal
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

    // Lazy loading observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    // Observe gallery items for lazy loading
    setTimeout(() => {
        document.querySelectorAll('.gallery-item').forEach(item => {
            observer.observe(item);
        });
    }, 100);

    // Hide loading spinner if it exists
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
});

function updateModalDots(currentIndex, totalSlides) {
    const modalDotsNav = document.querySelector('.modal-content .dots-nav');
    if (!modalDotsNav) return;
    
    modalDotsNav.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to image ${i + 1}`);
        dot.addEventListener('click', () => showModalImage(currentGalleryItem, i));
        modalDotsNav.appendChild(dot);
    }
}

// Section switcher functionality (for guide sections)
document.addEventListener('DOMContentLoaded', function() {
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    const sectionContents = document.querySelectorAll('.section-content');

    switcherBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            
            // Remove active class from all buttons and sections
            switcherBtns.forEach(b => b.classList.remove('active'));
            sectionContents.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked button and target section
            this.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });
});
