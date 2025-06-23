// ===========================================
// ЗАГРУЗКА HEADER И FOOTER (ДОБАВЛЕННЫЙ БЛОК)
// ===========================================
const loadComponent = async (url, placeholderId) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error loading ${url}: Status ${response.status}`);
        }
        const data = await response.text();
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.innerHTML = data;
        }
    } catch (error) {
        console.error(`Failed to load component: ${error}`);
    }
};

// Загрузка компонентов header и footer при загрузке DOM
document.addEventListener('DOMContentLoaded', async function() {
    // Ждем загрузки хедера и футера перед инициализацией остального JS
    await Promise.all([
        loadComponent('header.html', 'header-placeholder'),
        loadComponent('footer.html', 'footer-placeholder')
    ]);

    // ===========================================
    // ВЕСЬ ОСТАЛЬНОЙ КОД
    // ===========================================

    // Navigation Menu Toggle (Hamburger menu for mobile and specific tablets)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mainNavOverlay = document.querySelector('.main-nav-overlay');

    if (menuToggle && mainNav && mainNavOverlay) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mainNavOverlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Предотвращает скролл фона
        });

        // Закрытие меню при клике на оверлей
        mainNavOverlay.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mainNavOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        // Закрытие меню при клике вне меню и кнопки-гамбургера
        document.addEventListener('click', function(event) {
            if (mainNav.classList.contains('active') &&
                !menuToggle.contains(event.target) &&
                !mainNav.contains(event.target)) { // Убрал mainNavOverlay.contains(event.target) т.к. оверлей сам закрывает меню
                mainNav.classList.remove('active');
                mainNavOverlay.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

        // Закрытие мобильного меню при клике на ссылку
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
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId.length > 1) { // Убедимся, что это не просто #
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Используем getComputedStyle для получения реального значения height, включая padding и border
                    const header = document.querySelector('.main-header');
                    const headerOffset = header ? parseFloat(getComputedStyle(header).height) : 0; // Получаем высоту как число

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
            // document.body.addEventListener(eventName, preventDefaults, false); // Убрано, чтобы не перехватывать глобально
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

        async function handleFiles(files) {
            fileList.innerHTML = ''; // Очищаем список файлов перед новой загрузкой
            if (files.length === 0) { // Если файлов нет (например, пользователь отменил выбор)
                uploadProgressBarContainer.style.display = 'none';
                uploadStatusText.style.display = 'none';
                return;
            }

            uploadProgressBarContainer.style.display = 'block';
            uploadStatusText.style.display = 'block';
            uploadStatusText.textContent = 'Preparing files...';
            uploadProgressBar.style.width = '0%';
            uploadProgressBar.setAttribute('aria-valuenow', '0');

            const formData = new FormData();
            let validFilesCount = 0;
            const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // MIME types for PDF and DOCX

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (allowedFileTypes.includes(file.type)) {
                    formData.append('files[]', file);
                    const listItem = document.createElement('div');
                    listItem.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                    fileList.appendChild(listItem);
                    validFilesCount++;
                } else {
                    const listItem = document.createElement('div');
                    listItem.textContent = `Rejected: ${file.name} (Invalid file type. Only PDF and DOCX.)`;
                    listItem.style.color = 'red';
                    fileList.appendChild(listItem);
                }
            }

            if (validFilesCount === 0) {
                uploadStatusText.textContent = 'No valid files selected. Only PDF and DOCX are allowed.';
                uploadProgressBarContainer.style.display = 'none';
                setTimeout(() => {
                    uploadStatusText.style.display = 'none';
                    fileList.innerHTML = '';
                }, 3000);
                return;
            }

            uploadStatusText.textContent = 'Uploading... 0%';

            try {
                const response = await fetch('/api/upload_cv.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    // Simulate progress bar filling up after successful upload
                    let progress = 0;
                    const fillProgress = setInterval(() => {
                        progress += 20; // Fast fill
                        if (progress >= 100) {
                            progress = 100;
                            clearInterval(fillProgress);
                        }
                        uploadProgressBar.style.width = `${progress}%`;
                        uploadProgressBar.setAttribute('aria-valuenow', progress.toString());
                        uploadStatusText.textContent = `Upload Complete! ${progress}%`;

                        if (progress === 100) {
                            setTimeout(() => {
                                uploadStatusText.textContent = 'Upload Successful!';
                                setTimeout(() => { // Hide after a small delay
                                    uploadProgressBarContainer.style.display = 'none';
                                    uploadStatusText.style.display = 'none';
                                    fileList.innerHTML = '';
                                }, 2000);
                            }, 500); // Give user a moment to see 100%
                        }
                    }, 100);

                    console.log('Upload successful:', result);
                    // alert('Files uploaded successfully!'); // Можно убрать, если прогресс-бар достаточен
                } else {
                    alert('Upload failed: ' + result.message);
                    console.error('Upload failed:', result);
                    uploadStatusText.textContent = 'Upload failed!';
                    uploadProgressBar.style.width = '0%'; // Reset bar on failure
                    setTimeout(() => {
                        uploadProgressBarContainer.style.display = 'none';
                        uploadStatusText.style.display = 'none';
                        fileList.innerHTML = '';
                    }, 3000);
                }
            } catch (error) {
                console.error('Error during upload:', error);
                alert('An error occurred during upload. Please try again.');
                uploadStatusText.textContent = 'Upload error!';
                uploadProgressBar.style.width = '0%'; // Reset bar on error
                setTimeout(() => {
                    uploadProgressBarContainer.style.display = 'none';
                    uploadStatusText.style.display = 'none';
                    fileList.innerHTML = '';
                }, 3000);
            }
        }
    }


    // Roadmap Accordion (Desktop & Tablet) - Unified Logic for Desktop & Mobile
    const allRoadmapItems = document.querySelectorAll('.timeline-item, .mobile-roadmap-item');

    allRoadmapItems.forEach(item => {
        const header = item.querySelector('h4'); // The H4 serves as the clickable header
        const detail = item.querySelector('.timeline-detail') || item.querySelector('.mobile-roadmap-details');
        const circle = item.querySelector('.circle') || item.querySelector('.mobile-roadmap-point');

        if (header && detail && circle) {
            const toggleAccordion = function() {
                const isActive = item.classList.contains('active');

                // Close all other active items
                allRoadmapItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherDetail = otherItem.querySelector('.timeline-detail') || otherItem.querySelector('.mobile-roadmap-details');
                        const otherCircle = otherItem.querySelector('.circle') || otherItem.querySelector('.mobile-roadmap-point');
                        if (otherDetail) {
                            otherDetail.style.maxHeight = null;
                            otherDetail.style.opacity = '0'; // Ensure opacity is reset
                        }
                        if (otherCircle) {
                            otherCircle.classList.remove('point-active'); // Remove point-active for mobile
                        }
                    }
                });

                // Toggle active state for the clicked item
                if (!isActive) {
                    item.classList.add('active');
                    // Устанавливаем maxHeight с небольшим запасом, чтобы предотвратить скрытие текста
                    detail.style.maxHeight = detail.scrollHeight + 50 + "px"; // Добавляем запас
                    detail.style.opacity = '1';
                    circle.classList.add('point-active'); // For mobile, also applies to desktop for consistency
                } else {
                    item.classList.remove('active');
                    detail.style.maxHeight = null;
                    detail.style.opacity = '0';
                    circle.classList.remove('point-active');
                }
            };

            // Initial state: If an item has the 'active' class on load (e.g., 'Now'), open it
            if (item.classList.contains('active')) {
                // Устанавливаем maxHeight с небольшим запасом, чтобы предотвратить скрытие текста
                detail.style.maxHeight = detail.scrollHeight + 50 + "px"; // Добавляем запас
                detail.style.opacity = '1';
                circle.classList.add('point-active');
            } else {
                detail.style.maxHeight = null;
                detail.style.opacity = '0';
            }

            // Add event listeners to both the header (for accessibility/text click)
            // and the circle (for visual click target)
            header.addEventListener('click', toggleAccordion);
            circle.addEventListener('click', toggleAccordion);
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
        const allRevealedItems = document.querySelectorAll('.timeline-item, .mobile-roadmap-item');
        allRevealedItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < triggerBottom) {
                item.classList.add('revealed');
            }
        });

        // Activate desktop timeline animation
        if (desktopTimelineWrapper) {
            const timelineTop = desktopTimelineWrapper.getBoundingClientRect().top;
            // Get the computed display style for the element
            const displayStyle = window.getComputedStyle(desktopTimelineWrapper).display;
            if (displayStyle !== 'none' && timelineTop < triggerBottom && !desktopTimelineWrapper.classList.contains('animated')) {
                desktopTimelineWrapper.classList.add('animated');
            }
        }

        // Activate mobile roadmap animation
        if (mobileRoadmapWrapper) {
            const mobileRoadmapTop = mobileRoadmapWrapper.getBoundingClientRect().top;
            const displayStyle = window.getComputedStyle(mobileRoadmapWrapper).display;
            if (displayStyle !== 'none' && mobileRoadmapTop < triggerBottom && !mobileRoadmapWrapper.classList.contains('animated')) {
                mobileRoadmapWrapper.classList.add('animated');
            }
        }
    }

    // Initial check and event listeners
    checkRoadmapVisibility();
    window.addEventListener('scroll', checkRoadmapVisibility);
    window.addEventListener('resize', checkRoadmapVisibility);


    // Modal functionality
    const modal = document.getElementById('betaFormModal');
    const closeModalBtn = document.querySelector('.modal .close-button');
    const betaForm = document.getElementById('betaForm'); // Получаем элемент формы

    // Используем делегирование событий для кнопок открытия модального окна
    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.open-beta-modal')) {
            event.preventDefault();
            if (modal) {
                modal.style.display = 'flex';
                // Фокусируемся на первом интерактивном элементе в модальном окне
                const firstFocusableElement = modal.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
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
            if (event.target === modal) { // Закрыть, если клик вне содержимого модала
                modal.style.display = 'none';
            }
        });

        // Ловушка фокуса внутри модального окна для доступности
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
            }

            if (modal.style.display === 'flex' && e.key === 'Tab') {
                const focusableElements = Array.from(modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
                if (focusableElements.length === 0) return; // Если нет фокусируемых элементов

                const firstFocusableElement = focusableElements[0];
                const lastFocusableElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        // Обработка отправки формы Beta (интеграция с PHP бэкендом)
        if (betaForm) {
            betaForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const notifications = document.getElementById('notifications').checked;

                if (!name || !email) {
                    alert('Please fill in all required fields (Name and Email).');
                    return;
                }

                // Basic email validation
                if (!/\S+@\S+\.\S+/.test(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }

                const formData = {
                    name: name,
                    email: email,
                    notifications: notifications
                };

                // Добавляем простую индикацию загрузки
                const submitButton = betaForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;

                try {
                    const response = await fetch('/api/submit_beta.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const result = await response.json();

                    if (result.success) {
                        alert('Success: ' + result.message);
                        modal.style.display = 'none';
                        betaForm.reset(); // Очищаем форму
                    } else {
                        alert('Error: ' + result.message);
                    }
                } catch (error) {
                    console.error('Error submitting beta form:', error);
                    alert('An error occurred while submitting. Please try again.');
                } finally {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
            });
        }
    }
});
