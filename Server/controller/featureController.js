const Item = require('../models/Item');
const Feature = require('../models/Feature');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  addFeature: async (req, res) => {
    console.log(req.body);

    const { featureName, qty, item } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image Not Found' });
    }

    try {
      const itemDB = await Item.findOne({ _id: item });
      if (!itemDB) return res.status(400).json({ message: 'Item Not Found' });
      const feature = await Feature.create({
        featureName,
        qty,
        item,
        imageUrl: `images/${req.file.filename}`,
      });

      itemDB.feature.push({ _id: feature._id });
      await itemDB.save();

      res.status(201).json(feature);
    } catch (err) {
      await fs.unlink(path.join(`public/images/${req.file.filename}`));
      res.status(500).json({ message: err.message });
    }
  },

  viewFeature: async (req, res) => {
    try {
      // populate = join in sql
      const feature = await Feature.find().populate({
        path: 'item',
        select: 'id itemName',
      });

      feature.length === 0
        ? res.status(404).json({ message: 'No Data Feature Found' })
        : res.status(200).json(feature);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateFeature: async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['featureName', 'qty', 'item'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: 'Invalid Key Parameters' });
    }

    try {
      const feature = await Feature.findById({ _id: id });
      updates.forEach((update) => {
        feature[update] = req.body[update];
      });

      if (req.file) {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.imageUrl = `images/${req.file.filename}`;
      }
      await feature.save();
      res.status(200).json(feature);
    } catch (err) {
      if (req.file) {
        await fs.unlink(path.join(`public/images/${req.file.filename}`));
      }
      res.status(400).json({ message: err.message });
    }
  },

  deleteFeature: async (req, res) => {
    try {
      const { id } = req.params;
      const feature = await Feature.findOne({ _id: id });
      if (!feature) {
        return res.status(404).send({ message: 'Feature Not Found' });
      }

      async function deleteItem() {
        const itemDB = await Item.findOne({ _id: feature.item });

        for (let i = 0; i < itemDB.feature.length; i++) {
          if (itemDB.feature[i]._id.toString() === feature._id.toString()) {
            itemDB.feature.pull({ _id: feature._id });
            await itemDB.save();
          }
        }
      }

      await feature
        .remove()
        .then(() => deleteItem())
        .then(() => fs.unlink(path.join(`public/${feature.imageUrl}`)));

      res.status(200).json({ message: 'Feature Deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
