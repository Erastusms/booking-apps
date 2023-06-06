const Item = require('../models/Item');
const Category = require('../models/Category');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Info = require('../models/Info');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  addItem: async (req, res) => {
    try {
      console.log(req.body);

      const { itemName, itemPrice, unit, location, description, categoryId } =
        req.body;

      if (req.files) {
        const categoryDB = await Category.findOne({ _id: categoryId });
        const newItem = new Item({
          categoryId,
          itemName,
          itemPrice,
          unit,
          location,
          description,
        });
        const item = await Item.create(newItem);
        categoryDB.item.push({ _id: item._id });
        await categoryDB.save();

        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.image.push({ _id: imageSave._id });
          await item.save();
        }
        return res.status(201).json(item);
      }

      return res.status(200).json({ message: 'Image Not Found' });
    } catch (err) {
      for (let i = 0; i < req.files.length; i++) {
        await fs.unlink(path.join(`public/images/${req.files[i].filename}`));
      }
      res.status(500).json({ message: err.message });
    }
  },

  viewItem: async (req, res) => {
    try {
      // populate = join in sql
      const item = await Item.find()
        .populate({ path: 'category', select: 'id categoryName' })
        .populate({ path: 'image', select: 'id imageUrl' })
        .populate({ path: 'info', select: 'id infoName' })
        .populate({ path: 'feature', select: 'id featureName' });

      item.length === 0
        ? res.status(404).json({ message: 'No Data Item Found' })
        : res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateItem: async (req, res) => {
    console.log(req.body);

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'itemName',
      'itemPrice',
      'unit',
      'location',
      'description',
      'categoryId',
      'isPopular',
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: 'Invalid Key Parameters' });
    }
    try {
      const item = await Item.findById(req.params.id)
        .populate({
          path: 'category',
          select: 'id categoryName',
        })
        .populate({ path: 'image', select: 'id imageUrl' });

      updates.forEach((update) => {
        item[update] = req.body[update];
      });

      await item.save();
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id });
      if (!item) {
        return res.status(404).send({ message: 'Item Not Found' });
      }

      const categoryDB = await Category.findOne({ _id: item.categoryId });

      async function deleteCategory() {
        for (let i = 0; i < categoryDB.item.length; i++) {
          if (categoryDB.item[i]._id.toString() === item._id.toString()) {
            categoryDB.item.pull({ _id: item._id });
            await categoryDB.save();
          }
        }
      }

      function deleteImage() {
        for (let i = 0; i < item.image.length; i++) {
          Image.findOne({ _id: item.image[i]._id })
            .then((image) => {
              fs.unlink(path.join(`public/${image.imageUrl}`));
              image.remove();
            })
            .catch((error) => {
              res.status(500).json({ message: error.message });
            });
        }
      }

      async function deleteInfo() {
        for (let i = 0; i < item.info.length; i++) {
          Info.findOne({ _id: item.info[i]._id })
            .then((info) => {
              fs.unlink(path.join(`public/${info.imageUrl}`));
              info.remove();
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        }
      }

      async function deleteFeature() {
        for (let i = 0; i < item.feature.length; i++) {
          Feature.findOne({ _id: item.feature[i]._id })
            .then((feature) => {
              fs.unlink(path.join(`public/${feature.imageUrl}`));
              feature.remove();
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        }
      }

      await item
        .remove()
        .then(() => deleteCategory())
        .then(() => deleteImage())
        .then(() => deleteInfo())
        .then(() => deleteFeature());
      res.status(200).json({ message: 'Item Deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
