let filesSelected = false;
document.getElementById('upload').addEventListener('change', async function (event) {
    const formData = new FormData();
    const files = document.getElementById('file').files;
    const resultContainer = document.getElementById("result-container-1");
    const loading = document.getElementById("load");
    loading.style.display = "block";
    resultContainer.style.opacity = 0.5
    const maxFileSize = 1024 * 1024; // 3MB
    const errorMessage = document.getElementById('error-message');

    errorMessage.style.display = "none";
    // Hide result container by default
    resultContainer.style.display = "none";

    if (files) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxFileSize || files.length > 1) {
                errorMessage.style.display = "block";
                setTimeout(function () {
                    errorMessage.style.display = "none";
                }, 4000); // Hide after 3 seconds
                loading.style.display = "none";
                filesSelected = false; // Set filesSelected to false when encountering an error
                return;
            }
        }
        errorMessage.style.display = "none";

        // Set filesSelected to true if at least one file is selected
        filesSelected = files.length > 0;
    }

    // Render result container only if files are selected
    if (filesSelected) {
        resultContainer.style.display = "flex";
    } else {
        resultContainer.style.display = "none"; // Hide result container if no files are selected
    }

    for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i]);
    }

    try {
        if (files.length !== 0) {
            const response = await fetch('upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            const downloadLinks = data.compressedImages.map(image => `
                 <div style="" class="custom-details">
                     <div class="" style="display: flex; flex-wrap: wrap">
                         <p class="customP"><b>Name:</b> ${image.name}</p>
                         <p class="customP" style="color: red"><b style="color: black">Size(Befor): </b>${formatFileSize(image.originalSize)}</p>
                     </div>
                     <div class=""style="display: flex;flex-wrap: wrap">
                         <p class="customP" style="color: #7eb631"><b style="color: black">Size(After): </b>${formatFileSize(image.compSize)}</p>
                         <a class="a-download" href="data:image/${image.format};base64,${image.buffer}" download="compress_${image.name}">Download</a>
                     </div>
                 </div>
             `);
            document.getElementById('result-container').innerHTML = downloadLinks.join('');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        loading.style.display = "none";
        resultContainer.style.opacity = 1
    }
});


function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' Bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}


//Config nav
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

//Sử lý UI FQAs
const acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    toggle.addEventListener('click', () => {
        // Add show-menu class to nav menu
        nav.classList.toggle('show-menu')

        // Add show-icon to show and hide the menu icon
        toggle.classList.toggle('show-icon')
    })
}

showMenu('nav-toggle', 'nav-menu')