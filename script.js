document.getElementById('convertButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file && file.name.endsWith('.zip')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            JSZip.loadAsync(event.target.result)
                .then(function(zip) {
                    const outputDiv = document.getElementById('asciiOutput');
                    outputDiv.innerHTML = ''; // Clear previous output
                    let imageFiles = Object.values(zip.files).filter(file => /\.(jpe?g|png|gif)$/i.test(file.name));

                    // Sort image files alphabetically by name
                    imageFiles.sort((a, b) => a.name.localeCompare(b.name));

                    const zipASCII = new JSZip();
                    let asciiCount = 1;

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

                                const fileName = `ascii_${asciiCount}.txt`;
                                zipASCII.file(fileName, ascii); // Create text file in the ZIP
                                if (zipASCII.file(/(\/|\\)*$/)) {
                                    zipASCII.remove(/(\/|\\)*$/); // Remove empty file entry in ZIP
                                }
                                asciiCount++;

                                // Trigger download after processing all images
                                if (asciiCount > imageFiles.length) {
                                    zipASCII.generateAsync({ type: 'blob' }).then(function(content) {
                                        saveAs(content, 'ascii_art.zip'); // Trigger download of the generated ZIP file
                                    });
                                }
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

// The rest of the functions (convertToASCII, displayASCII, and other helper functions) remain unchanged
