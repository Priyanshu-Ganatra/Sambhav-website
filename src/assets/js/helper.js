import fs from 'fs/promises';

export async function createFolderIfNotExists(folderPath) {
    try {
      // Check if the folder exists
      await fs.access(folderPath);
    } catch (err) {
      if (err.code === 'ENOENT') { // ENOENT indicates folder doesn't exist
        // Create the folder recursively (creates any missing parent folders)
        await fs.mkdir(folderPath, { recursive: true });
        console.log("Folder created")
      } else {
        // Handle other potential errors (e.g., permission issues)
        console.log("Error creating file: ",err)
        throw err;
      }
    }
  }