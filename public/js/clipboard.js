document.addEventListener('DOMContentLoaded', function () {
    var clipboardButton = document.querySelector('.btn-copy');
  
    clipboardButton.addEventListener('click', function () {
      copySelectedRows();
    });
  });
  
  function copySelectedRows() {
    var selectedRows = document.querySelectorAll('input[name="selectedRows[]"]:checked');
    
    if(selectedRows.length <= 0){
        alert('Select at leat one field to copy');
        return;
    }
    var copiedData = '';
  
    selectedRows.forEach(function (row) {
      var rowData = '';
      var cells = row.closest('tr').querySelectorAll('input[type="text"], select, textarea');
  
      cells.forEach(function (cell, index) {
        rowData += cell.value;

        console.log(cell.value);
  
        if (index < cells.length - 1) {
          rowData += '\t'; // Tab separator
        }
      });
  
      copiedData += rowData + '\n'; // Newline separator
    });
  

    // Create a temporary textarea element to hold the copied data
    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = copiedData;
  
    // Append the textarea to the document body
    document.body.appendChild(tempTextArea);
  
    // Select the content of the textarea
    tempTextArea.select();
  
    // Copy the selected content
    document.execCommand('copy');
  
    // Remove the temporary textarea from the document body
    document.body.removeChild(tempTextArea);
  
    // Alert the user
    alert('Data copied to clipboard');
  }
  