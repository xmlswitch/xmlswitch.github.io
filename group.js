const fileInput = document.getElementById('choose_file');
let fileContent = '';

fileInput.onchange = () => {
    let inputText = document.getElementById('file_confirm');
    let fileSelect = document.getElementById('choose_file');
    if (fileInput.files.length == 0) {
        inputText.innerText = 'No file loaded!';
    } else {
        const selectedFile = fileInput.files[0];
        inputText.innerText = 'File loaded!';
        console.log(selectedFile);
        if (checkFileType(fileInput.value)) {
            filetoText(selectedFile);
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

function filetoText(f) {
    let reader = new FileReader();
    reader.readAsText(f, 'UTF-8');
    reader.onload = readerEvent => {
        fileContent = readerEvent.target.result;
    }
}

// Parse a CSV row, accounting for commas inside quotes                   
function parse(row) {
    var insideQuote = false,
        entries = [],
        entry = [];
    row.split('').forEach(function(character) {
        if (character === '"') {
            insideQuote = !insideQuote;
        } else {
            if (character == "," && !insideQuote) {
                entries.push(entry.join(''));
                entry = [];
            } else {
                entry.push(character);
            }
        }
    });
    entries.push(entry.join(''));
    return entries;
}

function exampleCSV() {
    // csv could contain the content read from a csv file
    var csv = '"foo, the column",bar\n2,3\n"4, the value",5',

        // Split the input into lines
        lines = csv.split('\n'),

        // Extract column names from the first line
        columnNamesLine = lines[0],
        columnNames = parse(columnNamesLine),

        // Extract data from subsequent lines
        dataLines = lines.slice(1),
        data = dataLines.map(parse);

    // Prints ["foo, the column","bar"]
    console.log(JSON.stringify(columnNames));

    // Prints [["2","3"],["4, the value","5"]]
    console.log(JSON.stringify(data));
}