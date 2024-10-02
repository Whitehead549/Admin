import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Config/Config'; // Assuming firebaseConfig is set up

const Timezone = () => {
    const [historyData, setHistoryData] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [editedDate, setEditedDate] = useState({});
    const [editedTime, setEditedTime] = useState({});

    useEffect(() => {
        const fetchHistoryData = async () => {
            const querySnapshot = await getDocs(collection(db, 'history'));
            const historyArray = [];
            querySnapshot.forEach((doc) => {
                historyArray.push({ id: doc.id, ...doc.data() });
            });
            setHistoryData(historyArray);
        };

        fetchHistoryData();
    }, []);

    // Handle the edit click
    const handleEditClick = (id) => {
        setEditMode({ ...editMode, [id]: true });
        const futureDate = new Date(historyData.find(item => item.id === id).futureDate);
        setEditedDate({ ...editedDate, [id]: futureDate.toISOString().split('T')[0] }); // Extract date
        setEditedTime({ ...editedTime, [id]: futureDate.toTimeString().split(' ')[0].slice(0, 5) }); // Extract time (HH:MM)
    };

    // Handle date input change
    const handleDateChange = (id, value) => {
        setEditedDate({ ...editedDate, [id]: value });
    };

    // Handle time input change
    const handleTimeChange = (id, value) => {
        setEditedTime({ ...editedTime, [id]: value });
    };

    // Handle the submit action and update Firestore
    const handleSubmit = async (id) => {
        const selectedDate = new Date(`${editedDate[id]}T${editedTime[id]}:00Z`); // Combine date and time
        const formattedDate = selectedDate.toISOString(); // Convert back to ISO string

        const docRef = doc(db, 'history', id);
        await updateDoc(docRef, { futureDate: formattedDate });

        setEditMode({ ...editMode, [id]: false });
        // Update the data in the UI after saving
        const updatedData = historyData.map(item => 
            item.id === id ? { ...item, futureDate: formattedDate } : item
        );
        setHistoryData(updatedData);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Timezone</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">First Name</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Last Name</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Future Date & Time</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-100 transition-colors duration-200">
                                <td className="py-3 px-4 border-b border-gray-300">{entry.firstName}</td>
                                <td className="py-3 px-4 border-b border-gray-300">{entry.lastName}</td>
                                <td className="py-3 px-4 border-b border-gray-300">
                                    {editMode[entry.id] ? (
                                        <div>
                                            <input 
                                                type="date" 
                                                value={editedDate[entry.id] || ''} 
                                                onChange={(e) => handleDateChange(entry.id, e.target.value)}
                                                className="border rounded p-1 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                            <input 
                                                type="time" 
                                                value={editedTime[entry.id] || ''} 
                                                onChange={(e) => handleTimeChange(entry.id, e.target.value)}
                                                className="border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>
                                    ) : (
                                        <span className="font-medium text-gray-700">
                                            {new Date(entry.futureDate).toISOString().split('T')[0]}{' '}
                                            {new Date(entry.futureDate).toTimeString().split(' ')[0].slice(0, 5)}
                                        </span> 
                                    )}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-300">
                                    {editMode[entry.id] ? (
                                        <button 
                                            onClick={() => handleSubmit(entry.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                                        >
                                            Submit
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleEditClick(entry.id)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Timezone;
