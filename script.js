const video = document.getElementById("video");
let data = [];

// Camera access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

// Capture & OCR
function capture() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  Tesseract.recognize(canvas, 'eng', {
    tessedit_char_whitelist: '0123456789'
  }).then(({ data: { text } }) => {
    let number = text.replace(/\D/g, '');
    if (number) {
      data.push({ Number: number });
      addRow(number);
    }
  });
}

function addRow(num) {
  let table = document.getElementById("table");
  let row = table.insertRow();
  row.insertCell(0).innerText = num;
}

// Excel download
function downloadExcel() {
  let ws = XLSX.utils.json_to_sheet(data);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Scanned Numbers");
  XLSX.writeFile(wb, "numbers.xlsx");
}
