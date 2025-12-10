const container = document.querySelector("#article");

const data = JSON.parse(sessionStorage.getItem("article"));
console.log(data);


if (!data) {
    container.innerHTML = "<p>No article data found.</p>";
} else {
    const main = data[0];

    // RENDER TITLE
    const h1 = document.createElement("h1");
    h1.textContent = main.title;
    container.appendChild(h1);

    // RENDER SUBHEADING
    if (main.subheading) {
        const h2 = document.createElement("h2");
        h2.textContent = main.subheading;
        container.appendChild(h2);
    }

    // COVER IMAGE
    if (main.coverImage) {
        const img = document.createElement("img");
        img.src = main.coverImage.preview;
        img.alt = "Cover Image";
        container.appendChild(img);
    }

    // META INFO
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent =
        `Category: ${main.category.join(", ")} | Author: ${main.author || "Unknown"}`;
    container.appendChild(meta);

    // EXCERPT
    if (main.excerpt) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${main.excerpt}</strong>`;
        container.appendChild(p);
    }

    // RENDER BLOCKS
    for (let i = 1; i < data.length; i++) {
        const block = data[i];

        if (block.type === "paragraph") {
            const p = document.createElement("p");
            p.textContent = block.body;
            container.appendChild(p);
        }

        if (block.type === "image") {
            if (block.file) {
                const img = document.createElement("img");
                img.src = block.file.preview;
                img.alt = block.alt || "";
                container.appendChild(img);
            }
        }

        if (block.type === "video") {
            if (block.file) {
                const video = document.createElement("video");
                video.controls = true;
                video.src = URL.createObjectURL(block.file);
                container.appendChild(video);

                if (block.caption) {
                    const cap = document.createElement("p");
                    cap.style.fontStyle = "italic";
                    cap.textContent = block.caption;
                    container.appendChild(cap);
                }
            }
        }

        if (block.type === "quote") {
            const q = document.createElement("blockquote");
            q.innerHTML = `${block.quote}<br><em>– ${block.author}</em>`;
            container.appendChild(q);
        }
    }
}