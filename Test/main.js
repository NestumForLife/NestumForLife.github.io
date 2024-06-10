const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile('add.html');
}

app.whenReady().then(createWindow);

ipcMain.on('submit', (event, data) => {
  console.log('Received submit event with data:', data);
  fs.readFile('projects.json', 'utf8', (err, fileData) => {
    if (err) {
      console.error(err);
      return;
    }

    const projects = JSON.parse(fileData);
    projects.push(data);

    fs.writeFile('projects.json', JSON.stringify(projects, null, 4), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log('Successfully updated projects.json');
    });
  });
});

ipcMain.on('edit-project', (event, projectId) => {
  console.log(`Received request to edit project with ID: ${projectId}`);
  event.sender.send('open-modal', projectId);
});

ipcMain.on('delete-project', (event, projectId) => {
  console.log(`Received request to delete project with ID: ${projectId}`);

  try {
      let data = fs.readFileSync('projects.json', 'utf8');
      let projects = JSON.parse(data);
      projects = projects.filter(project => project.id !== projectId);

      //console.log(`Updated projects list: ${JSON.stringify(projects, null, 2)}`);

      fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2), 'utf8');
      console.log('Successfully wrote updated project list to file');
  } catch (err) {
      console.error('Error reading or writing file:', err);
  }
});

ipcMain.on('delete', (event, path) => {
  mainWindow.loadFile(path);
});

ipcMain.on('add', (event, path) => {
  mainWindow.loadFile(path);
});


ipcMain.on('save-changes', (event, projectId, newName, newDescription, newLink) => {
  
  const project = {
    title: newName,
    description: newDescription,
    link: newLink,
    id: projectId
  };
  
  try {
    let data = fs.readFileSync('projects.json', 'utf8');
    let projects = JSON.parse(data);
    const index = projects.findIndex(p => p.id === projectId);
    
    projects[index].title = newName;
    projects[index].description = newDescription;
    projects[index].link = newLink;

    console.log(projects[index]);

    console.log(`Updated project: ${JSON.stringify(projects, null, 2)}`);
    fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2), 'utf8');
  } catch (err) {
      console.error('Error reading or writing file:', err);
  }

  mainWindow.loadFile('remove.html');
});
