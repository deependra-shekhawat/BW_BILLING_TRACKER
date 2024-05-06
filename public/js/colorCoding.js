// Function to apply background color based on status and comments
function applyRowColor() {
    const tableRows = document.querySelectorAll("#tableBody tr");
    tableRows.forEach(row => {
      const status = row.querySelector("[name='status[]']").value;
      const comments = row.querySelector("[name='comment[]']").value.toLowerCase();
      
      // Check conditions and apply background color
      if (status === 'Live') {
        if (comments.includes('downgrade')) {
            row.style.backgroundColor = '#FCF55F';
        } else if (comments.includes('upgrade')) {
          row.style.backgroundColor = 'darkgreen';
        } else {
          row.style.backgroundColor = 'lightgreen';
        }
      } else if (status === 'Decommissioned') {
          row.style.backgroundColor = '#E34234';
      }
    });
  }

  // Call applyRowColor function on page load
  window.addEventListener('DOMContentLoaded', applyRowColor);
