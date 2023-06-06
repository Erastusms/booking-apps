const Customer = require('../models/Customer');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  addCustomer: async (req, res) => {
    const customer = new Customer({ ...req.body });
    try {
      await customer.save();
      return res.status(201).json(customer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  viewCustomer: async (req, res) => {
    try {
      const customer = await Customer.find();
      customer.length === 0
        ? res.status(404).json({ message: 'No Data Customer Found' })
        : res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateCustomer: async (req, res) => {
    console.log(req.body);

    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phoneNumber'];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(403).json({ message: 'Invalid Key Parameters' });
    }
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer Not Found' });
      }
      updates.forEach((update) => {
        customer[update] = req.body[update];
      });

      await customer.save();
      res.status(200).json(customer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      customer
        ? res.status(200).json({ message: 'Customer Deleted' })
        : res.status(404).send({ message: 'Customer Not Found' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};


