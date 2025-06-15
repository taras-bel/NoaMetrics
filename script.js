document.addEventListener('DOMContentLoaded', () => {

    // -------------------- 1. Мобильное меню --------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mainNavOverlay = document.querySelector('.main-nav-overlay'); // Добавлено
    
    if (menuToggle && mainNav && mainNavOverlay) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mainNavOverlay.classList.toggle('active'); // Активируем оверлей
        });

        // Закрываем меню при клике на ссылку
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mainNavOverlay.classList.remove('active'); // Деактивируем оверлей
                }
            });
        });

        // Закрываем меню при клике на оверлей
        mainNavOverlay.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mainNavOverlay.classList.remove('active');
        });
    }

    // -------------------- 2. Модальное окно для "Join Beta" --------------------
    const betaFormModal = document.getElementById('betaFormModal');
    const openBetaButtons = document.querySelectorAll('.open-beta-modal');
    const closeButtons = document.querySelectorAll('.close-button');

    // Открытие модального окна
    openBetaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (betaFormModal) {
                betaFormModal.style.display = 'flex';
            }
        });
    });

    // Закрытие модального окна
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    // Закрытие при клике вне окна
    window.addEventListener('click', (event) => {
        if (event.target === betaFormModal) {
            betaFormModal.style.display = 'none';
        }
    });

    // Обработка отправки формы
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

            // Закрываем все открытые ответы и сбрасываем иконки
            document.querySelectorAll('.faq-item').forEach(el => {
                if (el !== faqItem) { // Закрываем только те, что не текущий
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').style.maxHeight = '0';
                    el.querySelector('.faq-question .plus').style.transform = 'rotate(0deg)'; // Сброс иконки
                }
            });
            
            // Если кликнутый элемент не был активен, открываем его
            if (!wasActive) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                plusIcon.style.transform = 'rotate(45deg)'; // Изменение иконки на "минус"
            } else {
                // Если был активен, то закрываем его
                faqItem.classList.remove('active');
                answer.style.maxHeight = '0';
                plusIcon.style.transform = 'rotate(0deg)'; // Сброс иконки
            }
        });
    });

    // -------------------- 4. Логика Drag and Drop для загрузки файлов --------------------
    const uploadArea = document.getElementById('uploadArea');
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    if (uploadArea && uploadButton && fileInput && fileList) {
        // Клик по кнопке "Upload" открывает диалог выбора файла
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        // Обработка выбора файлов через диалог
        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
        });
        
        // Предотвращаем стандартное поведение браузера
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            // document.body.addEventListener(eventName, preventDefaults, false); // Это может помешать другим drag-and-drop функциям на странице
        });

        // Подсветка зоны при перетаскивании файла
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        // Обработка перетаскивания файла
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
            // fileList.innerHTML = ''; // Убрано, чтобы добавлять новые файлы к существующим
            if (files.length === 0) {
                return;
            }

            // Создаем список имен файлов для отображения
            for (const file of files) {
                const fileItem = document.createElement('div');
                fileItem.textContent = `- ${file.name}`;
                fileList.appendChild(fileItem);
            }
            
            // Здесь можно добавить логику для реальной загрузки файлов на сервер
            console.log("Files ready to be uploaded:", files);
            alert(`${files.length} file(s) selected. In a real app, they would now be uploaded.`);
        }
    }
});
