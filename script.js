document.addEventListener('DOMContentLoaded', () => {

    // Функция для загрузки HTML из файла в placeholder
    async function loadTemplate(placeholderId, templatePath) {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            try {
                const response = await fetch(templatePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const html = await response.text();
                placeholder.innerHTML = html;
            } catch (error) {
                console.error(`Error loading template ${templatePath}:`, error);
                // Можно добавить резервный контент или сообщение об ошибке
                placeholder.innerHTML = `<p style="color: red;">Failed to load ${templatePath}</p>`;
            }
        }
    }

    // Загружаем Header и Footer
    loadTemplate('header-placeholder', 'header-template.html')
        .then(() => {
            // После загрузки header, инициализируем его скрипты
            initializeHeaderScripts();
        });
    loadTemplate('footer-placeholder', 'footer-template.html');


    // -------------------- 1. Мобильное меню (теперь функция, вызываемая после загрузки header) --------------------
    function initializeHeaderScripts() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const mainNavOverlay = document.querySelector('.main-nav-overlay');

        if (menuToggle && mainNav && mainNavOverlay) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                mainNav.classList.toggle('active');
                mainNavOverlay.classList.toggle('active');
            });

            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                        mainNavOverlay.classList.remove('active');
                    }
                });
            });

            document.addEventListener('click', (e) => {
                if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    mainNav.classList.remove('active');
                    mainNavOverlay.classList.remove('active');
                }
            });

            mainNavOverlay.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mainNavOverlay.classList.remove('active');
            });

            // Инициализация кнопок модального окна после загрузки хедера
            initializeModal();
        }
    }


    // -------------------- 2. Модальное окно для "Join Beta" (теперь функция) --------------------
    function initializeModal() {
        const betaFormModal = document.getElementById('betaFormModal');
        const openBetaButtons = document.querySelectorAll('.open-beta-modal');
        const closeButtons = document.querySelectorAll('.close-button');

        openBetaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (betaFormModal) {
                    betaFormModal.style.display = 'flex';
                }
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', (event) => {
            if (event.target === betaFormModal) {
                betaFormModal.style.display = 'none';
            }
        });

        const betaForm = document.getElementById('betaForm');
        if (betaForm) {
            betaForm.addEventListener('submit', (event) => {
                event.preventDefault();
                alert('Thank you for your interest! Your submission has been received.');
                if (betaFormModal) {
                    betaFormModal.style.display = 'none';
                }
                betaForm.reset();
            });
        }
    }
    // initializeModal() вызывается из initializeHeaderScripts после загрузки хедера

    // -------------------- 3. Аккордеон для FAQ --------------------
    // Убедимся, что FAQ-элементы существуют на текущей странице
    if (document.querySelector('.faq-question')) {
        document.querySelectorAll('.faq-question').forEach(item => {
            item.addEventListener('click', () => {
                const faqItem = item.parentElement;
                const answer = item.nextElementSibling;
                const plusIcon = item.querySelector('.plus');
                
                const wasActive = faqItem.classList.contains('active');

                document.querySelectorAll('.faq-item').forEach(el => {
                    if (el !== faqItem) {
                        el.classList.remove('active');
                        el.querySelector('.faq-answer').style.maxHeight = '0';
                        el.querySelector('.faq-question .plus').style.transform = 'rotate(0deg)';
                    }
                });
                
                if (!wasActive) {
                    faqItem.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    if (plusIcon) plusIcon.style.transform = 'rotate(45deg)';
                } else {
                    faqItem.classList.remove('active');
                    answer.style.maxHeight = '0';
                    if (plusIcon) plusIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }


    // -------------------- 4. Аккордеон для Мобильного Роадмапа --------------------
    // Убедимся, что элементы роадмапа существуют на текущей странице
    if (document.querySelector('.mobile-roadmap-item')) {
        document.querySelectorAll('.mobile-roadmap-item').forEach(item => {
            item.addEventListener('click', (event) => {
                if (event.target.classList.contains('mobile-roadmap-point') || event.target.tagName === 'H4') {
                    // Это OK
                } else {
                    return; // Игнорируем клики, если это не точка или заголовок
                }

                const mobileRoadmapItem = item;
                const details = mobileRoadmapItem.querySelector('.mobile-roadmap-details');
                
                const wasActive = mobileRoadmapItem.classList.contains('active');

                document.querySelectorAll('.mobile-roadmap-item').forEach(el => {
                    if (el !== mobileRoadmapItem) {
                        el.classList.remove('active');
                        el.querySelector('.mobile-roadmap-details').style.maxHeight = '0';
                        el.querySelector('.mobile-roadmap-details').style.opacity = '0';
                    }
                });

                if (!wasActive) {
                    mobileRoadmapItem.classList.add('active');
                    details.style.maxHeight = details.scrollHeight + 'px';
                    details.style.opacity = '1';
                } else {
                    mobileRoadmapItem.classList.remove('active');
                    details.style.maxHeight = '0';
                    details.style.opacity = '0';
                }
            });
        });
    }

    // -------------------- 5. Анимация появления элементов мобильного роадмапа при скролле --------------------
    const roadmapItems = document.querySelectorAll('.mobile-roadmap-item');

    // Применяем IntersectionObserver только если есть элементы роадмапа
    if (roadmapItems.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // observer.unobserve(entry.target); // Optional: Stop observing once revealed
                } else {
                    // entry.target.classList.remove('revealed'); // Optional: Remove if scrolls out
                }
            });
        }, observerOptions);

        roadmapItems.forEach(item => {
            observer.observe(item);
        });
    }


    // -------------------- 6. Логика Drag and Drop для загрузки файлов (с анимацией) --------------------
    // Убедимся, что секция загрузки файлов существует на текущей странице
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) { // Проверяем существование uploadArea перед инициализацией
        const uploadButton = document.getElementById('uploadButton');
        const fileInput = document.getElementById('fileInput');
        const fileList = document.getElementById('fileList');
        const uploadProgressContainer = document.getElementById('uploadProgressContainer');
        const uploadProgressBar = document.getElementById('uploadProgressBar');
        const uploadStatusText = document.getElementById('uploadStatusText');

        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
        });
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        uploadArea.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            uploadArea.classList.add('highlight');
        }

        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            fileList.innerHTML = '';
            if (files.length === 0) {
                return;
            }

            uploadProgressContainer.style.display = 'block';
            uploadStatusText.style.display = 'block';
            uploadProgressBar.style.width = '0%';
            uploadStatusText.textContent = 'Uploading files... 0%';

            const totalFiles = files.length;

            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress <= 100) {
                    uploadProgressBar.style.width = `${progress}%`;
                    uploadStatusText.textContent = `Uploading files... ${progress}%`;
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    uploadStatusText.textContent = 'Upload complete!';
                    uploadArea.classList.remove('highlight');

                    setTimeout(() => {
                        for (const file of files) {
                            const fileItem = document.createElement('div');
                            fileItem.textContent = `- ${file.name}`;
                            fileList.appendChild(fileItem);
                        }
                        alert(`${totalFiles} file(s) successfully processed.`);
                        
                        setTimeout(() => {
                            uploadProgressContainer.style.display = 'none';
                            uploadStatusText.style.display = 'none';
                            fileList.innerHTML = '';
                        }, 2000);
                    }, 500);
                }
            }, 150);
        }
    }
});
