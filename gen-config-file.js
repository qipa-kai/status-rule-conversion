let fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let result = [];
const numOfConditionCols = 6;
 
// File path.
readXlsxFile('./StatusTransfer20181203.xlsx').then((rows) => {
  // `rows` is an array of rows
  // each row being an array of cells.
  // console.log(rows);
  for(let row of rows) {
      // console.log(row);
      let output = []
      let colNum = 1;
      for(let item of row) {
          if(item) {
            let currents = output.slice(0)
            output = [];

            let values = item.split(',');
            values.forEach(val => {
                if(currents && currents.length>0) {
                    currents.forEach(eval => {
                        if (colNum < numOfConditionCols) {
                            output.push(eval + '.' + formatInputValue(val));
                        } else if(colNum == numOfConditionCols) {
                            output.push(eval + '=' + val.trim());
                        } else {
                            output.push(eval + ',' + val.trim());
                        }
                        
                    })
                } else {
                    output.push(formatInputValue(val))
                }
            });
          }
          colNum++;
      }
      addToResult(output);
  }
  generateFile();
});

function formatInputValue(val) {
    return val ? val.replace('.','').replace(/ /g, '').toLowerCase().trim() : '';
}
function addToResult(entries){
    for(let entry of entries) {
        result.push(entry);
    }
}

function generateFile(){
    let file = fs.createWriteStream('./output/request-workflow-event-rules.properties');
    file.on('error', function(err) { 
        /* error handling */ 
        console.log(err);
    });
    result.forEach(v => file.write(v + '\n'));
    file.end();
}
