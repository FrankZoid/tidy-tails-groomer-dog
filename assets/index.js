/**
 * Tidy Tails Pet Grooming - Website Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initHeaderScroll();
  initMobileMenu();
  initScrollAnimations();
  initActiveNavLink();
  initTodayHoursHighlight();
  initLightbox();
  initGalleryFilter();
});

/**
 * 1. Sticky Header Scroll Effect
 */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run once on load, and listen to scroll events
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 2. Mobile Drawer Menu Toggling
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-drawer-backdrop');

  if (!hamburger || !drawer || !backdrop) return;

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    drawer.classList.toggle('active');
    backdrop.classList.toggle('active');
    
    // Prevent body scrolling when menu is active
    if (drawer.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburger.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', toggleMenu);

  // Close menu when clicking on drawer links
  const drawerLinks = drawer.querySelectorAll('.mobile-nav-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (drawer.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * 3. Scroll Entry Animations (Intersection Observer)
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -10% 0px', // trigger slightly before entering viewport
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('appear'));
  }
}

/**
 * 4. Automatically Highlight Current Page in Navigation
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Header Nav Links
  const headerLinks = document.querySelectorAll('.nav-link');
  headerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile Drawer Links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 5. Highlight Today's Business Hours Row
 */
function initTodayHoursHighlight() {
  const hoursTable = document.querySelector('.hours-table');
  if (!hoursTable) return;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];

  const rows = hoursTable.querySelectorAll('tr');
  rows.forEach(row => {
    const dayCell = row.querySelector('td:first-child');
    if (dayCell) {
      const rowDay = dayCell.textContent.trim().toLowerCase();
      if (rowDay === todayName) {
        row.classList.add('today');
      }
    }
  });
}

/**
 * 6. Interactive Gallery Filtering
 */
function initGalleryFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterTabs.length === 0 || galleryCards.length === 0) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab class
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'block';
          // Force a tiny timeout to animate re-entry beautifully
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          // Wait for transition before hiding layout element
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * 7. Premium Lightweight Lightbox Overlay
 */
function initLightbox() {
  const gallery = document.querySelector('.gallery-grid');
  const lightbox = document.getElementById('lightbox');
  
  if (!gallery || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  // Gather active visible gallery cards only
  let visibleCards = [];
  let currentCardIndex = -1;

  const updateVisibleCardsList = () => {
    const allCards = document.querySelectorAll('.gallery-card');
    visibleCards = Array.from(allCards).filter(card => card.style.display !== 'none');
  };

  const openLightbox = (card, index) => {
    updateVisibleCardsList();
    currentCardIndex = visibleCards.indexOf(card);
    
    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('.gallery-card-title').textContent;
    
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = title;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scrolling
  };

  const navigateLightbox = (direction) => {
    updateVisibleCardsList();
    if (visibleCards.length === 0) return;

    if (direction === 'next') {
      currentCardIndex = (currentCardIndex + 1) % visibleCards.length;
    } else if (direction === 'prev') {
      currentCardIndex = (currentCardIndex - 1 + visibleCards.length) % visibleCards.length;
    }

    const targetCard = visibleCards[currentCardIndex];
    const imgSrc = targetCard.querySelector('img').src;
    const title = targetCard.querySelector('.gallery-card-title').textContent;

    // Apply quick transition slide effect
    lightboxImg.style.opacity = '0.3';
    setTimeout(() => {
      lightboxImg.src = imgSrc;
      lightboxCaption.textContent = title;
      lightboxImg.style.opacity = '1';
    }, 100);
  };

  // Click on item inside gallery grid
  const cards = gallery.querySelectorAll('.gallery-card');
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      openLightbox(card, index);
    });
  });

  // Lightbox control buttons
  closeBtn.addEventListener('click', closeLightbox);
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox('next');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox('prev');
    });
  }

  // Close when clicking empty space
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    }
  });

  // Swipe support for mobile devices
  let startX = 0;
  let endX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const threshold = 50;
    if (endX < startX - threshold) {
      // Swiped Left -> Next Image
      navigateLightbox('next');
    } else if (endX > startX + threshold) {
      // Swiped Right -> Prev Image
      navigateLightbox('prev');
    }
  };
}
