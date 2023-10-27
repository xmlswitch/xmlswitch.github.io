//THE CI IS POINTING TO THE WRONG ASSET
//WE NEED TO FLIP THE <ASSET> VALUES FOR AN INPUT OF CIs (XML)

const fileInput = document.getElementById('choose_file');
let fileContent = 'No file loaded.';

fileInput.onchange = () => {
    let c = document.getElementById('file_confirm');
    if (fileInput.files.length == 0) {
        c.innerText = 'No file loaded!';
    } else {
        const selectedFile = fileInput.files[0];
        c.innerText = 'File loaded!';
        console.log(selectedFile);
        if (checkFileType(fileInput.value)) {
            filetoText(selectedFile);
        } else {
            clearInputFile(c);
        }
    }
}

function filetoText(f) {
    let reader = new FileReader();
    reader.readAsText(f, 'UTF-8');
    reader.onload = readerEvent => {
        fileContent = readerEvent.target.result;
        document.getElementById('file_confirm').innerText = fileContent;
        parseXML();
    }
}

function checkFileType(f) {
    let extension = f.match(/\.[0-9a-z]+$/i);
    //alert(extension);
    if (extension == '.xml') { return true } else { return false }
}

function parseXML() {
    let parser = new DOMParser();
    //alert(fileContent);
    let xmlDoc = parser.parseFromString(fileContent, "application/xml");

    //alert(newfile);

    let x = xmlDoc.getElementsByTagName('ID'); //[0].childNodes;
    //alert(x.length);

    for (let i = 1; i < x.length; i++) {
        let currentID = xmlDoc.getElementsByTagName('ID')[i].childNodes[0].nodeValue;
        let previousID = xmlDoc.getElementsByTagName('ID')[i - 1].childNodes[0].nodeValue;
        if (currentID == previousID) {
            let currentVal = xmlDoc.getElementsByTagName('ARTIST')[i].childNodes[0].nodeValue;
            let previousVal = xmlDoc.getElementsByTagName('ARTIST')[i - 1].childNodes[0].nodeValue;

            xmlDoc.getElementsByTagName('ARTIST')[i].childNodes[0].nodeValue = previousVal;
            xmlDoc.getElementsByTagName('ARTIST')[i - 1].childNodes[0].nodeValue = currentVal;

            alert(currentVal + " " + previousVal);
        }
    }

    saveFile(xmlDoc);
}

function saveFile(xmlDoc) {
    let serializer = new XMLSerializer();
    let newfile = serializer.serializeToString(xmlDoc);

    let textFile = null;

    let data = new Blob([newfile], { type: 'text/xml' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    window.open(textFile, "_blank")
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