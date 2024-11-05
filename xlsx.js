const XLSX = require('xlsx');

export const fillForm_xlsx = (data) => {

    const workbook = XLSX.read(data, {type: 'buffer'})
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    fill(json);    
}

const fill = (json) => {

    //json variable contains the content from local xlsx file in JSON format.

    const length = Object.keys(json).length;
    const targetContent = {
        "issueNum": json[2][2],
        "projectOverview": json[5][1],
        "schemeDesign": json[8][2],
        "developApply": json[9][2],
        "construction": json[10][2]
    }

    targetContent["table"] = [];
    for(var i=14; i<length-1; i++) {
        targetContent["table"].push(json[i]);  
    }

    console.log(targetContent);

    document.querySelector('div[id="issueNum"] input').value = targetContent.issueNum;
    document.getElementById('intro').value = targetContent.projectOverview;
    document.getElementById('i-1').value = targetContent.schemeDesign;
    document.getElementById('i-2').value = targetContent.developApply;
    document.getElementById('i-3').value = targetContent.construction;

    var tableHtmlContent = `
        <tr>
            <th>Num.</th>
            <th>issue</th>
            <th>planned deadline</th>
            <th>progress</th>
        </tr>    
    `
    for(var i =0; i < targetContent.table.length; i++) {
        let table = targetContent.table;
        tableHtmlContent += `
        <tr>
            <td>${table[i][1]}</td>
            <td><input type="text" id="t-${10*(i+1)+1}" value="${table[i][2]}"></td>
            <td><input type="date" id="t-${10*(i+1)+2}" value="${table[i][3]}"></td>
            <td><input type="text" id="t-${10*(i+1)+3}" value="${table[i][4]}"></td>
        </tr>
        `
    }
    document.getElementById('table').innerHTML = tableHtmlContent;

    alert('Doves works successfully!');
}