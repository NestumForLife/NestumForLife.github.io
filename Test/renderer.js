const { ipcRenderer } = require('electron');
const fs = require('fs');

document.getElementById('submit').addEventListener('click', (event) => {
    event.preventDefault();

    let nextProjectId = 1;
    const form = document.getElementById('project-form');

    try {
        const data = fs.readFileSync('nextProjectId.json', 'utf8');
        nextProjectId = JSON.parse(data).nextProjectId;
        nextProjectId++;
    } catch (err) {
        nextProjectId = 1;
    }

    const project = {
        title: form.elements.title.value,
        description: form.elements.description.value,
        link: form.elements.link.value,
        id: nextProjectId
    };

    // Write the updated nextProjectId back to the file
    try {
        fs.writeFileSync('nextProjectId.json', JSON.stringify({ nextProjectId }), 'utf8');
    } catch (err) {
        console.error(err);
        return;
    }

    ipcRenderer.send('submit', project);
});

function navigateToDelete() {
    ipcRenderer.send('delete', 'remove.html');
}