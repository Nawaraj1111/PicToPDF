const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const preview = document.getElementById("preview");
const imageCount = document.getElementById("imageCount");
const convertBtn = document.getElementById("convertBtn");

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

            card.dataset.index = index;

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

    setTimeout(() => {

    initializeSortable();

}, 100);

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

let sortable = null;

function initializeSortable(){

    if(sortable){

        sortable.destroy();

    }

    sortable = new Sortable(preview,{

        animation:200,

        ghostClass:"dragging",

        onEnd:function(){

            const newOrder=[];

            document.querySelectorAll(".card").forEach(card=>{

                const index=parseInt(card.dataset.index);

                newOrder.push(selectedImages[index]);

            });

            selectedImages = newOrder;

            renderPreview();

        }

    });

}

requestAnimationFrame(() => {
    initializeSortable();
});

convertBtn.addEventListener("click", generatePDF);

async function generatePDF(){

    if(selectedImages.length===0){

        alert("Please select images first.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const orientation =
        document.getElementById("orientation").value;

    const pageSize =
        document.getElementById("pageSize").value;

    const quality =
        parseFloat(document.getElementById("quality").value);

    const pdf = new jsPDF({

        orientation: orientation,

        unit: "mm",

        format: pageSize

    });

    for(let i=0;i<selectedImages.length;i++){

        const image = selectedImages[i];

        const dataUrl = await readImage(image.file);

        if(i>0){

            pdf.addPage();

        }

        const pageWidth = pdf.internal.pageSize.getWidth();

        const pageHeight = pdf.internal.pageSize.getHeight();

        const img = await loadImage(dataUrl);

        const ratio = Math.min(

            pageWidth/img.width,

            pageHeight/img.height

        );

        const width = img.width * ratio;

        const height = img.height * ratio;

        const x = (pageWidth-width)/2;

        const y = (pageHeight-height)/2;

        if(image.rotation!==0){

            pdf.saveGraphicsState();

            pdf.addImage(

                dataUrl,

                "JPEG",

                x,

                y,

                width,

                height,

                undefined,

                "FAST",

                image.rotation

            );

            pdf.restoreGraphicsState();

        }else{

            pdf.addImage(

                dataUrl,

                "JPEG",

                x,

                y,

                width,

                height,

                undefined,

                "FAST"

            );

        }

    }

    pdf.save("JPEG-to-PDF.pdf");

}


function readImage(file){

    return new Promise((resolve)=>{

        const reader = new FileReader();

        reader.onload = e=>resolve(e.target.result);

        reader.readAsDataURL(file);

    });

}

function loadImage(src){

    return new Promise((resolve)=>{

        const img = new Image();

        img.onload = ()=>resolve(img);

        img.src = src;

    });

}