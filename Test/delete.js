const { ipcRenderer } = require('electron');

function navigateToAdd() {
    ipcRenderer.send('add', 'add.html');
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                addProject(project.title, project.description, project.link, project.id);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});



// AUXILIARY FUNCTION
function addProject(title, description, link,id) {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project';
    projectDiv.dataset.id = id;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    projectDiv.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    projectDiv.appendChild(descriptionElement);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.id = id;
    deleteButton.addEventListener('click', (event) => deleteProject(id));
    projectDiv.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.dataset.id = id;
    editButton.addEventListener('click', (event) => editProject(id));
    projectDiv.appendChild(editButton);
    
    const section = document.querySelector('#projects');
    section.appendChild(projectDiv);
}

function editProject(projectId) {
    projectDiv = document.querySelector(`div[data-id="${projectId}"]`);

    let edit = {
        title: '',
        description: '',
        link: '',
        id: projectId
    };

    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                if(project.id === projectId) {;
                    edit.title = project.title;
                    edit.description = project.description;
                    edit.link = project.link;

                    const modal = document.createElement('div');
                    modal.className = 'modal';
                    
                    // Create a pop-up form
                    const form = document.createElement('form');
                    form.className = 'edit-form';

                    const nameLabel = document.createElement('label');
                    nameLabel.textContent = 'Name:';
                    form.appendChild(nameLabel);

                    const nameInput = document.createElement('input');
                    nameInput.type = 'text';
                    nameInput.value = edit.title;
                    nameInput.id = 'name-input';
                    form.appendChild(nameInput);

                    const descriptionLabel = document.createElement('label');
                    descriptionLabel.textContent = 'Description:';
                    form.appendChild(descriptionLabel);

                    const descriptionInput = document.createElement('input');
                    descriptionInput.type = 'text';
                    descriptionInput.value = edit.description;
                    descriptionInput.id = 'description-input';
                    form.appendChild(descriptionInput);

                    const linkLabel = document.createElement('label');
                    linkLabel.textContent = 'Link:';
                    form.appendChild(linkLabel);

                    const linkInput = document.createElement('input');
                    linkInput.type = 'text';
                    linkInput.value = edit.link;
                    linkInput.id = 'link-input';
                    form.appendChild(linkInput);

                    const saveButton = document.createElement('button');
                    saveButton.textContent = 'Save';
                    saveButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        const name = document.getElementById('name-input').value;
                        const description = document.getElementById('description-input').value;
                        const link = document.getElementById('link-input').value;
                        ipcRenderer.send('save-changes', projectId, name, description, link);
                        modal.remove();
                    });

                    form.appendChild(saveButton);

                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        modal.remove();
                    });
                    form.appendChild(cancelButton);

                    modal.appendChild(form);

                    document.body.appendChild(modal);
                }
            });
        })
    .catch((error) => {
        console.error('Error:', error);
    });

}

function deleteProject(projectId) {
    console.log(`Deleting project with ID: ${projectId}`);

    // Remove the project from the DOM
    const deleteButton = document.querySelector(`button[data-id="${projectId}"]`);
    deleteButton.parentElement.remove();

    // Send a message to the main process to delete the project from the projects.json file
    ipcRenderer.send('delete-project', projectId);
}