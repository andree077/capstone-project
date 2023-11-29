import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [currentEmployee, setCurrentEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        address: ''
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const res = await axios.get('/api/employees');
        setEmployees(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            await axios.put(`/api/employees/${currentEmployee._id}`, currentEmployee);
        } else {
            await axios.post('/api/employees', currentEmployee);
        }
        fetchEmployees();
        resetForm();
    };

    const editEmployee = (employee) => {
        setEditing(true);
        setCurrentEmployee(employee);
    };

    const deleteEmployee = async (id) => {
        await axios.delete(`/api/employees/${id}`);
        fetchEmployees();
    };

    const resetForm = () => {
        setCurrentEmployee({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dob: '',
            address: ''
        });
        setEditing(false);
    };

    const handleChange = (e) => {
        setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-4">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={currentEmployee.firstName}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={currentEmployee.lastName}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={currentEmployee.email}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={currentEmployee.phone}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={currentEmployee.dob}
                    onChange={handleChange}
                    className="border p-2"
                />
                <textarea
                    name="address"
                    placeholder="Address"
                    value={currentEmployee.address}
                    onChange={handleChange}
                    className="border p-2"
                />
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {editing ? 'Update' : 'Add'} Employee
                </button>
                <button onClick={resetForm} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Reset
                </button>
            </form>
            <div className="mb-8">
                {employees.map((employee) => (
                    <div key={employee._id} className="border p-2 mb-2 flex justify-between items-center">
                        <div>
                            <p>{employee.firstName} {employee.lastName}</p>
                            <p>{employee.email}</p>
                            <p>{employee.phone}</p>
                            <p>{employee.dob}</p>
                            <p>{employee.address}</p>
                        </div>
                        <div>
                            <button onClick={() => editEmployee(employee)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                                Edit
                            </button>
                            <button onClick={() => deleteEmployee(employee._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EmployeeManagement;
