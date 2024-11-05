# Doves

![Doves](https://github.com/yuanlin-yu/doves/blob/main/app/icon.png)

Doves is a google chrome extension that enable users to extract data from local file to fill the online form automatically, which currently support docx and xlsx files. This repository enable users to customize their own work flow based on their requirements.

> Three javascript libraries `mammoth`, `cherrio` and `xlsx` are used in this extenstion. The `mammoth` is used to transfer local docx file to html code, and `cherrio` is used to manipulate the html code , while `xlsx` is used to extract data from xlsx file.

Doves 是一个谷歌浏览器扩展，它允许用户从本地文件中提取数据以自动填写在线表单，目前支持 docx 和 xlsx 文件。这个仓库允许用户根据自己的需求定制自己的工作流程。

> 这个扩展使用了三个JavaScript库：`mammoth`、`cheerio`和`xlsx`。`mammoth`用于将本地docx文件转换为HTML代码，`cheerio`用于操作HTML代码，而`xlsx`用于从xlsx文件中提取数据。

## :rocket: Get started

**1. Clone or download this repository**:
```bash
git clone 'https://github.com/yuanlin-yu/doves.git'
```
or download from this page.

**2. Check with an example**:

Select the `app` folder to load this extension in Chrome, and open the example files to check the initial extension. The example html and docx/xlsx files are in the examples folder.

the extension ui:
![ui](https://github.com/yuanlin-yu/doves/blob/main/imgs/ui.png)

example files stored in the `examples` folder:
![examples](https://github.com/yuanlin-yu/doves/blob/main/imgs/example_files.png)

**3. Writting your own code in fill() function**:

Customize your code based on requirements through modifying the `fill()` function in file named `docx.js`(for docx file) or `xlsx.js` (for xlsx file) in root directory. Here is the example code in this repository:

* fill() in docx.js:
```javascript
const fill = (html) => {

    //get the target data from docx file whick is already transfered to html code, and you can output it to see the content. 
    const $ = load(html);

    //customize your code based on your requirements here, and below it's an example:

    const issueNum = $('p').eq(0).text().trim();
    console.log(issueNum)

    document.querySelector('div[id="issueNum"] input').value = issueNum;

    //textArea fill
    const allText = [];
    var areaText = '';
    $('h3, li, p').each((index, element) => {
        allText.push($(element).text().trim());
    });

    console.log(allText)
    
    const areaTextArray = allText.slice(allText.indexOf('Project Overview'), allText.indexOf('Genteral Project Pregress'));
    areaTextArray.forEach((item, index) => {
        areaText += item;
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
            input.value = updateParagraphsText[i].split(":")[1];
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
```
*fill() in xlsx.js:
```javascript
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
```
**4. Use webpack to bundle you files**:

This extension includes external javascript libraries, which may cause difficult to run in Chrome. One way to solve this problem is use `webpack` to bundle and update you files before load the extension in Chrome. The bundle files is stored in `app/dist` folder default in this repository.

`webpack` is already installed in this repository, so use the command below in root folder to bundle you files after you finish your coding.

```bash
npx webpack
```

**5. Reload the extension**:

Reload the extension in Chrome, and enjoy your new `doves`!

## :green_book: License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

