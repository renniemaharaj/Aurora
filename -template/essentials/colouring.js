let Pallete;
//Function to apply styles from configuration
function ApplyColouring(configuration) {
  //Create style element
  if (Pallete) {
    Pallete.remove();
  }

  Pallete = document.createElement("style");

  // Add styles to the style element
  Pallete.innerHTML = `
            :root {
                --background: ${configuration.Colouring.Background};
                --complement: ${configuration.Colouring.Compliment};
                --accent: ${configuration.Colouring.Accent};
                --defaultfont: 'Segoe UI', Tahoma, Geneva, Verdana, sans - serif;
                --fontcolor:${configuration.Colouring.DefaultFont};
                --casewhite: ${configuration.Colouring.AccentFont};
                --icon -default -back: pink;
                --icon - bar -default -back: white;
            }
            `;
  //Apply style to document head
  document.head.appendChild(Pallete); // Apply the style to DOM
}
