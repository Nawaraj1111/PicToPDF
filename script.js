const selectBtn = document.getElementById("selectBtn");

const fileInput = document.getElementById("fileInput");

const uploadArea = document.getElementById("upload-area");

selectBtn.onclick = () => {

    fileInput.click();

};

uploadArea.onclick = () => {

    fileInput.click();

};

fileInput.addEventListener("change", () => {

    alert(fileInput.files.length + " images selected.");

});