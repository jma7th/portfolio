
            function getOppositeOrientation() {
              return screen
                .orientation
                .type
                .startsWith("portrait") ? "landscape" : "portrait";
            }            
            async function rotatescreen(newOrientation) {
              if (!document.fullscreenElement) {
                await toggleFullscreen();
              }
              await screen.orientation.lock(newOrientation);
            }
