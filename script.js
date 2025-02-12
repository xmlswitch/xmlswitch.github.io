//THE CI IS POINTING TO THE WRONG ASSET
//WE NEED TO FLIP THE <ASSET> VALUES FOR AN INPUT OF CIs (XML)

const fileInput = document.getElementById('choose_file');
let fileContent = 'No file loaded.';
let theID = '';
let theValue = '';
let fileText = "";

fileInput.onchange = () => {
    let c = document.getElementById('file_confirm');
	let codeBlock = document.getElementById('code_block');
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

function filetoText(f, c) {
    let reader = new FileReader();
    reader.readAsText(f, 'UTF-8');
    reader.onload = readerEvent => {
        fileContent = readerEvent.target.result;
        parseXML();
        c.innerText = fileText;
    }
}

function checkFileType(f) {
    let extension = f.match(/\.[0-9a-z]+$/i);
    if (extension == '.xml') { return true; } else { return false; }
}

function parseXML() {
	theID = prompt("Please select the name for the identifier value", "serial_number");
	theValue = prompt("Please select the name for the subject value", "asset");
	
	
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(fileContent, "application/xml");

    let x = xmlDoc.getElementsByTagName(theID); 
	
    let swaps = 0;

    for (let i = 1; i < x.length; i++) {
        let currentID = xmlDoc.getElementsByTagName(theID)[i].childNodes[0].nodeValue;
        let previousID = xmlDoc.getElementsByTagName(theID)[i - 1].childNodes[0].nodeValue;
        if (currentID == previousID) {
            let currentVal = xmlDoc.getElementsByTagName(theValue)[i].childNodes[0].nodeValue;
            let previousVal = xmlDoc.getElementsByTagName(theValue)[i - 1].childNodes[0].nodeValue;

            xmlDoc.getElementsByTagName(theValue)[i].childNodes[0].nodeValue = previousVal;
            xmlDoc.getElementsByTagName(theValue)[i - 1].childNodes[0].nodeValue = currentVal;
			
			let currentDisplayVal = xmlDoc.getElementsByTagName(theValue)[i].getAttribute("display_value");
			let previousDisplayVal = xmlDoc.getElementsByTagName(theValue)[i-1].getAttribute("display_value");
			
			xmlDoc.getElementsByTagName(theValue)[i].setAttribute("display_value", previousDisplayVal);
            xmlDoc.getElementsByTagName(theValue)[i - 1].setAttribute("display_value", currentDisplayVal);

            swaps += 1;
        }
    }

    alert(swaps + " swaps have been made :-)");

    saveFile(xmlDoc);
}

function saveFile(xmlDoc) {
    let serializer = new XMLSerializer();
    let newfile = serializer.serializeToString(xmlDoc);

    fileText = newfile;

    let textFile = null;

    let data = new Blob([newfile], { type: 'text/xml' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    window.open(textFile, "_blank");

    download([newfile], 'output.xml', 'text/xml');
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


function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
