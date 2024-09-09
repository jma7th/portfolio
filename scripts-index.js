document.addEventListener('DOMContentLoaded', async function() {
    
    const itemsPerPage = 5; // Number of items to display per page
    let currentPage = 1;
    let totalPages = 1;
    let allGames = []; // Store all games data
    let filteredGames = []; // Store filtered games data
    let currentLanguage = 'en'; // Default language

    async function fetchGames() {
        try {
            const response = await fetch('allowed-urls.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch games:', error);
            return null;
        }
    }

    // game functions
    
    function toggleFullscreen() {
        var iframe = document.querySelector('iframe');
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            iframe.msRequestFullscreen();
        }
        
    }

    
    // render page

    function renderPage(games, page) {
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = ''; // Clear existing content

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageGames = games.slice(start, end);

        pageGames.forEach(game => {
            if (game.hidden) {
                return; // Skip this game if it is hidden
            }

            const projectDiv = document.createElement('div');
            projectDiv.className = 'project';

            const projectLink = document.createElement('a');
            //projectLink.href = `game.html?iframeSrc=${game.url}&width=${game.width}&height=${game.height}`; // Concatenate the URL with width and height
            
            projectLink.addEventListener('click', function() {
                const iframe =  document.getElementById('game-iframe')
                const fullscreen = document.getElementById('game-fullscreen')
                fullscreen.addEventListener('click', toggleFullscreen)
                

                // Set the source of the iframe
                iframe.src = `iframe.html?iframeSrc=${game.url}&width=${game.width}&height=${game.height}`; // Concatenate the URL with width and height
                iframe.width = game.width;
                iframe.height = game.height;

                if (game.width > game.height && window.screen.orientation) {
                    rotatescreen('landscape');
                    toggleFullscreen();
                } else {
                    rotatescreen('portrait');
                    toggleFullscreen();
                }
                window.scrollTo(0, 0);
                // Append the iframe to the projectLink element
                currentSectionIndex = 0;
                showSection(currentSectionIndex)
              });


            const projectTitle = document.createElement('h3');
            projectTitle.textContent = game.title;

            const projectAuthor = document.createElement('p');
            projectAuthor.textContent = game.author[currentLanguage];

            const projectImage = document.createElement('img');
            projectImage.src = game.image;
            projectImage.alt = game.title;

            const projectDescription = document.createElement('p');
            projectDescription.textContent = game.description[currentLanguage];

            const projectTags = document.createElement('p');
            projectTags.textContent = `${game.tags ? game.tags.join(', ') : 'No tags available'}`;

            projectLink.appendChild(projectTitle);
            projectLink.appendChild(projectAuthor);
            projectLink.appendChild(projectImage);
            projectDiv.appendChild(projectLink);
            projectDiv.appendChild(projectDescription);
            projectDiv.appendChild(projectTags);
            projectsGrid.appendChild(projectDiv);

            // Apply landscape class if the game requires landscape orientation
            if (game.width > game.height) {
                projectDiv.classList.add('landscape');
            }
        });

        //document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
        document.getElementById('prev-page').disabled = page === 1;
        document.getElementById('next-page').disabled = page === totalPages;
    }

    function filterGames(query) {
        query = query.toLowerCase();
        filteredGames = allGames.filter(game => {
            const titleMatch = game.title.toLowerCase().includes(query);
            const tagsMatch = game.tags && game.tags.some(tag => tag.toLowerCase().includes(query));
            return titleMatch || tagsMatch;
        });
        totalPages = Math.ceil(filteredGames.length / itemsPerPage);
        currentPage = 1; // Reset to first page
        renderPage(filteredGames, currentPage);
    }

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
                { id: 'game-fullscreen', html: translations.game.fullscreen },
                { id: 'prev-page', text: translations.pagination.previous },
                { id: 'next-page', text: translations.pagination.next },
                { id: 'nav-about', text: translations.nav.about },
                { id: 'nav-projects', text: translations.nav.projects },
                { id: 'nav-contact', text: translations.nav.contact },
                { id: 'page-info', text: translations.pagination.page+` ${currentPage} `+translations.pagination.of+` ${totalPages}`}
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
    let currentSectionIndex = 1;

    
    function showSection(index) {
        const sectionWidth = sections[0].offsetWidth;
       
        sectionsWrapper.style.transform = `translateX(-${index * sectionWidth}px)`;

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === sections[index].id) {
                link.classList.add('active');
            }
        });

        prevButton.disabled = index === 0;
        nextButton.disabled = index === sections.length - 1;

        if (index === 1) {
            document.getElementById('prev-page').style.display = 'inline';
            document.getElementById('page-info').style.display = 'inline';
            document.getElementById('next-page').style.display = 'inline';
        } else {
            document.getElementById('prev-page').style.display = 'none';
            document.getElementById('page-info').style.display = 'none';
            document.getElementById('next-page').style.display = 'none';
        }
    }

    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetIndex = Array.from(sections).findIndex(section => section.id === targetId);
            if (targetIndex !== -1) {
                currentSectionIndex = targetIndex;
                showSection(currentSectionIndex);
            }
        });
    });

    prevButton.addEventListener('click', () => {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            showSection(currentSectionIndex);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            showSection(currentSectionIndex);
        }
    });

    // Show the first section by default
    showSection(currentSectionIndex);

    const gamesData = await fetchGames();
    if (!gamesData) {
        console.error('Games data is null, cannot proceed');
        return;
    }

    allGames = gamesData.games.filter(game => !game.hidden);
    filteredGames = allGames;
    totalPages = Math.ceil(filteredGames.length / itemsPerPage);

    renderPage(filteredGames, currentPage);

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(filteredGames, currentPage);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(filteredGames, currentPage);
        }
    });

    document.getElementById('search-input').addEventListener('input', (event) => {
        filterGames(event.target.value);
    });

    document.getElementById('language-selector').addEventListener('change', (event) => {
        loadLanguage(event.target.value);
    });

    // Load default language
    loadLanguage('en');
});