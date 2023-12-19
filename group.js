const fileInput = document.getElementById('choose_file');
let fileContent = 'No file loaded.';

fileInput.onchange = () => {
    let c = document.getElementById('file_confirm');
    let fileSelect = document.getElementById('choose_file');
    if (fileInput.files.length == 0) {
        c.innerText = 'No file loaded!';
    } else {
        const selectedFile = fileInput.files[0];
        c.innerText = 'File loaded!';
        console.log(selectedFile);
        if (checkFileType(fileInput.value)) {
            filetoText(selectedFile, codeBlock);
        } else {
            clearInputFile(fileSelect);
        }
    }
}

function checkFileType(f) {
    let extension = f.match(/\.[0-9a-z]+$/i);
    if (extension == '.csv') { return true; } else { return false; }
}

function clearInputFile(f) {
    if (f.value) {
        try {
            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
        } catch (err) {}
        if (f.value) { //for IE5 ~ IE10
            let form = document.createElement('form'),
                parentNode = f.parentNode,
                ref = f.nextSibling;
            form.appendChild(f);
            form.reset();
            parentNode.insertBefore(f, ref);
        }
    }
}