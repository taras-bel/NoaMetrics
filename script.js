document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // Navigation Menu Toggle (Hamburger menu for mobile)
    // ===========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mainNavOverlay = document.querySelector('.main-nav-overlay');

    if (menuToggle && mainNav && mainNavOverlay) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mainNavOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Optional: disable body scroll when menu is open
        });

        mainNavOverlay.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mainNavOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // Close mobile menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mainNavOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });


    // ===========================================
    // Smooth Scrolling for Navigation Links
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position for fixed header if needed
                const headerOffset = document.querySelector('.main-header') ? document.querySelector('.main-header').offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    // ===========================================
    // Upload Area Drag & Drop and File Handling
    // ===========================================
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadProgressBarContainer = document.querySelector('.upload-progress-container');
    const uploadProgressBar = document.querySelector('.upload-progress-bar');
    const uploadStatusText = document.querySelector('.upload-status-text');

    if (uploadArea && uploadButton && fileInput && fileList && uploadProgressBarContainer && uploadProgressBar && uploadStatusText) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false); // Prevent drop outside
        });

        // Highlight drop area when item is dragged over
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('highlight'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('highlight'), false);
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);

        // Handle button click for file input
        uploadButton.addEventListener('click', () => fileInput.click());

        // Handle file selection via input
        fileInput.addEventListener('change', (event) => {
            handleFiles(event.target.files);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            fileList.innerHTML = ''; // Clear previous list
            if (files.length > 0) {
                uploadProgressBarContainer.style.display = 'block';
                uploadStatusText.style.display = 'block';
                uploadStatusText.textContent = 'Uploading... 0%';
                uploadProgressBar.style.width = '0%';

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const listItem = document.createElement('div');
                    listItem.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                    fileList.appendChild(listItem);
                }

                // Simulate upload progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    uploadProgressBar.style.width = `${progress}%`;
                    uploadStatusText.textContent = `Uploading... ${progress}%`;
                    if (progress >= 100) {
                        clearInterval(interval);
                        uploadStatusText.textContent = 'Upload Complete!';
                        setTimeout(() => {
                            uploadProgressBarContainer.style.display = 'none';
                            uploadStatusText.style.display = 'none';
                            fileList.innerHTML = '';
                        }, 2000); // Hide after 2 seconds
                    }
                }, 200);
            }
        }
    }


    // ===========================================
    // Roadmap Dot Interaction (Desktop & Tablet)
    // ===========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const circle = item.querySelector('.circle');
        const paragraph = item.querySelector('p');

        if (circle && paragraph) {
            circle.addEventListener('click', function() {
                // Remove 'active' from all items first
                timelineItems.forEach(i => {
                    if (i !== item) {
                        i.classList.remove('active');
                    }
                });
                // Toggle 'active' on the clicked item
                item.classList.toggle('active');
            });
        }
    });


    // ===========================================
    // Mobile Roadmap Accordion
    // ===========================================
    const mobileRoadmapItems = document.querySelectorAll('.mobile-roadmap-item');
    mobileRoadmapItems.forEach(item => {
        const header = item.querySelector('.mobile-roadmap-header');
        const details = item.querySelector('.mobile-roadmap-details');

        if (header && details) {
            header.addEventListener('click', function() {
                // Toggle 'active' class on the clicked item
                item.classList.toggle('active');

                // Toggle max-height for smooth open/close animation
                if (item.classList.contains('active')) {
                    details.style.maxHeight = details.scrollHeight + "px";
                } else {
                    details.style.maxHeight = null;
                }

                // Close other open items
                mobileRoadmapItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.mobile-roadmap-details').style.maxHeight = null;
                    }
                });
            });
        }
    });


    // ===========================================
    // FAQ Accordion
    // ===========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', function() {
                // Toggle 'active' class on the clicked FAQ item
                item.classList.toggle('active');

                // Toggle max-height for smooth open/close animation
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    answer.style.maxHeight = null;
                }

                // Optional: Close other open FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });
            });
        }
    });


    // ===========================================
    // Roadmap Line and Item Scroll Animation (NEW)
    // ===========================================
    const roadmapSection = document.querySelector('.product-roadmap');
    const desktopTimelineWrapper = document.querySelector('.timeline-wrapper');
    const mobileRoadmapWrapper = document.querySelector('.mobile-roadmap-wrapper');

    function checkRoadmapVisibility() {
        if (!roadmapSection) return; // Exit if roadmap section doesn't exist

        const triggerBottom = window.innerHeight * 0.8; // Trigger when 80% of viewport is scrolled
        const roadmapSectionTop = roadmapSection.getBoundingClientRect().top;

        // Animate individual roadmap items (both desktop and mobile)
        const allRoadmapItems = document.querySelectorAll('.timeline-item, .mobile-roadmap-item');
        allRoadmapItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('revealed');
            }
        });

        // Activate line animation for desktop roadmap
        if (desktopTimelineWrapper) {
            const timelineTop = desktopTimelineWrapper.getBoundingClientRect().top;
            if (timelineTop < triggerBottom && !desktopTimelineWrapper.classList.contains('animated')) {
                desktopTimelineWrapper.classList.add('animated');
            }
        }

        // Activate line animation for mobile roadmap
        if (mobileRoadmapWrapper) {
            const mobileRoadmapTop = mobileRoadmapWrapper.getBoundingClientRect().top;
            if (mobileRoadmapTop < triggerBottom && !mobileRoadmapWrapper.classList.contains('animated')) {
                mobileRoadmapWrapper.classList.add('animated');
            }
        }
    }

    // Initial check on load
    checkRoadmapVisibility();

    // Check on scroll
    window.addEventListener('scroll', checkRoadmapVisibility);
    window.addEventListener('resize', checkRoadmapVisibility); // Recheck on resize


    // ===========================================
    // Modal functionality
    // ===========================================
    // Use .open-beta-modal class for buttons that open the modal
    const openModalButtons = document.querySelectorAll('.open-beta-modal');
    const modal = document.getElementById('betaFormModal'); // Corrected ID here
    const closeModalBtn = document.querySelector('.modal .close-button'); // Ensure it targets the close button within the modal

    if (openModalButtons.length > 0 && modal && closeModalBtn) {
        openModalButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                modal.style.display = 'flex';
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

}); // End of DOMContentLoaded
