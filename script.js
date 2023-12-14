const fileInput = document.getElementById('fileInput');
const convertButton = document.getElementById('convertButton');

convertButton.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (file && file.name.endsWith('.zip')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            JSZip.loadAsync(event.target.result)
                .then(function(zip) {
                    const outputDiv = document.getElementById('asciiOutput');
                    outputDiv.innerHTML = ''; // Clear previous output
                    const imageFiles = Object.values(zip.files).filter(file => /\.(jpe?g|png|gif)$/i.test(file.name));
                    imageFiles.forEach(function(imageFile) {
                        imageFile.async('blob').then(function(blob) {
                            const img = new Image();
                            img.onload = function() {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                const widthInput = document.getElementById('widthInput').value;
                                const heightInput = document.getElementById('heightInput').value;

                                canvas.width = widthInput;
                                canvas.height = heightInput;
                                ctx.drawImage(img, 0, 0, widthInput, heightInput);

                                const ascii = convertToASCII(ctx, widthInput, heightInput);
                                displayASCII(outputDiv, imageFile.name, ascii);
                            };
                            img.src = URL.createObjectURL(blob);
                        });
                    });
                })
                .catch(function(err) {
                    console.error('Error reading ZIP file:', err);
                });
        };
        reader.readAsArrayBuffer(file);
    } else {
        displayError('Please select a valid ZIP file.');
    }
});

function displayError(message) {
    const outputDiv = document.getElementById('asciiOutput');
    outputDiv.innerHTML = `<p>Error: ${message}</p>`;
}

function convertToASCII(ctx, width, height) {
    const CHARACTERS = ['@', '#', '8', '&', 'o', ':', '*', '.']; // Characters representing different intensities
    let ascii = '';

    for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x++) {
            const imageData = ctx.getImageData(x, y, 1, 2).data;
            const brightness = (imageData[0] + imageData[1] + imageData[2]) / 3; // Calculate brightness

            const index = Math.floor((brightness / 255) * (CHARACTERS.length - 1));
            ascii += CHARACTERS[index];
        }
        ascii += '\n'; // Add line break for each row of ASCII characters
    }

    return ascii;
}


function displayASCII(outputDiv, fileName, ascii) {
    outputDiv.innerHTML += `<p>${fileName}:</p><pre>${ascii}</pre>`;
}
