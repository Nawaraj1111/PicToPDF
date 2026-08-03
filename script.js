const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const preview = document.getElementById("preview");
const imageCount = document.getElementById("imageCount");

let selectedImages = [];

// ============================
// Open File Picker
// ============================

selectBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadBox.addEventListener("click", () => {
    fileInput.click();
});

// ============================
// Select Images
// ============================

fileInput.addEventListener("change", (e) => {
    addImages(e.target.files);
});

// ============================
// Drag & Drop
// ============================

uploadBox.addEventListener("dragover", (e) => {

    e.preventDefault();

    uploadBox.style.background = "#dbeafe";

});

uploadBox.addEventListener("dragleave", () => {

    uploadBox.style.background = "white";

});

uploadBox.addEventListener("drop", (e) => {

    e.preventDefault();

    uploadBox.style.background = "white";

    addImages(e.dataTransfer.files);

});

// ============================
// Add Images
// ============================

function addImages(files){

    [...files].forEach(file=>{

        if(file.type.startsWith("image/")){

            selectedImages.push({

                file:file,

                rotation:0

            });

        }

    });

    renderPreview();

}

// ============================
// Render Preview
// ============================

function renderPreview(){

    preview.innerHTML="";

    imageCount.textContent =
        `${selectedImages.length} Image${selectedImages.length===1?"":"s"}`;

    if(selectedImages.length===0){

        preview.innerHTML=`
            <div class="empty-message">
                No images selected.
            </div>
        `;

        return;

    }

    selectedImages.forEach((image,index)=>{

        const reader=new FileReader();

        reader.onload=function(e){

            const card=document.createElement("div");

            card.className="card";

            card.innerHTML=`

            <div class="image-wrapper">

                <span class="image-number">
                    ${index+1}
                </span>

                <img
                    class="preview-image"
                    src="${e.target.result}"
                    style="transform:rotate(${image.rotation}deg);">

            </div>

            <div class="card-body">

                <h4>${image.file.name}</h4>

                <p>${formatSize(image.file.size)}</p>

                <div class="actions">

                    <button class="rotate-left">
                        ⟲
                    </button>

                    <button class="rotate-right">
                        ⟳
                    </button>

                    <button class="delete-btn">
                        🗑
                    </button>

                </div>

            </div>

            `;

            // Delete

            card.querySelector(".delete-btn")
            .addEventListener("click",()=>{

                selectedImages.splice(index,1);

                renderPreview();

            });

            // Rotate Left

            card.querySelector(".rotate-left")
            .addEventListener("click",()=>{

                image.rotation-=90;

                renderPreview();

            });

            // Rotate Right

            card.querySelector(".rotate-right")
            .addEventListener("click",()=>{

                image.rotation+=90;

                renderPreview();

            });

            preview.appendChild(card);

        }

        reader.readAsDataURL(image.file);

    });

}

// ============================
// Format File Size
// ============================

function formatSize(bytes){

    if(bytes<1024){

        return bytes+" B";

    }

    if(bytes<1024*1024){

        return (bytes/1024).toFixed(1)+" KB";

    }

    return (bytes/1024/1024).toFixed(2)+" MB";

}