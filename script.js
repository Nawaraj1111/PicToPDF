const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const preview = document.getElementById("preview");

let selectedImages = [];

// Open file picker
selectBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadBox.addEventListener("click", () => {
    fileInput.click();
});

// File picker
fileInput.addEventListener("change", (e) => {

    addImages(e.target.files);

});

// Drag over
uploadBox.addEventListener("dragover", (e) => {

    e.preventDefault();

    uploadBox.style.background = "#dbeafe";

});

// Drag leave
uploadBox.addEventListener("dragleave", () => {

    uploadBox.style.background = "white";

});

// Drop
uploadBox.addEventListener("drop", (e) => {

    e.preventDefault();

    uploadBox.style.background = "white";

    addImages(e.dataTransfer.files);

});

// Add images

function addImages(files){

    [...files].forEach(file=>{

        if(file.type.startsWith("image/")){

            selectedImages.push(file);

        }

    });

    renderPreview();

}

// Render preview

function renderPreview(){

    preview.innerHTML="";

    if(selectedImages.length===0){

        preview.innerHTML=`
        <div class="empty-message">
            No images selected.
        </div>
        `;

        return;

    }

    selectedImages.forEach(file=>{

        const reader=new FileReader();

        reader.onload=function(e){

            const card=document.createElement("div");

            card.className="card";

            card.innerHTML=`

                <img src="${e.target.result}">

                <div class="card-body">

                    <h4>${file.name}</h4>

                    <p>${formatSize(file.size)}</p>

                </div>

            `;

            preview.appendChild(card);

        }

        reader.readAsDataURL(file);

    });

}

// Format file size

function formatSize(bytes){

    if(bytes<1024)
        return bytes+" B";

    if(bytes<1024*1024)
        return (bytes/1024).toFixed(1)+" KB";

    return (bytes/1024/1024).toFixed(2)+" MB";

}