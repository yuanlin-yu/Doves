import mammoth from 'mammoth';
import { load } from 'cheerio';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fromPopup") {
        var data = Uint8Array.from(atob(request.data), c => c.charCodeAt(0)).buffer; //将base64转化回arrayBuffer
        fillForm(data);		
        sendResponse({response: "Function called"});
    }
});

const fillForm = (data) => {
    mammoth.convertToHtml({arrayBuffer: data})
    .then(function(result){
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        fill(html);
        if(messages.length > 0) {
            console.log(messages)
        }
    })
    .catch(function(error) {
        console.error(error);
    });
}

const fill = (html) => {
    console.log(html);
    //get the target data from docx file
    const $ = load(html);

    //textArea fill
    const allText = [];
    var areaText = '';
    $('h3, li, p').each((index, element) => {
        allText.push($(element).text().trim());
    });
    
    const areaTextArray = allText.slice(1, allText.indexOf('项目进展'));
    areaTextArray.forEach((item, index) => {
        areaText += (index+1) + '、' + item + '\n';
    });
    document.getElementById('intro').value = areaText;

    //input fill
    const paragraphsText = [];
    $('li').each((index, element) => {
        paragraphsText.push($(element).text().trim());
    });

    const updateParagraphsText = paragraphsText.filter(item => !areaTextArray.includes(item));

    const inputId = [  //create the target html input elements array. note that the order should be consistent with paragraphsText.
        "i-1",
        "i-2",
        "i-3"
    ];

    if(inputId.length === updateParagraphsText.length) {
        for(var i = 0; i < inputId.length; i++) {
            console.log(inputId[i], updateParagraphsText[i])
            let input = document.getElementById(inputId[i]);
            input.value = updateParagraphsText[i].split("：")[1];
        }
    } else {
        alert('input length error!')
    }

    //tableText fill
    const tableText = [];
    $('table p').each((index, element) => {
        tableText.push($(element).text().trim());
    });
    
    let tableHtmlContent = `
        <tr>
            <th>${tableText[0]}</th>
            <th>${tableText[1]}</th>
            <th>${tableText[2]}</th>
            <th>${tableText[3]}</th>
        </tr>    
    `
    for(var i =0; i < tableText.length/4-1; i++) {
        tableHtmlContent += `
        <tr>
            <td>${i+1}</td>
            <td><input type="text" id="t-${10*(i+1)+1}" value="${tableText[5+4*i]}"></td>
            <td><input type="date" id="t-${10*(i+1)+2}" value="${tableText[6+4*i]}"></td>
            <td><input type="text" id="t-${10*(i+1)+3}" value="${tableText[7+4*i]}"></td>
        </tr>
        `
    }
    document.getElementById('table').innerHTML = tableHtmlContent;

    alert('Doves works successfully!');    
}
