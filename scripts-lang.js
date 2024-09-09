async function loadLanguage(lang) {
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const translations = await response.json();

        const elementsToUpdate = [
            { id: 'about-title', text: translations.about.title },
            { id: 'about-description', text: translations.about.description },
            { id: 'projects-title', text: translations.projects.title },
            { id: 'search-input', attribute: 'placeholder', text: translations.projects.searchPlaceholder },
            { id: 'contact-title', text: translations.contact.title },
            { id: 'contact-email', html: translations.contact.email },
            { id: 'prev-page', text: translations.pagination.previous },
            { id: 'next-page', text: translations.pagination.next },
            { id: 'nav-about', text: translations.nav.about },
            { id: 'nav-projects', text: translations.nav.projects },
            { id: 'nav-contact', text: translations.nav.contact }
        ];

        elementsToUpdate.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                if (item.text) {
                    element.textContent = item.text;
                }
                if (item.html) {
                    element.innerHTML = item.html;
                }
                if (item.attribute) {
                    element.setAttribute(item.attribute, item.text);
                }
            } else {
                console.warn(`Element with ID ${item.id} not found.`);
            }
        });

        currentLanguage = lang; // Update current language
        renderPage(filteredGames, currentPage); // Re-render the page with the new language
    } catch (error) {
        console.error('Failed to load language file:', error);
    }
}

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const sectionsWrapper = document.querySelector('.sections-wrapper');
const prevButton = document.getElementById('prev-section');
const nextButton = document.getElementById('next-section');
let currentSectionIndex = 0;