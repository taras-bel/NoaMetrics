document.addEventListener('DOMContentLoaded', async function() {

    // ===========================================
    // ЗАГРУЗКА HEADER И FOOTER (ДОБАВЛЕННЫЙ БЛОК)
    // ===========================================
    const loadComponent = async (url, placeholderId) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки ${url}: Статус ${response.status}`);
            }
            const data = await response.text();
            const placeholder = document.getElementById(placeholderId);
            if (placeholder) {
                placeholder.innerHTML = data;
            }
        } catch (error) {
            console.error(`Не удалось загрузить компонент: ${error}`);
        }
    };

    // Ожидаем завершения загрузки хедера и футера перед выполнением остальных скриптов
    await Promise.all([
        loadComponent('header.html', 'header-placeholder'),
        loadComponent('footer.html', 'footer-placeholder')
    ]);

    // ===========================================
    // ВЕСЬ ОСТАЛЬНОЙ КОД, КОТОРЫЙ У ВАС УЖЕ БЫЛ
    // И НОВЫЕ ИСПРАВЛЕНИЯ
    // ===========================================

    // Navigation Menu Toggle (Hamburger menu for mobile and specific tablets)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mainNavOverlay = document.querySelector('.main-nav-overlay');

    if (menuToggle && mainNav && mainNavOverlay) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mainNavOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking on the overlay
        mainNavOverlay.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mainNavOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        // Close mobile menu when a nav link is clicked
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Check if the menu is active before closing
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mainNavOverlay.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }


    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            // Проверяем, что это не просто "#"
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = document.querySelector('.main-header') ? document.querySelector('.main-header').offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            }
        });
    });


    // Upload Area Drag & Drop and File Handling
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadProgressBarContainer = document.querySelector('.upload-progress-container');
    const uploadProgressBar = document.querySelector('.upload-progress-bar');
    const uploadStatusText = document.querySelector('.upload-status-text');

    if (uploadArea && uploadButton && fileInput && fileList && uploadProgressBarContainer && uploadProgressBar && uploadStatusText) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('highlight'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('highlight'), false);
        });

        uploadArea.addEventListener('drop', handleDrop, false);
        uploadButton.addEventListener('click', () => fileInput.click());
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
            fileList.innerHTML = '';
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
                        }, 2000);
                    }
                }, 200);
            }
        }
    }


    // Roadmap Dot Interaction (Desktop & Tablet)
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        // Updated: Click on the entire item or just the circle to toggle active state
        item.addEventListener('click', function() {
            const isActive = this.classList.contains('active');

            // Close all other active items
            timelineItems.forEach(i => {
                if (i !== this && i.classList.contains('active')) {
                    i.classList.remove('active');
                }
            });

            // Toggle active state for the clicked item
            this.classList.toggle('active', !isActive);
        });
    });


    // Mobile Roadmap Accordion
    const mobileRoadmapItems = document.querySelectorAll('.mobile-roadmap-item');
    mobileRoadmapItems.forEach(item => {
        const header = item.querySelector('.mobile-roadmap-header');
        const details = item.querySelector('.mobile-roadmap-details');

        if (header && details) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                mobileRoadmapItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.mobile-roadmap-details').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    details.style.maxHeight = details.scrollHeight + "px";
                }
            });
        }
    });


    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    }
                });

                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                } else {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                }
            });
        }
    });


    // Roadmap Line and Item Scroll Animation
    const roadmapSection = document.querySelector('.product-roadmap');
    const desktopTimelineWrapper = document.querySelector('.timeline-wrapper');
    const mobileRoadmapWrapper = document.querySelector('.mobile-roadmap-wrapper');

    function checkRoadmapVisibility() {
        if (!roadmapSection) return;

        const triggerBottom = window.innerHeight * 0.8;
        const allRoadmapItems = document.querySelectorAll('.timeline-item, .mobile-roadmap-item');
        allRoadmapItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('revealed');
            }
        });

        if (desktopTimelineWrapper) {
            const timelineTop = desktopTimelineWrapper.getBoundingClientRect().top;
            if (timelineTop < triggerBottom && !desktopTimelineWrapper.classList.contains('animated')) {
                desktopTimelineWrapper.classList.add('animated');
            }
        }

        if (mobileRoadmapWrapper) {
            const mobileRoadmapTop = mobileRoadmapWrapper.getBoundingClientRect().top;
            if (mobileRoadmapTop < triggerBottom && !mobileRoadmapWrapper.classList.contains('animated')) {
                mobileRoadmapWrapper.classList.add('animated');
            }
        }
    }

    checkRoadmapVisibility();
    window.addEventListener('scroll', checkRoadmapVisibility);
    window.addEventListener('resize', checkRoadmapVisibility);


    // Modal functionality
    const modal = document.getElementById('betaFormModal');
    const closeModalBtn = document.querySelector('.modal .close-button');

    // Используем делегирование событий для кнопок открытия модального окна,
    // так как они могут быть загружены динамически
    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.open-beta-modal')) {
            event.preventDefault();
            if (modal) {
                modal.style.display = 'flex';
            }
        }
    });

    if (modal) {
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

});
