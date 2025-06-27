// Design type and location mappings
const designTypes = {
    'ex': 'Exterior',
    'in': 'Interior'
};

const realmNames = {
    'fontaine': 'Swirling Isles',
    'mond': 'Cool Isle', 
    'liyue': 'Emerald Peak',
    'natlan': 'Tletl Ilhuicatl',
    'sumeru': 'Sublime Spicewood',
    'ina': 'Silken Courtyard',
    'liyuefloat': 'Floating Abode',
    
};

const mansionNames = {
    'fontaine': 'Fontaine Villa: Illusory Annex',
    'mond': 'Mondstadt Mansion: Windward Manor',
    'liyue': 'Liyue Estate: Exquisite Mansion', 
    'sumeru': 'Sumeru Mansion: Meditative Retreat',
    'ina': 'Inazuman Walled House: Refined Estate',
    'natlan': 'Natlan Dwelling: Lofty Tower',
};

// Filter elements
const filterDesignType = document.getElementById('filter-design-type');
const filterRealm = document.getElementById('filter-realm');
const filterServer = document.getElementById('filter-server');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
const filterControlsContainer = document.getElementById('filter-controls-container');

// Populate filter options
function populateFilters() {
    if (typeof showcaseData === 'undefined' || !filterDesignType || !filterRealm || !filterServer) return;

    const designTypesSet = new Set();
    const realmsSet = new Set();
    const serversSet = new Set();

    showcaseData.forEach(item => {
        if (item.designType) designTypesSet.add(item.designType);
        // For realms, only add if it's an exterior design
        if (item.designType === 'ex' && item.realmType) realmsSet.add(item.realmType);
        // For mansions, only add if it's an interior design
        if (item.designType === 'in' && item.mansionType) realmsSet.add(item.mansionType); // This was a bug, should be item.mansionType for population
        if (item.server) serversSet.add(item.server);
    });

    const populateSelect = (selectElement, optionsSet, mapping, defaultLabel) => {
        // Clear existing options except the first "All" option
        while (selectElement.options.length > 1) {
            selectElement.remove(1);
        }
        optionsSet.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = mapping && mapping[value] ? mapping[value] : value.charAt(0).toUpperCase() + value.slice(1);
            selectElement.appendChild(option);
        });
    };

    // Note: The realm filter will show all realmTypes from 'ex' designs.
    // The mansion filter (if we were to add one) would show all mansionTypes from 'in' designs.
    // For simplicity, the current "Realm" filter will cover both realm and mansion display names later.
    // We will adjust generateGallery and applyMappings to handle this.

    populateSelect(filterDesignType, designTypesSet, designTypes);

    // For the "Realm" filter, we'll populate it with both realm and mansion *keys*
    // but use their respective name mappings for display.
    // This requires a more complex population or a unified filter later.
    // For now, let's populate with realmTypes primarily, and adjust filtering logic.
    const locationKeysSet = new Set();
    showcaseData.forEach(item => {
        if (item.designType === 'ex' && item.realmType) {
            locationKeysSet.add(item.realmType);
        } else if (item.designType === 'in' && item.mansionType) {
            locationKeysSet.add(item.mansionType);
        }
    });

    // Populate Realm/Location Filter
    if (filterRealm) {
        while (filterRealm.options.length > 1) filterRealm.remove(1); // Clear previous options
        locationKeysSet.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            // Display name from realmNames or mansionNames
            option.textContent = realmNames[key] || mansionNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
            filterRealm.appendChild(option);
        });
    }

    populateSelect(filterServer, serversSet);
}


// Generate gallery items from showcase data
function generateGallery(filters = {}) {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer || typeof showcaseData === 'undefined') return;
    
    galleryContainer.innerHTML = ''; // Clear previous items

    const filteredData = showcaseData.filter(item => {
        const designTypeMatch = !filters.designType || item.designType === filters.designType;

        // Location filter: checks realmType for 'ex' and mansionType for 'in'
        let locationMatch = true;
        if (filters.location) {
            if (item.designType === 'ex') {
                locationMatch = item.realmType === filters.location;
            } else if (item.designType === 'in') {
                locationMatch = item.mansionType === filters.location;
            } else {
                // If design type is neither 'ex' nor 'in' but location filter is active, it's a mismatch
                locationMatch = false;
            }
        }

        const serverMatch = !filters.server || item.server === filters.server;
        return designTypeMatch && locationMatch && serverMatch;
    });
    
    if (filteredData.length === 0) {
        galleryContainer.innerHTML = '<p class="no-results">No designs match the current filters. Try adjusting your selection.</p>';
        return;
    }

    filteredData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        let slidesHTML = '';
        item.images.forEach((imagePath, index) => {
            slidesHTML += `
                <div class="slide ${index === 0 ? 'active' : ''} loading">
                    <img src="${imagePath}" alt="${item.title} - Image ${index + 1}" loading="lazy">
                </div>
            `;
        });
        
        let replicaIdHTML = '';
        if (Array.isArray(item.replicaIds)) {
            replicaIdHTML = item.replicaIds.map(replica => 
                `<p><strong>${replica.part}:</strong> <span class="replica-id" data-id="${replica.id}" title="Click to copy">${replica.id}</span></p>`
            ).join('');
        } else if (item.replicaId) {
            replicaIdHTML = `<p><strong>Replica ID:</strong> <span class="replica-id" data-id="${item.replicaId}" title="Click to copy">${item.replicaId}</span></p>`;
        }
        
        let ownerHTML = '';
        if (item.owner && item.owner.name) { // Added check for item.owner
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
                <p><span class="location-type" data-realm="${item.realmType || ''}" data-mansion="${item.mansionType || ''}"></span></p>
                ${replicaIdHTML}
                <p><strong>Server:</strong> ${item.server || 'N/A'}</p>
                ${ownerHTML ? `<p><strong>Owner:</strong> ${ownerHTML}</p>` : ''}
            </div>
        `;
        
        galleryContainer.appendChild(galleryItem);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    populateFilters();
    generateGallery(); // Initial gallery load
    applyMappings();   // Apply text transformations
    initializeSlideshows(); // Initialize slideshows for initial items

    function applyFiltersAndRegenerate() {
        const currentFilters = {
            designType: filterDesignType ? filterDesignType.value : '',
            location: filterRealm ? filterRealm.value : '', // filterRealm now controls overall location
            server: filterServer ? filterServer.value : ''
        };
        generateGallery(currentFilters);
        applyMappings();
        initializeSlideshows();
    }

    if (filterDesignType) filterDesignType.addEventListener('change', applyFiltersAndRegenerate);
    if (filterRealm) filterRealm.addEventListener('change', applyFiltersAndRegenerate);
    if (filterServer) filterServer.addEventListener('change', applyFiltersAndRegenerate);

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (filterDesignType) filterDesignType.value = '';
            if (filterRealm) filterRealm.value = '';
            if (filterServer) filterServer.value = '';
            applyFiltersAndRegenerate();
        });
    }

    // Filter toggle functionality
    if (toggleFiltersBtn && filterControlsContainer) {
        // Set initial state based on aria-expanded attribute
        const initiallyExpanded = toggleFiltersBtn.getAttribute('aria-expanded') === 'true';
        if (!initiallyExpanded) {
            filterControlsContainer.classList.add('filters-collapsed');
            updateToggleButton(false);
        } else {
             updateToggleButton(true); // Ensure button text/icon is correct if initially expanded
        }


        toggleFiltersBtn.addEventListener('click', () => {
            const isExpanded = filterControlsContainer.classList.toggle('filters-collapsed');
            // The toggle method returns true if the class is removed (meaning it's now expanded),
            // and false if the class is added (meaning it's now collapsed).
            // So, isExpanded from classList.toggle is effectively "isNowVisible"
            // aria-expanded should be true if visible, false if collapsed.
            // If filters-collapsed is present, it's collapsed (aria-expanded = false)
            // If filters-collapsed is NOT present, it's expanded (aria-expanded = true)
            const currentlyExpanded = !filterControlsContainer.classList.contains('filters-collapsed');
            toggleFiltersBtn.setAttribute('aria-expanded', String(currentlyExpanded));
            updateToggleButton(currentlyExpanded);
        });
    }
});

function updateToggleButton(isExpanded) {
    if (!toggleFiltersBtn) return;

    // Get the text part (span) and icon part
    let textNode = null;
    for (let i = 0; i < toggleFiltersBtn.childNodes.length; i++) {
        if (toggleFiltersBtn.childNodes[i].nodeType === Node.TEXT_NODE && toggleFiltersBtn.childNodes[i].textContent.trim() !== '') {
            textNode = toggleFiltersBtn.childNodes[i];
            break;
        }
    }
    const icon = toggleFiltersBtn.querySelector('i.fas');

    if (isExpanded) {
        if (textNode) textNode.textContent = 'Hide Filters '; // Ensure space for icon
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    } else {
        if (textNode) textNode.textContent = 'Show Filters '; // Ensure space for icon
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
}

// Function to apply design type and location mappings
function applyMappings() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        const designTypeSpan = item.querySelector('.design-type');
        if (designTypeSpan) {
            const designKey = designTypeSpan.dataset.design;
            if (designKey && designTypes[designKey]) {
                designTypeSpan.textContent = designTypes[designKey];
            } else {
                designTypeSpan.textContent = 'N/A'; // Fallback
            }
        }

        const locationSpan = item.querySelector('.location-type');
        if (locationSpan) {
            const designKey = designTypeSpan ? designTypeSpan.dataset.design : null; // Use already queried designTypeSpan
            const locationParagraph = locationSpan.closest('p');
            
            if (locationParagraph) { // Ensure paragraph exists
                let locationText = '';
                let labelText = '';

                if (designKey === 'ex') {
                    const realmKey = locationSpan.dataset.realm;
                    if (realmKey && realmNames[realmKey]) {
                        locationText = realmNames[realmKey];
                        labelText = 'Realm:';
                    }
                } else if (designKey === 'in') {
                    const mansionKey = locationSpan.dataset.mansion;
                    if (mansionKey && mansionNames[mansionKey]) {
                        locationText = mansionNames[mansionKey];
                        labelText = 'Mansion:';
                    }
                }

                if (locationText && labelText) {
                    locationParagraph.innerHTML = `<strong>${labelText}</strong> <span class="location-type" data-realm="${locationSpan.dataset.realm || ''}" data-mansion="${locationSpan.dataset.mansion || ''}">${locationText}</span>`;
                } else {
                    locationParagraph.innerHTML = ''; // Clear if no valid location
                }
            }
        }
    });
}


function initializeSlideshows() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const slides = item.querySelectorAll('.slide');
        if (slides.length === 0) return; // Skip if no slides (e.g. if item failed to load images)

        const slideshowContainer = item.querySelector('.slideshow-container');
        const prevBtn = item.querySelector('.prev-btn');
        const nextBtn = item.querySelector('.next-btn');
        let currentSlide = 0;
        let slideshowInterval;
        
        // Clear existing dots if any (important for re-initialization)
        const existingDotsNav = slideshowContainer.querySelector('.dots-nav');
        if (existingDotsNav) existingDotsNav.remove();

        const dotsNav = document.createElement('div');
        dotsNav.className = 'dots-nav';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent gallery item click when dot is clicked
                showSlide(index);
                if (slideshowInterval) clearInterval(slideshowInterval); // Stop auto-slide on manual nav
            });
            dotsNav.appendChild(dot);
        });
        slideshowContainer.appendChild(dotsNav);
        
        function showSlide(index) {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            dotsNav.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }
        
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
            const swipeThreshold = 50; // Minimum distance for a swipe
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) prevSlide(); // Swipe right
                else nextSlide(); // Swipe left
                if (slideshowInterval) clearInterval(slideshowInterval);
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
        
        if(prevBtn) prevBtn.onclick = (e) => { // Use onclick to simplify listener management on re-init
            e.stopPropagation();
            prevSlide();
            if (slideshowInterval) clearInterval(slideshowInterval);
        };
        
        if(nextBtn) nextBtn.onclick = (e) => { // Use onclick
            e.stopPropagation();
            nextSlide();
            if (slideshowInterval) clearInterval(slideshowInterval);
        };
        
        // Auto-slideshow on hover
        // Clear previous listeners before adding new ones to prevent multiple intervals
        slideshowContainer.onmouseenter = () => { // Use onmouseenter
            if (slideshowInterval) clearInterval(slideshowInterval); // Clear any existing before starting new
            slideshowInterval = setInterval(nextSlide, 3000);
        };
        
        slideshowContainer.onmouseleave = () => { // Use onmouseleave
            if (slideshowInterval) clearInterval(slideshowInterval);
        };

        // Ensure the first slide is shown
        showSlide(0);
    });
    
    document.querySelectorAll('.slide img').forEach(img => {
        const parentSlide = img.parentElement;
        if (img.complete) {
            if (img.naturalWidth > 0) parentSlide.classList.remove('loading');
            else parentSlide.classList.add('error');
        } else {
            img.onload = () => parentSlide.classList.remove('loading');
            img.onerror = () => {
                parentSlide.classList.remove('loading');
                parentSlide.classList.add('error');
            };
        }
    });

    document.querySelectorAll('.replica-id').forEach(span => {
        // To prevent multiple listeners, check if one is already attached,
        // or use a more robust method like replacing the element or using a flag.
        // For simplicity here, we'll assume prior spans are removed by generateGallery.
        span.onclick = (e) => { // Use onclick
            e.preventDefault();
            e.stopPropagation();
            
            const id = span.dataset.id;
            const copyText = (text) => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    return navigator.clipboard.writeText(text);
                } else { /* Fallback */ }
            };

            copyText(id).then(() => {
                const toast = document.createElement('div');
                toast.className = 'toast-notification';
                toast.textContent = 'Copied Replica ID!';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);

                const originalText = span.textContent;
                span.textContent = 'Copied!';
                setTimeout(() => { span.textContent = originalText; }, 1000);
            }).catch(() => { /* Error toast */ });
        };
    });

    initializeModal(); // Modal init needs to be callable if items change
}

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links'); // This seems to be missing in HTML, assuming it's part of nav

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', String(navLinks.classList.contains('active')));
    });
}

const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModalBtn = document.querySelector('.close-modal'); // Renamed to avoid conflict with closeModal function

let currentGalleryItem = null;
let currentImageIndex = 0;

function initializeModal() {
    if (!modal) return; // Ensure modal exists

    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const images = item.querySelectorAll('.slide img');
        images.forEach((img, index) => {
            // Use onclick for easier management if items are re-rendered
            img.onclick = (e) => {
                e.stopPropagation();
                currentGalleryItem = item; // item from the closure
                showModalImage(item, index); // Pass item directly
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            };
        });
    });
}


function showModalImage(item, index) { // item is passed to know which gallery item's images to use
    if (!item) return; // Ensure item is valid
    const images = item.querySelectorAll('.slide img');
    if (images.length === 0) return; // No images in this item

    currentImageIndex = index;
    modalImg.classList.add('loading');
    const spinner = modal.querySelector('.loading-spinner'); // Query within modal
    if (spinner) spinner.style.display = 'block';
    
    modalImg.src = images[currentImageIndex].src;
    modalImg.onload = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
    };
    modalImg.onerror = () => {
        modalImg.classList.remove('loading');
        if (spinner) spinner.style.display = 'none';
        // Optionally display an error message in the modal
    };
    updateModalDots(currentImageIndex, images.length);
}

function nextModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide img');
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showModalImage(currentGalleryItem, currentImageIndex);
}

function prevModalImage() {
    if (!currentGalleryItem) return;
    const images = currentGalleryItem.querySelectorAll('.slide img');
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showModalImage(currentGalleryItem, currentImageIndex);
}

window.addEventListener('keydown', (e) => {
    if (modal && modal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') prevModalImage();
        else if (e.key === 'ArrowRight') nextModalImage();
        else if (e.key === 'Escape') closeModal(); // Use the closeModal function
    }
});

function closeModal() { // Encapsulated close logic
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('DOMContentLoaded', () => {
    // Modal navigation buttons are created once
    const modalContent = document.querySelector('#imageModal .modal-content');
    if (!modalContent) return;
    
    // Check if buttons already exist to prevent duplication if DOMContentLoaded fires multiple times in some scenarios
    if (!modalContent.querySelector('.prev-btn')) {
        const modalPrevBtn = document.createElement('button');
        modalPrevBtn.className = 'nav-btn prev-btn';
        modalPrevBtn.innerHTML = '&lt;';
        modalPrevBtn.setAttribute('aria-label', 'Previous image');
        modalPrevBtn.addEventListener('click', prevModalImage);
        modalContent.appendChild(modalPrevBtn);
    }

    if (!modalContent.querySelector('.next-btn')) {
        const modalNextBtn = document.createElement('button');
        modalNextBtn.className = 'nav-btn next-btn';
        modalNextBtn.innerHTML = '&gt;';
        modalNextBtn.setAttribute('aria-label', 'Next image');
        modalNextBtn.addEventListener('click', nextModalImage);
        modalContent.appendChild(modalNextBtn);
    }

    if (!modalContent.querySelector('.dots-nav')) {
        const modalDotsNav = document.createElement('div');
        modalDotsNav.className = 'dots-nav';
        modalContent.appendChild(modalDotsNav); // Dots will be populated by updateModalDots
    }

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
            if (diff > 0) prevModalImage();
            else nextModalImage();
        }
    }

    // Initial calls moved to the main DOMContentLoaded listener earlier
    // populateFilters();
    // generateGallery();
    // applyMappings();
    // initializeSlideshows();
});

function updateModalDots(currentIndex, totalSlides) {
    const modalDotsNav = document.querySelector('#imageModal .modal-content .dots-nav');
    if (!modalDotsNav) return;
    
    modalDotsNav.innerHTML = ''; // Clear existing dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to image ${i + 1}`);
        // Pass currentGalleryItem when calling showModalImage from dot click
        dot.onclick = () => showModalImage(currentGalleryItem, i);
        modalDotsNav.appendChild(dot);
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjusted for fixed nav height
                behavior: 'smooth'
            });
            if (navLinks && navLinks.classList.contains('active')) { // If mobile menu is open, close it
                navLinks.classList.remove('active');
                if(mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Section switcher functionality (for guide sections) - Ensure this is correctly scoped or needed on index
// If guide.html has its own script, this might be duplicated or misplaced.
// Assuming it's for sections on the current page if any.
document.addEventListener('DOMContentLoaded', function() { // Can be merged with other DOMContentLoaded
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    const sectionContents = document.querySelectorAll('.section-content');

    if (switcherBtns.length > 0 && sectionContents.length > 0) {
        switcherBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-target');

                switcherBtns.forEach(b => b.classList.remove('active'));
                sectionContents.forEach(s => s.classList.remove('active'));

                this.classList.add('active');
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                }
            });
        });
        // Optionally, activate the first button and section by default
        // if (switcherBtns.length > 0) switcherBtns[0].click();
    }
});

// Lazy loading observer (if not already handled by browser native lazy loading)
// This is a basic version. Consider libraries for more robust solutions if needed.
document.addEventListener('DOMContentLoaded', function() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported; ensure images have loading="lazy"
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            // Optional: force load if already visible and not loaded by browser for some reason
            // (usually not needed if 'loading="lazy"' is correctly implemented by browser)
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = [].slice.call(document.querySelectorAll("img[data-src]"));
        let active = false;

        const lazyLoad = function() {
            if (active === false) {
                active = true;
                setTimeout(function() {
                    lazyImages.forEach(function(lazyImage) {
                        if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.removeAttribute("data-src"); // Important: remove data-src once loaded
                            // Optional: remove 'lazy' class if you use one for styling placeholders
                            // lazyImage.classList.remove("lazy");

                            lazyImages = lazyImages.filter(function(image) {
                                return image !== lazyImage;
                            });

                            if (lazyImages.length === 0) {
                                document.removeEventListener("scroll", lazyLoad);
                                window.removeEventListener("resize", lazyLoad);
                                window.removeEventListener("orientationchange", lazyLoad);
                            }
                        }
                    });
                    active = false;
                }, 200);
            }
        };

        if (lazyImages.length > 0) {
            document.addEventListener("scroll", lazyLoad);
            window.addEventListener("resize", lazyLoad);
            window.addEventListener("orientationchange", lazyLoad);
            lazyLoad(); // Initial check
        }
    }
});

// Hide loading spinner if it exists and is global (e.g. for initial page load)
// This was previously inside a DOMContentLoaded that also handled modal buttons.
// If it's for a global spinner, it should be standalone.
document.addEventListener('DOMContentLoaded', function() {
    const globalLoadingSpinner = document.querySelector('.page-loading-spinner'); // Example class
    if (globalLoadingSpinner) {
        globalLoadingSpinner.style.display = 'none';
    }
});
