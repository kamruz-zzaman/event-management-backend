const Customer = require("../models/Customer");
const { format } = require("date-fns");

const getAllCustomers = async (req, res) => {
  try {
    // do pagination stuff here
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skipIndex = (page - 1) * limit;
    const total = await Customer.countDocuments();
    // get the results from very last page

    const results = await Customer.find()
      .limit(limit)
      .skip(skipIndex)
      .sort({ _id: -1 })
      .exec();

    res.status(200).json({
      message: "All customers",
      data: results,
      total: total,
    });
  } catch (err) {
    res.status(403).json({
      errorMessage: "There was a problem getting the customers",
      error: err.message,
    });
  }
};

const getCustomersBySearch = async (req, res) => {
  try {
    // do pagination stuff here
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skipIndex = (page - 1) * limit;
    const search = req.query.search;
    const total = await Customer.countDocuments({
      $or: [
        { customer_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { date: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ],
    });
    // get the results from very last page

    const results = await Customer.find({
      $or: [
        { customer_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { date: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ],
    })
      .limit(limit)
      .skip(skipIndex)
      .sort({ _id: -1 })
      .exec();

    res.status(200).json({
      message: "All customers",
      data: results,
      total: total,
    });
  } catch (err) {
    res.status(403).json({
      errorMessage: "There was a problem getting the customers",
      error: err.message,
    });
  }
};

const getCustomersNoPagination = async (req, res) => {
  try {
    const customers = await Customer.find();
    const total = await Customer.countDocuments();

    res.status(200).json({
      message: "All customers",
      data: customers,
      total: total,
    });
  } catch (err) {
    res.status(403).json({
      errorMessage: "There was a problem getting the customers",
      error: err.message,
    });
  }
};

const getSingleCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findById(id);
    res.status(200).json({
      message: "Customer found",
      data: customer,
    });
  } catch (err) {
    res.status(403).json({
      errorMessage: "There was a problem getting the customer",
      error: err.message,
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findByIdAndDelete(id);
    res.status(200).json({
      message: "Customer deleted successfully",
      data: customer,
    });
  } catch (error) {
    res.status(403).json({
      errorMessage: "There was a problem deleting the customer",
      error: err.message,
    });
  }
};
const deleteMultipleCustomers = async (req, res) => {
  try {
    const ids = req.body.ids;
    const customers = await Customer.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
      message: "Customers deleted successfully",
      data: customers,
    });
  } catch (error) {
    res.status(403).json({
      errorMessage: "There was a problem deleting the customer",
      error: err.message,
    });
  }
};
const createCustomer = async (req, res) => {
  try {
    const authoriztion = req.headers.authorization;
    const customer = new Customer(req.body);
    const newCustomer = await customer.save();
    res.status(200).json({
      message: "Customer created successfully",
      data: newCustomer,
    });
  } catch (err) {
    res.status(403).json({
      errorMessage: "There was a problem creating the customer",
      error: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      updates,
      options
    );
    res.status(200).json({
      message: "Customer updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(403).json({
      errorMessage: "There was a problem updating the customer",
      error: err.message,
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomersNoPagination,
  deleteCustomer,
  createCustomer,
  deleteMultipleCustomers,
  getSingleCustomer,
  updateCustomer,
  getCustomersBySearch,
};
