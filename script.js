const markdownInput = document.getElementById("markdown-input");
const htmlOutput = document.getElementById("html-output");
const preview = document.getElementById("preview");

// Helper function: convert inline markdown (bold, italic, links, images)
function convertInlineMarkdown(text) {
  // Escape remaining HTML
  text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Images
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">');

  // Links
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Bold (** or __)
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic (* or _)
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");

  return text;
}

// Main function: convert Markdown to HTML
function convertMarkdown() {
  const lines = markdownInput.value.split("\n");

  const htmlLines = lines.map(line => {
    line = line.trim();

    // Blockquotes (process inline inside)
    const blockquoteMatch = line.match(/^>\s*(.+)$/);
    if (blockquoteMatch) {
      return `<blockquote>${convertInlineMarkdown(blockquoteMatch[1])}</blockquote>`;
    }

    // Headings
    if (/^###\s+/.test(line)) return `<h3>${convertInlineMarkdown(line.replace(/^###\s+/, ""))}</h3>`;
    if (/^##\s+/.test(line)) return `<h2>${convertInlineMarkdown(line.replace(/^##\s+/, ""))}</h2>`;
    if (/^#\s+/.test(line)) return `<h1>${convertInlineMarkdown(line.replace(/^#\s+/, ""))}</h1>`;

    // Other lines: inline formatting only
    return convertInlineMarkdown(line);
  });

  return htmlLines.join("");
}

// Event listener: update HTML output and preview on input
markdownInput.addEventListener("input", () => {
  const html = convertMarkdown();
  htmlOutput.textContent = html;
  preview.innerHTML = html;
});
