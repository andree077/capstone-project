const Employee = require('../models/Employee'); // Import the Employee model

const EmployeeController = {
    // Create a new employee
    async createEmployee(req, res) {
        try {
            let employee = new Employee(req.body);
            employee = await employee.save();
            res.status(201).send(employee);
        } catch (error) {
            res.status(400).send(error);
        }
    },

    // Get all employees
    async getAllEmployees(req, res) {
        try {
            const employees = await Employee.find();
            res.status(200).send(employees);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Get a single employee by ID
    async getEmployeeById(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.status(200).send(employee);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    // Update an employee
    async updateEmployee(req, res) {
        try {
            const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.status(200).send(employee);
        } catch (error) {
            res.status(400).send(error);
        }
    },

    // Delete an employee
    async deleteEmployee(req, res) {
        try {
            const employee = await Employee.findByIdAndDelete(req.params.id);
            if (!employee) {
                return res.status(404).send('Employee not found');
            }
            res.status(200).send(employee);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = EmployeeController;

