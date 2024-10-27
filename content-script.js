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
    const paragraphsText = [];
    $('li').each((index, element) => {
        paragraphsText.push($(element).text().trim());
    });
    
    //create the target html input elements array. note that the order should be consistent with paragraphsText.
    const inputId = [
        "text-1",
        "text-2",
        "text-3",
        "text-4",
        "text-5"
    ];

    if(inputId.length === paragraphsText.length) {
        for(var i = 0; i < inputId.length; i++) {
            console.log(inputId[i], paragraphsText[i])
            let input = document.getElementById(inputId[i]);
            input.value = paragraphsText[i].split("：")[1];
            if(i == inputId.length - 1) {
                alert('Doves works successfully!')
            }
        }
    } else {
        alert('input length error!')
    }
}
