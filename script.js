"use strict"
document.querySelector('button').addEventListener("click", buttonClick)

function buttonClick() {
    //при повторном нажатии кнопки проверяется наличие второй таблицы
    //и если она существует, то удаляем её
    deleteTwoTable();
    //если есть хотя бы один критерий
    if (getIndexesCriteria().length > 0) {
        //копирую исходную таблицу и уже с ней работаю
        let table = document.querySelector("table").cloneNode(true);
        //группировка
        group(table);
        table.setAttribute("style", "background-color: #d6d2d2;");
        table.setAttribute("contenteditable", false);
        document.body.appendChild(table);
    }
}

function group(table) {
    //удаляю неиспользуемые колонки
    deleteNoUsedColumns(table);
    let usingSelect = getUsingSelect();
    let indexesCriteria = getIndexesCriteria();
    //алгоритм: поочередно прохожусь по всем строкам и сравниваю текущую строку таблицы
    //со всеми строками, которые идут после неё. Если нашлись строки с одинаковыми критериями, то
    //добавляю их в массив, в котором затем происходит группировка строк. Дальше перехожу к
    //следующей строке и так до тех пор, пока не дойду до предпоследней строки
    let allRow = table.querySelectorAll("tr");
    for (let i = 1; i < allRow.length - 1; i++) {
        //текущая строка
        let row1 = allRow[i];
        //массив, содержащий строки с такими же критериями, как и у текущей строки
        let rowForGroup = [];
        for (let j = i + 1; j < allRow.length; j++) {
            let row2 = allRow[j];
            //сравниваю текущую строку и строки, идущие после неё. Если критерии совпадают,
            // то добавляю в массив для группировки
            if (equalsRowByCriteria(row1, row2, indexesCriteria)) {
                rowForGroup.push(row2)
            }
        }
        //если есть строки с одинаковыми критериями, то прохожусь по массиву и поочередно объединяю строки
        if (rowForGroup.length > 0) {
            for (let k = 0; k < rowForGroup.length; k++) {
                mergeRow(row1, rowForGroup[k], usingSelect);
            }
        }
        //обновляю строки таблицы, после объединения
        allRow = table.querySelectorAll("tr");
    }
    //после группировки удаляю колонки неиспользуемые при группировке

}

//сравнение строк по критериям
function equalsRowByCriteria(row1, row2, arrayIndex) {
    //прохожусь по массиву, который содержит индексы критериев
    for (let i = 0; i < arrayIndex.length; i++) {
        let el = arrayIndex[i];
        let num1 = Number(row1.cells.item(el).textContent);
        let num2 = Number(row2.cells.item(el).textContent);
        if (num1 != num2) {
            return false;
        }
    }
    return true;
}

function mergeRow(row1, row2, usingSelect) {
    //массив выпадающих строк

    //прохожусь по массиву и в зависимости от выбранного элемента списка произвожу объединение строк
    for (let i = 0; i < usingSelect.length; i++) {
        let num1 = Number(row1.cells.item(i).textContent);
        let num2 = Number(row2.cells.item(i).textContent);
        switch (usingSelect[i].value) {
            case "Сумма": {
                row1.cells.item(i).textContent = String(num1 + num2);
                break;
            }
            case "Макс.": {
                if (num1 > num2) {
                    row1.cells.item(i).textContent = String(num1);
                } else row1.cells.item(i).textContent = String(num2);
                break;
            }
            case "Мин.": {
                if (num1 < num2) {
                    row1.cells.item(i).textContent = String(num1);
                } else row1.cells.item(i).textContent = String(num2);
                break;
            }
            case "Конкат": {
                row1.cells.item(i).textContent += row2.cells.item(i).textContent;
                break;
            }
        }
    }
    row2.remove()
}

function deleteTwoTable() {
    if (document.querySelectorAll("table").length === 2) {
        document.body.removeChild(document.querySelectorAll("table")[1]);
    }
}

function deleteNoUsedColumns(table) {
    let indexesNoUsingColumn = [];
    document.querySelectorAll("select").forEach((select, index) => {
        if ("----" === select.value) indexesNoUsingColumn.push(index);
    });
    if (indexesNoUsingColumn.length > 0) {
        table.querySelectorAll("tr").forEach(tr => {
            let deleteCells = [];
            indexesNoUsingColumn.forEach(index => {
                deleteCells.push(tr.cells.item(index));
            });
            deleteCells.forEach(cell => {
                cell.remove();
            });
        });
    }
}

function getIndexesCriteria() {
    let array = [];
    getUsingSelect().forEach((select, index) => {
        if ("Критерий" === select.value) array.push(index);
    });
    return array;
}

function getUsingSelect() {
    let usingSelect = [];
    document.querySelectorAll("select").forEach(select => {
        if (select.value != "----") {
            usingSelect.push(select);
        }
    })
    return usingSelect;
}

