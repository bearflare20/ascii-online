document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file.name.endsWith('.zip')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            JSZip.loadAsync(event.target.result)
                .then(function(zip) {
                    const imageFiles = Object.values(zip.files).filter(file => !file.dir && /\.(jpe?g|png|gif)$/i.test(file.name));
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

                                const imageData = ctx.getImageData(0, 0, widthInput, heightInput);
                                const ascii = convertToASCII(imageData);
                                displayASCII(ascii);
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
        console.error('Please upload a ZIP file.');
    }
});

function convertToASCII(imageData) {
    // ASCII conversion logic using specified height and width
    // You'll need to adjust your ASCII conversion based on the user-defined dimensions
    // This might involve mapping pixel brightness to ASCII characters or other methods
    // Replace this with your ASCII conversion logic
    return "ASCII Art for the image";
}

function displayASCII(ascii) {
    document.getElementById('asciiOutput').innerText += ascii + '\n\n';
}
