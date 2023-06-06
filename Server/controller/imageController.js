const Item = require('../models/Item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  addImageItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      console.log(req.files);
      // if (!req.files )

      if (req.files) {
        if (req.files.length === 0) {
          return res.status(400).json({ message: 'Please Upload Image' });
        }

        const item = await Item.findOne({ _id: itemId });
        let imageSave;
        // const imageSave = await Image.create({
        //   imageUrl: `images/${req.file.filename}`,
        // });
        // item.image.push({ _id: imageSave._id });
        for (let i = 0; i < req.files.length; i++) {
          imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.image.push({ _id: imageSave._id });
          await item.save();
        }

        // await item.save();
        return res.status(201).json(imageSave);
        // return res.status(201).json({ message:'Image has been uploaded'});
      }
      return res.status(400).json({ message: 'Image Required' });
    } catch (err) {
      if (req.file) {
        for (let i = 0; i < req.files.length; i++) {
          await fs.unlink(path.join(`public/images/${req.files[i].filename}`));
        }
      }
      res.status(500).json({ message: err.message });
    }
  },

  deleteImageItem: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const item = await Item.findOne({ _id: itemId });
      const image = await Image.findOne({ _id: id });
      if (!item) {
        return res.status(404).send({ message: 'Item Not Found' });
      }
      if (!image) {
        return res.status(404).send({ message: 'Image Not Found' });
      }

      async function deleteImageOnItem() {
        for (let i = 0; i < item.image.length; i++) {
          if (item.image[i]._id.toString() === image._id.toString()) {
            item.image.pull({ _id: image._id });
            await item.save();
          }
        }
      }

      await image
        .remove()
        .then(() => deleteImageOnItem())
        .then(() => fs.unlink(path.join(`public/${image.imageUrl}`)));

      res.status(200).json({ message: 'Image Deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
