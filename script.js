document.addEventListener('DOMContentLoaded', () => {

    // -------------------- 1. Мобильное меню --------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mainNavOverlay = document.querySelector('.main-nav-overlay');
    
    if (menuToggle && mainNav && mainNavOverlay) {
        menuToggle.addEventListener('click', () => {
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

        mainNavOverlay.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mainNavOverlay.classList.remove('active');
        });
    }

    // -------------------- 2. Модальное окно для "Join Beta" --------------------
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

    // -------------------- 3. Аккордеон для FAQ --------------------
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
                plusIcon.style.transform = 'rotate(45deg)';
            } else {
                faqItem.classList.remove('active');
                answer.style.maxHeight = '0';
                plusIcon.style.transform = 'rotate(0deg)';
            }
        });
    });

    // -------------------- 4. Логика Drag and Drop для загрузки файлов (с анимацией) --------------------
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadProgressContainer = document.getElementById('uploadProgressContainer');
    const uploadProgressBar = document.getElementById('uploadProgressBar');
    const uploadStatusText = document.getElementById('uploadStatusText');

    if (uploadArea && uploadButton && fileInput && fileList && uploadProgressContainer && uploadProgressBar && uploadStatusText) {
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
            fileList.innerHTML = ''; // Очищаем список перед добавлением новых файлов
            if (files.length === 0) {
                return;
            }

            // Показываем прогресс-бар и статус
            uploadProgressContainer.style.display = 'block';
            uploadStatusText.style.display = 'block';
            uploadProgressBar.style.width = '0%';
            uploadStatusText.textContent = 'Uploading files... 0%';

            const totalFiles = files.length;

            // Имитация загрузки
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10; // Увеличиваем прогресс
                if (progress <= 100) {
                    uploadProgressBar.style.width = `${progress}%`;
                    uploadStatusText.textContent = `Uploading files... ${progress}%`;
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    uploadStatusText.textContent = 'Upload complete!';
                    uploadArea.classList.remove('highlight'); // Убираем подсветку после завершения

                    // Добавляем имена файлов после "загрузки"
                    setTimeout(() => {
                        for (const file of files) {
                            const fileItem = document.createElement('div');
                            fileItem.textContent = `- ${file.name}`;
                            fileList.appendChild(fileItem);
                        }
                        alert(`${totalFiles} file(s) successfully processed.`);
                        
                        // Скрываем прогресс-бар через некоторое время
                        setTimeout(() => {
                            uploadProgressContainer.style.display = 'none';
                            uploadStatusText.style.display = 'none';
                            fileList.innerHTML = ''; // Очищаем список файлов после завершения
                        }, 2000); // Скрываем через 2 секунды
                    }, 500); // Задержка перед отображением списка файлов
                }
            }, 150); // Имитация загрузки каждые 150 мс
        }
    }
});
