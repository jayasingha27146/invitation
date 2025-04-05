document.addEventListener("DOMContentLoaded", function () {
  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Initialize components
  initNavbar();
  initHeroSlider();
  initFloatingHearts();
  initMusicPlayer();
  initScrollAnimation();
  initGallery();
  initRsvpForm();
});

// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileLinks = mobileNav.querySelectorAll(".nav-link");

  // Toggle mobile menu
  mobileToggle.addEventListener("click", function () {
    mobileNav.classList.toggle("active");

    // Toggle icon
    const icon = mobileToggle.querySelector("i");
    if (mobileNav.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close mobile menu when clicking a link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileNav.classList.remove("active");
      const icon = mobileToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });

  // Change navbar background on scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Hero slider functionality
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  let currentSlide = 0;
  let slideInterval;

  // Function to change slide
  function goToSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Add active class to current slide and dot
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    // Update current slide index
    currentSlide = index;
  }

  // Auto-advance slides
  function startSlideInterval() {
    slideInterval = setInterval(function () {
      let nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, 5000);
  }

  // Initialize slider
  startSlideInterval();

  // Add click event to dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      clearInterval(slideInterval);
      goToSlide(index);
      startSlideInterval();
    });
  });

  // Set slide titles
  const slideTitles = [
    "Lakmal & Hasini",
    "We're Getting Married",
    "Join Our Celebration",
  ];

  // Update hero title based on current slide
  function updateHeroTitle() {
    const heroTitle = document.querySelector(".hero-title");
    heroTitle.textContent = slideTitles[currentSlide];
    heroTitle.classList.remove("fade-in");
    void heroTitle.offsetWidth; // Trigger reflow
    heroTitle.classList.add("fade-in");
  }

  // Watch for slide changes to update title
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.attributeName === "class" &&
        mutation.target.classList.contains("active")
      ) {
        const index = Array.from(slides).indexOf(mutation.target);
        if (index >= 0) {
          updateHeroTitle();
        }
      }
    });
  });

  slides.forEach((slide) => {
    observer.observe(slide, { attributes: true });
  });
}

// Floating hearts animation
function initFloatingHearts() {
  const container = document.getElementById("floating-hearts");

  // Increase the number of initial hearts
  for (let i = 0; i < 30; i++) {
    // Changed from 15 to 30
    createHeart();
  }

  // Add new hearts more frequently
  setInterval(function () {
    for (let i = 0; i < 4; i++) {
      // Add 5 hearts at a time
      createHeart();
    }

    // Keep the hearts count reasonable
    while (container.children.length > 40) {
      // Increased limit from 30 to 50
      container.removeChild(container.firstChild);
    }
  }, 2500); // Reduced interval from 3000ms to 2000ms

  function createHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";

    // Random position, size, and animation
    const size = Math.random() * 20 + 10; // 10-30px
    const left = Math.random() * 100; // 0-100%
    const delay = Math.random() * 5; // 0-5s
    const duration = Math.random() * 10 + 10; // 10-20s

    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.left = `${left}%`;
    heart.style.bottom = "-50px";
    heart.style.fontSize = `${size}px`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
      if (container.contains(heart)) {
        container.removeChild(heart);
      }
    }, (delay + duration) * 1000);
  }
}

// Music player functionality
function initMusicPlayer() {
  const musicToggle = document.getElementById("music-toggle");
  const audio = document.getElementById("background-music");
  let isPlaying = false;

  musicToggle.addEventListener("click", function () {
    if (isPlaying) {
      audio.pause();
      musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    } else {
      // Try to play and handle autoplay restrictions
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
            musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
          })
          .catch((error) => {
            // Autoplay was prevented
            console.log("Autoplay prevented:", error);
            isPlaying = false;
            return;
          });
      }
    }

    isPlaying = !isPlaying;
  });
}

// Scroll animation
function initScrollAnimation() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Gallery and lightbox functionality
function initGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modal = document.getElementById("gallery-modal");
  const modalImage = document.getElementById("modal-image");
  const modalCaption = document.getElementById("modal-caption");
  const closeBtn = document.getElementById("modal-close");
  const prevBtn = document.getElementById("modal-prev");
  const nextBtn = document.getElementById("modal-next");

  let currentIndex = 0;

  // Image data
  const images = [
    {
      src: "https://placehold.co/800x600",
      alt: "Lakmal & Hasini at the beach",
    },
    { src: "https://placehold.co/800x600", alt: "Engagement photo" },
    { src: "https://placehold.co/800x600", alt: "First date" },
    { src: "https://placehold.co/800x600", alt: "Hiking together" },
    { src: "https://placehold.co/800x600", alt: "Holiday celebration" },
    { src: "https://placehold.co/800x600", alt: "Proposal moment" },
  ];

  // Open modal with clicked image
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openModal(index);
    });
  });

  // Close modal
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Navigate between images
  prevBtn.addEventListener("click", showPrevImage);
  nextBtn.addEventListener("click", showNextImage);

  // Keyboard navigation
  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("active")) return;

    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowLeft") {
      showPrevImage();
    } else if (event.key === "ArrowRight") {
      showNextImage();
    }
  });

  function openModal(index) {
    currentIndex = index;
    updateModalContent();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalContent();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateModalContent();
  }

  function updateModalContent() {
    modalImage.src = images[currentIndex].src;
    modalImage.alt = images[currentIndex].alt;
    modalCaption.textContent = images[currentIndex].alt;
  }
}

// RSVP form functionality
function initRsvpForm() {
  const form = document.getElementById("rsvp-form");
  const formContainer = document.getElementById("rsvp-form-container");
  const successMessage = document.getElementById("rsvp-success");
  const submitBtn = document.getElementById("submit-btn");
  const attendingSelect = document.getElementById("attending");
  const guestsSelect = document.getElementById("guests");

  // Toggle guests select based on attending
  attendingSelect.addEventListener("change", function () {
    guestsSelect.disabled = this.value === "no";
    if (this.value === "no") {
      guestsSelect.value = "0";
    }
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      // Show loading state
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(function () {
        // Show success message
        formContainer.classList.add("hidden");
        successMessage.classList.remove("hidden");

        // Reset form after 5 seconds
        setTimeout(function () {
          formContainer.classList.remove("hidden");
          successMessage.classList.add("hidden");
          form.reset();
          submitBtn.textContent = "Send RSVP";
          submitBtn.disabled = false;
        }, 5000);
      }, 1500);
    }
  });

  function validateForm() {
    let isValid = true;

    // Validate name
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("name-error");

    if (!nameInput.value.trim()) {
      nameInput.classList.add("error");
      nameError.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Name is required';
      isValid = false;
    } else {
      nameInput.classList.remove("error");
      nameError.innerHTML = "";
    }

    // Validate email
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailInput.value.trim()) {
      emailInput.classList.add("error");
      emailError.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Email is required';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
      emailInput.classList.add("error");
      emailError.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Email is invalid';
      isValid = false;
    } else {
      emailInput.classList.remove("error");
      emailError.innerHTML = "";
    }

    return isValid;
  }
}
