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

    console.log(project);

    if(!project.title || !project.description || !project.link) {
        alert('Please fill out all fields');
        return;
    }

    if(detectIfAlreadyExists(project.title)) {
        alert('Project with the same title already exists');
        return;
    }
    
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

function detectIfAlreadyExists(projectTitle) {
    // Check if project with the same title already exists
    const existingProjects = getExistingProjects();
    const projectExists = existingProjects.some(project => project.title === projectTitle);
    return projectExists;
}

function getExistingProjects() {
    try {
        const data = fs.readFileSync('projects.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}