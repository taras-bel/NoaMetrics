document.addEventListener('DOMContentLoaded', () => {
    // JavaScript for FAQ accordion
    document.querySelectorAll('.faq-question').forEach(item => {
        item.addEventListener('click', event => {
            const answer = item.nextElementSibling;
            const plusIcon = item.querySelector('.plus');

            // Toggle visibility of the answer
            if (answer.classList.contains('show')) {
                answer.classList.remove('show');
                answer.style.maxHeight = '0';
                if (plusIcon) {
                    plusIcon.style.transform = 'rotate(0deg)';
                }
            } else {
                // Close other open FAQ items
                document.querySelectorAll('.faq-answer.show').forEach(openAnswer => {
                    openAnswer.classList.remove('show');
                    openAnswer.style.maxHeight = '0';
                    const openPlusIcon = openAnswer.previousElementSibling.querySelector('.plus');
                    if (openPlusIcon) {
                        openPlusIcon.style.transform = 'rotate(0deg)';
                    }
                });

                // Open current FAQ item
                answer.classList.add('show');
                answer.style.maxHeight = answer.scrollHeight + 'px'; // Set max-height for smooth transition
                if (plusIcon) {
                    plusIcon.style.transform = 'rotate(45deg)';
                }
            }
        });
    });

    // JavaScript for hamburger menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Optional: Close menu when a navigation link is clicked (for mobile)
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // Modals functionality for Join Beta / Get on Wait-List
    const betaFormModal = document.getElementById('betaFormModal');
    const closeButtons = document.querySelectorAll('.close-button');
    const joinBetaButtons = document.querySelectorAll('.join-beta-btn, .get-waitlist-btn');

    joinBetaButtons.forEach(button => {
        button.addEventListener('click', () => {
            betaFormModal.style.display = 'flex';
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
        if (event.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });

    // Handle form submission
    const betaForm = document.getElementById('betaForm');
    betaForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const notifications = document.getElementById('notifications').checked;

        alert(`Thanks for your interest, ${name}! Your email ${email} has been submitted. Notifications: ${notifications ? 'Yes' : 'No'}.`);
        betaFormModal.style.display = 'none';
        betaForm.reset(); // Clear the form
    });

    // Drag and Drop Upload Functionality
    const uploadButton = document.querySelector('.upload-button');
    const uploadModal = document.getElementById('uploadModal');
    const dragDropArea = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('fileInput');
    const browseFilesButton = document.getElementById('browseFilesButton');
    const fileList = document.getElementById('fileList');

    uploadButton.addEventListener('click', () => {
        uploadModal.style.display = 'flex';
    });

    browseFilesButton.addEventListener('click', () => {
        fileInput.click(); // Trigger the hidden file input
    });

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragDropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dragDropArea.classList.add('highlight');
    }

    function unhighlight() {
        dragDropArea.classList.remove('highlight');
    }

    dragDropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        fileList.innerHTML = ''; // Clear previous list
        if (files.length === 0) {
            fileList.innerHTML = '<div>No files selected.</div>';
            return;
        }

        for (const file of files) {
            const listItem = document.createElement('div');
            listItem.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            fileList.appendChild(listItem);
            // In a real application, you would upload the file here
            // console.log('File to upload:', file);
        }
        alert('Files ready for upload! (This is a demo, actual upload functionality is not implemented)');
    }

    // Scroll-based animations (On-Scroll Reveal)
    const animateOnScrollElements = document.querySelectorAll('.benefit-item-list, .timeline-item');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(el => {
        observer.observe(el);
    });
});


