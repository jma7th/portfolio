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

        async function fetchConfig() {
            try {
                const response = await fetch('allowed-urls.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return await response.json();
            } catch (error) {
                console.error('Failed to fetch config:', error);
                return null;
            }
        }

    document.addEventListener('DOMContentLoaded', async function() {
            const config = await fetchConfig();
            if (!config) {
                console.error('Config is null, cannot proceed');
                return;
            }

            const games = config.games;
            const params = getQueryParams();
            const iframeSrc = params['iframeSrc'];
            const iframeWidth = params['width'] || '360'; // Default width
            const iframeHeight = params['height'] || '640'; // Default height

            const iframe = document.getElementById('game-iframe');
            iframe.width = iframeWidth;
            iframe.height = iframeHeight;

            const game = config.games.find(game => game.url === iframeSrc);
            if (game) {
                iframe.src = game.url;
                document.getElementById('game-title').textContent = game.title 
                document.getElementById('game-authors').textContent =  game.author  || 'a game made by jma7th'
            } else {
                document.getElementById('game-iframe').src = 'https://jma7th.github.io/Pareamento-Alpha/';
                document.getElementById('game-title').textContent = 'Pareamento Alpha';
                document.getElementById('game-authors').textContent = 'a game by jma7th';
                iframe.width = iframeWidth;
                iframe.height = iframeHeight;
                // Optionally, you can show an error message or handle the invalid URL case
                console.error('Invalid iframeSrc URL');
            }
        });