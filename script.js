// SELECTING HELPERS
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));


// INITIAL SELECTION
const blocksEl = qs('#blocks');
const coverPreview = qs('#cover-preview');


// BASIC VALIDATION
function validateArticle() {
    if (!qs("#title").value.trim()) return "Title is required.";
    if (!qs("#coverInput").files[0]) return "Cover image is required.";

    const selectedCats = Array.from(qs("#category").selectedOptions)
        .map(o => o.value)
        .filter(v => v !== "default");

    if (selectedCats.length === 0) return "Select at least one category.";

    if (!qs("#author").value.trim()) return "An Author is required!";
    if (!qs("#excerpt").value.trim()) return "A brief summary is essential!";

    const blocks = qsa('.block');
    const blockOne = blocks[0];
    const wrap = blockOne.querySelector('div:nth-of-type(2)');
    if (!wrap.querySelector('textarea').value.trim()) return "At least one Paragraph of text is required!";

    return null;
}


// CREATE BLOCK FUNCTION
// THE ACTUAL ENGINE OF THIS SCRIPT 🔥
function createBlock(type) {
    const id = 'block-' + Math.random().toString(36).slice(2, 9);
    const block = document.createElement('div');
    block.className = 'block';
    block.dataset.type = type;
    block.dataset.id = id;

    const controls = document.createElement('div');
    controls.className = 'row';
    controls.style.justifyContent = 'flex-end';
    controls.innerHTML = `
        <button data-action="moveUp" class="button small controls">↑</button>
        <button data-action="moveDown" class="button small controls">↓</button>
        <button data-action="delete" class="button small controls">🗑</button>
    `;
    block.appendChild(controls);

    const wrap = document.createElement('div');
    wrap.className = "wrap";

    switch (type) {
        case 'paragraph': {
            const ta = document.createElement('textarea');
            ta.placeholder = "Paragraph text...";
            wrap.appendChild(ta);
            break;
        }
        case 'image': {
            const file = document.createElement('input');
            file.type = "file";
            file.accept = "image/*";

            const alt = document.createElement('input');
            alt.type = "text";
            alt.placeholder = "Alt text";

            const imagePreview = document.createElement('div');
            imagePreview.className = "imagesPreview";

            file.addEventListener('change', () => {
                previewer(file, imagePreview);
            });

            wrap.appendChild(file);
            wrap.appendChild(alt);
            wrap.appendChild(imagePreview);
            break;
        }
        case 'video': {
            const file = document.createElement('input');
            file.type = "file";
            file.accept = "video/*";

            const caption = document.createElement('input');
            caption.type = "text";
            caption.placeholder = "Caption";

            const videoPreview = document.createElement('div');
            videoPreview.className = "videoPreview";

            file.addEventListener('change', () => {
                priviewer(file, videoPreview);
            });

            wrap.appendChild(file);
            wrap.appendChild(caption);
            wrap.appendChild(videoPreview);

            break;
        }
        case 'quote': {
            const ta = document.createElement('textarea');
            ta.placeholder = "Quote text";

            const author = document.createElement('input');
            author.type = "text";
            author.placeholder = "Author";

            wrap.appendChild(ta);
            wrap.appendChild(author);
            break;
        }
    }

    block.appendChild(wrap);

    // CONTROLS
    controls.addEventListener('click', e => {
        const action = e.target.dataset.action;
        if (!action) return;

        if (action === 'delete') block.remove();

        if (action === 'moveUp') {
            const prev = block.previousElementSibling;
            if (prev) blocksEl.insertBefore(block, prev);
        }

        if (action === 'moveDown') {
            const next = block.nextElementSibling;
            if (next) blocksEl.insertBefore(next, block);
        }
    });

    return block;
}


// BUTTONS
qs('#addParagraph').onclick = () => blocksEl.appendChild(createBlock('paragraph'));
qs('#addImage').onclick = () => blocksEl.appendChild(createBlock('image'));
qs('#addVideo').onclick = () => blocksEl.appendChild(createBlock('video'));
qs('#addQuote').onclick = () => blocksEl.appendChild(createBlock('quote'));


// MOCK BUTTONS
qs('#saveDraft').addEventListener("click", () => {
    articleArray = [];
    gatherBlocks();
});
qs('#publish').onclick = () => {
    const err = validateArticle();
    if (err) return alert(err);
    articleArray = [];
    gatherBlocks();
    alert("Publish triggered (mock)");
};
qs("#loadPreview").addEventListener("click", () => {
    saveToSession(articleArray);
    window.open("preview.html", "_blank");
});




// IMAGE PREVIEWER
const previewer = (input, previewContainer) => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const img = document.createElement('img');
        img.src = reader.result;
        
        previewContainer.innerHTML = '';
        previewContainer.appendChild(img);
    }
    reader.readAsDataURL(file);
}


// VIDEO PREVIEWER
const priviewer = (input, previewContainer) => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const video = document.createElement('video');
        video.src = reader.result;
        video.controls = true;
        video.maxWidth = 300;
        
        previewContainer.innerHTML = '';
        previewContainer.appendChild(video);
    }
    reader.readAsDataURL(file);
}


// COVER IMAGE FILE PREVIEW LISTENER
const coverImg = qs('#coverInput');
coverImg.addEventListener('change', () => {
    previewer(coverImg, coverPreview);
});


// INITIAL FIRST PARAGRAPH
blocksEl.appendChild(createBlock('paragraph'));



// QUICK BASE36 URL GENERATION
const generator = async (stuff) => {
    const file = stuff.files[0];
    if (!file) return null;

    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
            preview: reader.result,
            filename: file.name,
            size: file.size,
            type: file.type
        });
        reader.onerror = (err) => reject(err);

        reader.readAsDataURL(file);
    });
};




// GATHER ALL ARTICLE DATA
let articleArray = [];
async function gatherBlocks() {

    const categories = Array.from(qs("#category").selectedOptions)
        .map(o => o.value)
        .filter(v => v !== "default");

    const initialObject = {
        title: qs("#title").value.trim(),
        subheading: qs("#subheading").value.trim(),
        coverImage: await generator(qs("#coverInput")),
        covereAlt: qs("#coverAlt").value.trim() || null,
        category: categories,
        author: qs("#author").value.trim(),
        tags: qs("#tags").value.trim(),
        excerpt: qs("#excerpt").value.trim()
    };

    articleArray.push(initialObject);

    const blocks = qsa('.block');
    blocks.forEach(async (block) => {
        const type = block.dataset.type;
        const wrap = block.querySelector('div:nth-of-type(2)');

        switch (type) {
            case 'paragraph': {
                const body = wrap.querySelector('textarea').value.trim();
                articleArray.push({ type, body });
                break;
            }

            case 'image': {
                const alt = wrap.querySelector('input[type="text"]').value.trim();
                articleArray.push({
                    type,
                    file: await generator(wrap.querySelector('input[type="file"]')),
                    alt
                });
                break;
            }

            case 'video': {
                const file = wrap.querySelector('input[type="file"]').files[0] || null;
                const caption = wrap.querySelector('input[type="text"]').value.trim();
                articleArray.push({ type, file, caption });
                break;
            }

            case 'quote': {
                const quote = wrap.querySelector('textarea').value.trim();
                const author = wrap.querySelector('input[type="text"]').value.trim();
                articleArray.push({ type, quote, author });
                break;
            }

            default: {
                console.warn("Unknown block type:", type);
            }
        }
    });


    console.log(articleArray);
}


// SAVE SESSION FUNCTION
const saveToSession = (value) => {
    sessionStorage.setItem("article", JSON.stringify(value));
}




//  FORM UPLOAD FUNCTIONALITY
async function sendToServer(articleArray) {

    const formData = new FormData();

    // 1. Add the article JSON (clean text, no files)
    formData.append("article", JSON.stringify(articleArray));

    // 2. Add media files from blocks
    articleArray.forEach((block, index) => {
        if (block.type === "image" && block.file) {
            formData.append(`image_${index}`, block.file);
        }
        if (block.type === "video" && block.file) {
            formData.append(`video_${index}`, block.file);
        }
        if (index === 0 && block.coverImage) {
            formData.append("coverImage", block.coverImage);
        }
    });

    // 3. Send via fetch
    try {
        const res = await fetch("/api/articles", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        console.log("SERVER RESPONSE:", data);

        alert("Article uploaded successfully.");
    } 
    catch (err) {
        console.error("UPLOAD FAILED:", err);
        alert("Failed to upload article.");
    }
}
