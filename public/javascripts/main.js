let filesSelected=!1;function formatFileSize(e){return e<1024?e+" Bytes":e<1048576?(e/1024).toFixed(1)+" KB":(e/1048576).toFixed(1)+" MB"}document.getElementById("upload").addEventListener("change",async function(e){let l=new FormData,t=document.getElementById("file").files,s=document.getElementById("result-container-1"),a=document.getElementById("load");a.style.display="block",s.style.opacity=.5;let n=document.getElementById("error-message");if(n.style.display="none",s.style.display="none",t){for(let o=0;o<t.length;o++)if(t[o].size>1048576||t.length>1){n.style.display="block",setTimeout(function(){n.style.display="none"},4e3),a.style.display="none",filesSelected=!1;return}n.style.display="none",filesSelected=t.length>0}filesSelected?s.style.display="flex":s.style.display="none";for(let c=0;c<t.length;c++)l.append("image",t[c]);try{if(0!==t.length){let d=await fetch("upload",{method:"POST",body:l}),y=await d.json(),r=y.compressedImages.map(e=>`
                 <div style="" class="custom-details">
                     <div class="" style="display: flex; flex-wrap: wrap">
                         <p class="customP"><b>Name:</b> ${e.name}</p>
                         <p class="customP" style="color: red"><b style="color: black">Size(Befor): </b>${formatFileSize(e.originalSize)}</p>
                     </div>
                     <div class=""style="display: flex;flex-wrap: wrap">
                         <p class="customP" style="color: #7eb631"><b style="color: black">Size(After): </b>${formatFileSize(e.compSize)}</p>
                         <a class="a-download" href="data:image/${e.format};base64,${e.buffer}" download="compress_${e.name}">Download</a>
                     </div>
                 </div>
             `);document.getElementById("result-container").innerHTML=r.join("")}}catch(m){console.error("Error:",m)}finally{a.style.display="none",s.style.opacity=1}});const acc=document.getElementsByClassName("accordion");let i;for(i=0;i<acc.length;i++)acc[i].addEventListener("click",function(){this.classList.toggle("active");let e=this.nextElementSibling;e.style.maxHeight?e.style.maxHeight=null:e.style.maxHeight=e.scrollHeight+"px"});const showMenu=(e,l)=>{let t=document.getElementById(e),s=document.getElementById(l);t.addEventListener("click",()=>{s.classList.toggle("show-menu"),t.classList.toggle("show-icon")})};showMenu("nav-toggle","nav-menu");