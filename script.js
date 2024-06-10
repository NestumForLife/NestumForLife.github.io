// ADD ABOUT ME SECTION
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('aboutme.txt')
        .then(response => response.text())
        .then(data => {
            const formattedData = data.replace(/\n/g, '<br>');
            const section = document.querySelector('#about');
            const p = document.createElement('p');
            p.innerHTML = formattedData;
            section.appendChild(p);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

// ADD PROJECTS SECTION
document.addEventListener('DOMContentLoaded', (event) => {
    fetch('Adder/projects.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(project => {
                addProject(project.title, project.description, project.link);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

// AUXILIARY FUNCTION
function addProject(title, description, link) {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project';

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    projectDiv.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    projectDiv.appendChild(descriptionElement);

    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.textContent = 'View Project';
    projectDiv.appendChild(linkElement);

    const section = document.querySelector('#projects');
    section.appendChild(projectDiv);
}
