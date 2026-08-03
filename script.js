const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");

selectBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadBox.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    alert(`${fileInput.files.length} image(s) selected.`);
});

// Drag & Drop UI (upload logic comes in Lesson 2)
uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.style.background = "#dbeafe";
});

uploadBox.addEventListener("dragleave", () => {
    uploadBox.style.background = "#ffffff";
});

uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.style.background = "#ffffff";

    const files = e.dataTransfer.files;

    alert(`${files.length} image(s) dropped.`);
});