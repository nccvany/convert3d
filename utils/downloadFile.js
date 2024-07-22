export function downloadFile(result, filename) {
    var blob = new Blob([result], { type: "text/plain" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}