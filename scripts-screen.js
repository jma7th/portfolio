
            function getOppositeOrientation() {
              return screen
                .orientation
                .type
                .startsWith("portrait") ? "landscape" : "portrait";
            }            
            async function rotatescreen(newOrientation) {
              
              if (!document.fullscreenElement) {
                await document.getElementById('game-iframe').requestFullscreen();

              }
              await screen.orientation.lock(newOrientation);
            }
