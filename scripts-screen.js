function updateLockButton() {
              const lockButton = document.getElementById("game-fullscreen");
              const newOrientation = getOppositeOrientation();
              lockButton.textContent = `Lock to ${newOrientation}`;
            }
            
            function getOppositeOrientation() {
              return screen
                .orientation
                .type
                .startsWith("portrait") ? "landscape" : "portrait";
            }
            
            async function rotate(lockButton) {
              if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
              }
              const newOrientation = getOppositeOrientation();
              await screen.orientation.lock(newOrientation);
              updateLockButton(lockButton);
            }
            
            async function rotatescreen() {
              if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
              }
              const newOrientation = getOppositeOrientation();
              await screen.orientation.lock(newOrientation);
            }
            
            screen.orientation.addEventListener("change", updateLockButton);
            
            window.addEventListener("load", updateLockButton);