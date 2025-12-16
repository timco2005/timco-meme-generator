# Meme Templates Folder

This folder is for manually adding meme template images to the project.

**Note:** When you upload images through the web interface, they are automatically saved to browser storage (IndexedDB) and added to the gallery. You don't need to manually add files here unless you want to include them in the project repository.

## Manual Template Addition

To manually add templates to this folder:
1. Place your image file in this folder
2. Update `script.js` and add an entry to the `memeTemplates` array:
   ```javascript
   { name: 'Template Name', url: 'assets/your-image.jpg' }
   ```

Supported formats: JPG, PNG, GIF, WebP

Note: For best results, use images with clear text areas where meme text can be added.

