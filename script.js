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
    // ASCII conversion logic using specified height and width
    // Replace this with your ASCII conversion logic
    return "ASCII Art for the image";
}

function displayASCII(outputDiv, fileName, ascii) {
    outputDiv.innerHTML += `<p>${fileName}:</p><pre>${ascii}</pre>`;
}
