document.addEventListener('DOMContentLoaded', async function() {
    const titleFont = 'VT323';
    const titleFontSize = '4em';
    const titleFontStyle = 'monospace';
    const bodyFont = 'Roboto';
    const bodyFontSize = '1em';
    const bodyFontStyle = 'sans-serif';
    window.mobileCheck = function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
    const isMobile = mobileCheck();
    const itemsPerPage = 6; // Number of items to display per page
    let currentPage = 1;
    let totalPages = 1;
    let allGames = []; // Store all games data
    let filteredGames = []; // Store filtered games data
    let navLanguage = navigator.language.substring(0, 2);
    let currentLanguage = localStorage.getItem('language') || navLanguage; // Default language
    document.getElementById('language-selector').value = currentLanguage;
    
    let currentGameNumber = -1;
    let currentGameId = '-1';

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

    // run games in iframe

    function loadGameText(game) {
        const text = document.getElementById('game-text');
        const fullscreenButton = document.getElementById('game-fullscreen');
        text.innerHTML = `<span style="font-family: ${titleFont}, ${titleFontStyle}; font-size: ${titleFontSize}">${game.title}</span><br><br><span style="font-family: '${bodyFont}', ${bodyFontStyle}; font-size: ${bodyFontSize}">${game.text[currentLanguage]}</span>`; // Set the text of the game with Arial font
        fullscreenButton.textContent = document.getElementById('game-fullscreen-placeholder').textContent;
    }

    function getGameById(id) {
        return allGames.find(game => game.id === id);
    }

    function loadGame(game) {
        if (document.getElementById('game-iframe')) {
            document.getElementById('game-iframe').remove();
        }

        if (document.getElementById('game-fullscreen')) {
            document.getElementById('game-fullscreen').remove();
        }

        if (document.getElementById('game-text')) {
            document.getElementById('game-text').remove();
        }

        currentGameId = game.id;
        currentGameNumber = allGames.findIndex(game => game.id === currentGameId);
        
        

        

        // Set the source of the iframe
        
        const newframe = document.createElement('iframe');
        newframe.id = 'game-iframe';
        newframe.name = 'iframe-game';
        newframe.width = game.width;
        newframe.height = game.height;
        newframe.src = `iframe.html?iframeSrc=${game.url}&width=${game.width}&height=${game.height}`; // Concatenate the URL with width and height
        //newframe.src = game.url; // alternate
        //newframe.height = game.height;
        /*newframe.frameBorder = "0";  
        newframe.allowFullscreen = true; 
        newframe.allow = "autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated";
        newframe.style.allowTransparency = "true";
        newframe.webkitAllowFullScreen = true;
        newframe.mozAllowFullScreen = true;
        newframe.msAllowFullScreen = true; 
        newframe.style.overflow = "hidden";
*/
        newframe.frameborder="0"  
        newframe.allowfullscreen="true" 
        newframe.allow = "autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated";
        newframe.allowtransparency="true";
        newframe.webkitallowfullscreen="true";
        newframe.mozallowfullscreen="true";
        newframe.msallowfullscreen="true"; 
        newframe.scrolling="no";

        document.getElementById('game-container').appendChild(newframe);

        const fullscreenButton = document.createElement('a');
        const gameTextBox = document.createElement('p');

        fullscreenButton.id = 'game-fullscreen';

        gameTextBox.id = 'game-text';

        document.getElementById('game-div').appendChild(fullscreenButton);
        document.getElementById('game-div').appendChild(gameTextBox);

        loadGameText(game);

        if (game.width > game.height) {
            if (isMobile) {
                rotatescreen('landscape');
            }
            fullscreenButton.addEventListener('click', function() {
                rotatescreen('landscape');
            });
        } else {
            if (isMobile) {
               rotatescreen('portrait');
            }
            fullscreenButton.addEventListener('click', function() {
                rotatescreen('portrait');
            });
        }
        window.scrollTo(0, 0);
        // Append the iframe to the projectLink element
        currentSectionIndex = 0;
        showSection(currentSectionIndex)
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

            const projectLink = document.createElement('p');
            //projectLink.href = `game.html?iframeSrc=${game.url}&width=${game.width}&height=${game.height}`; // Concatenate the URL with width and height
            
            projectLink.addEventListener('click', function() {
                
                history.pushState(null, '', `?game=${game.id}`);
                loadGame(game);
              });

               

            const projectTitle = document.createElement('h2');
            projectTitle.textContent = game.title;

            const projectAuthor = document.createElement('p');
            projectAuthor.textContent = `${game.author[currentLanguage]}`;
            const projectAuthorBr = document.createElement('p');


            const projectImage = document.createElement('img');
            projectImage.src = game.image;
            projectImage.alt = game.title;
            projectImage.width = 200;
            projectImage.height = 200;

            const projectDescription = document.createElement('p');
            projectDescription.textContent = game.description[currentLanguage];

            

            const projectTags = document.createElement('p');
            projectTags.textContent = `${game.tags ? game.tags.join(', ') : 'No tags available'}`;

            projectLink.appendChild(projectTitle);
            projectLink.appendChild(projectAuthor);
            projectLink.appendChild(projectAuthorBr);
            projectLink.appendChild(projectImage);
            projectDiv.appendChild(projectLink);
            projectDiv.appendChild(projectDescription);
            projectDiv.appendChild(projectTags);
            projectsGrid.appendChild(projectDiv);
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
                //{ id: 'projects-title', text: translations.projects.title },
                { id: 'search-input', attribute: 'placeholder', text: translations.projects.searchPlaceholder },
                { id: 'contact-title', text: translations.contact.title },
                { id: 'contact-email', html: translations.contact.email },
                { id: 'game-fullscreen-placeholder', html: translations.game.fullscreen },
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
            loadGameText(allGames[currentGameNumber]); // Update the game text 
            renderPage(filteredGames, currentPage); // Re-render the page with the new language
            localStorage.setItem('language', lang); // Save the language preference');
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

        prevButton.disabled = (index === 0 || index === 1 && currentGameNumber === -1);
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
    try {
        loadLanguage(currentLanguage) 
    }
    catch (error) {
        console.error('Failed to load default language:', error);
    }

    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const regex = /([^&=]+)=([^&]*)/g;
        let m;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return params;
    }
    const params = getQueryParams();
    const URLGame = params['game'];
    loadGame(getGameById(URLGame));

});