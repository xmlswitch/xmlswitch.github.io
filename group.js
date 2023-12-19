const fileInput = document.getElementById('choose_file');
let fileContent = '';

let names = [];

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
        //process file here
        let lineCount = getLineCount(fileContent);
        alert(lineCount);

        processText(fileContent, lineCount);

    }
}

function processText(text, lineCount) {
    lines = text.split('\n');

    let columns = parse(lines[0]);
    let names = [];
    let groups = [];

    if (columns.includes("user.user_name") && columns.includes("group")) {
        //process here
        let userIndex = columns.indexOf("user.user_name");
        let groupIndex = columns.indexOf("group");

        for (let i = 1; i < lineCount; i++) {
            let row = parse(lines[i]);
            let name = row[userIndex];
            let group = row[groupIndex];

            if (!names.includes(name)) { names.push(name) }
            if (!groups.includes(group)) { groups.push(group) }
        }

        names.sort();
        groups.sort();

        let final = [];

        final.push(names);

        for (group in groups) {
            final.push(new Array(names.length).fill(" "));
        }

        for (let i = 1; i < lineCount; i++) {
            let row = parse(lines[i]);
            let name = row[userIndex];
            let group = row[groupIndex];

            let x = names.indexOf(name);
            let y = groups.indexOf(group) + 1;

            final[y][x] = group;
        }
        alert("Done");

        outputData(final);

    } else {
        alert('Process failed!\nPlease make sure your csv export contains the user ID and group columns');
    }
    console.log(names);
    console.log(groups);
}

function outputData(rows) {
    let csvContent = "data:text/csv;charset=utf-8," +
        rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "output.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
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

function getLineCount(text) {
    var nLines = 0;
    for (var i = 0, n = text.length; i < n; ++i) {
        if (text[i] === '\n') {
            ++nLines;
        }
    }
    return nLines;
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