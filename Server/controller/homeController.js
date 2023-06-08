const Bank = require('../models/Bank');
const Info = require('../models/Info');
const Category = require('../models/Category');
const Item = require('../models/Item');

module.exports = {
  viewHomePage: async (req, res) => {
    try {
      // tarik data item paling laris berdasarkan sumBooked
      const hotItem = await Item.find()
        .select(
          '_id itemName location itemPrice unit imageId sumBooked isPopular'
        )
        .limit(5)
        .populate({
          path: 'image',
          select: '_id imageUrl',
          options: { sort: { sumBooked: -1 } }, // -1 maksudnya descending
        });

      const categoryList = await Category.find({
        $where: 'this.item.length > 0',
      })
        .limit(3)
        .populate({
          path: 'item',
          select:
            '_id itemName location itemPrice unit imageId sumBooked isPopular',
          perDocumentLimit: 4,
          options: { sort: { sumbooked: -1 } },
          populate: {
            path: 'image',
            perDocumentLimit: 1,
          },
        });

      const testimony = await Info.find({
        type: 'Testimony',
        isHighlight: true,
      })
        .select('_id infoName type imageUrl description item')
        .limit(3)
        .populate({
          path: 'item',
          select: '_id itemName location',
        });

      const Hotel = await Category.find({ categoryName: 'Hotel' });
      const Event = await Category.find({ categoryName: 'Event' });
      const Tour = await Category.find({ categoryName: 'Tour Package' });

      const sumHotel = Hotel.reduce(
        (count, current) => count + current.item.length,
        0
      );
      const sumEvent = Event.reduce(
        (count, current) => count + current.item.length,
        0
      );
      const sumTour = Tour.reduce(
        (count, current) => count + current.item.length,
        0
      );

      res.status(200).json({
        summaryInfo: {
          sumHotel,
          sumEvent,
          sumTour,
        },
        hotItem,
        categoryList,
        testimony,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  viewDetailPage: async (req, res) => {
    try {
      // populate = join in sql
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'category', select: 'id categoryName' })
        .populate({ path: 'image', select: 'id imageUrl' })
        .populate({
          path: 'info',
          match: { type: { $in: ['NearBy', 'Testimony'] } },
        })
        .populate({ path: 'feature' });

      if (!item) throw new Error('Item not found');

      const bank = await Bank.find();

      res.status(200).json({
        ...item._doc,
        bank,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
