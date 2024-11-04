import { fillForm_docx } from './docx';
import { fillForm_xlsx } from './xlsx';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var data = Uint8Array.from(atob(request.data), c => c.charCodeAt(0)).buffer; //将base64转化回arrayBuffer
    if (request.action === "fromPopup-docx") {
        fillForm_docx(data);		
    } else {
        fillForm_xlsx(data);
    }
    sendResponse({response: "Function called"});
});


