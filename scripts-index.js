
        const itemsPerPage = 5; // Number of items to display per page
        let currentPage = 1;
        let totalPages = 1;
        let allGames = []; // Store all games data
        let filteredGames = []; // Store filtered games data
        let currentLanguage = 'en'; // Default language

        async function fetchGames() {
            try {
                const response = await fetch('./allowed-urls.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch games:', error);
                return null;
            }
        }

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
                projectLink.href = `game.html?iframeSrc=${game.url}&width=${game.width}&height=${game.height}`; // Concatenate the URL with width and height


                const projectTitle = document.createElement('h3');
                projectTitle.textContent = game.title;

                const projectAuthor = document.createElement('p');
                projectAuthor.textContent = game.author[currentLanguage]

                const projectImage = document.createElement('img');
                projectImage.src = game.image;
                projectImage.alt = game.title;

                const projectDescription = document.createElement('p');
                projectDescription.textContent = game.description[currentLanguage];

                const projectTags = document.createElement('p');
                projectTags.textContent = `Tags: ${game.tags ? game.tags.join(', ') : 'No tags available'}`;

                projectLink.appendChild(projectTitle);
                projectLink.appendChild(projectAuthor);
                projectLink.appendChild(projectImage);
                projectDiv.appendChild(projectLink);
                projectDiv.appendChild(projectDescription);
                projectDiv.appendChild(projectTags);
                projectsGrid.appendChild(projectDiv);
            });

            document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
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
                document.getElementById('about-title').textContent = translations.about.title;
                document.getElementById('about-description').textContent = translations.about.description;
                document.getElementById('projects-title').textContent = translations.projects.title;
                document.getElementById('search-input').placeholder = translations.projects.searchPlaceholder;
                document.getElementById('contact-title').textContent = translations.contact.title;
                document.getElementById('contact-email').innerHTML = translations.contact.email;
                document.getElementById('prev-page').textContent = translations.pagination.previous;
                document.getElementById('next-page').textContent = translations.pagination.next;

                // Update navigation items
                document.getElementById('nav-about').textContent = translations.nav.about;
                document.getElementById('nav-projects').textContent = translations.nav.projects;
                document.getElementById('nav-contact').textContent = translations.nav.contact;

                currentLanguage = lang; // Update current language
                renderPage(filteredGames, currentPage); // Re-render the page with the new language
            } catch (error) {
                console.error('Failed to load language file:', error);
            }
        }

        document.addEventListener('DOMContentLoaded', async function() {
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
