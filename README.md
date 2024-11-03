# Doves-docx

![Doves](https://github.com/yuanlin-yu/doves-docx/blob/main/icon.png)

Doves is a google chrome extension that enable users to extract data from local file to fill the online form automatically. This is the docx version of doves, which work on docx files. Other versions say xlsx file would be updated later (maybe :D). This repository enable users to customize their own work flow based on their requirements.

> Two javascript libraries `mammoth` and `cherrio` are used in this extenstion. `mammoth` is used to transfer local docx file to html code, and `cherrio` is used to manipulate the html code.

Doves 是一个谷歌浏览器扩展程序，它允许用户从本地文件中提取数据以自动填写在线表单。这是适用于 docx 文件的 Doves 的 docx 版本。其他版本，比如 xlsx 文件的版本，将稍后更新（也许 :D）。这个仓库允许用户根据自己的需求定制自己的工作流程。

> 这个扩展中使用了两个JavaScript库：mammoth 和 cheerio。mammoth 用于将本地的docx文件转换为HTML代码，而 cheerio 用于操作HTML代码。

## :rocket: Get started

**1. Clone or download this repository**:
```bash
git clone 'https://github.com/yuanlin-yu/doves-docx.git'
```
or download from this page.

**2. Check with an example**:

Select the root folder to load this extension in Chrome, and open the example files to check the initial extension. The example html and docx files are in the examples folder.

the extension ui:
![ui](https://github.com/yuanlin-yu/doves-docx/blob/main/imgs/ui.png)

example files stored in the `examples` folder:
![example](https://github.com/yuanlin-yu/doves-docx/blob/main/imgs/example_files.png)

**3. Writting your own code in fill() function**:

Customize your code based on requirements through modifying the `fill()` function in file named `content-script.js`. Here is the example code in this repository:

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

**4. Use webpack to bundle you files**:

This extension includes external javascript libraries, which may cause difficult to run in Chrome. One way to solve this problem is use `webpack` to bundle and update you files before load the extension in Chrome. The bundle files is stored in `dist` folder default in this repository.

`webpack` is already installed in this repository, so use the command below to bundle you files after you finish your coding.

```bash
npx webpack
```

**5. Reload the extension**:

Reload the extension in Chrome, and enjoy your new `doves-docx`!

## :green_book: License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).

