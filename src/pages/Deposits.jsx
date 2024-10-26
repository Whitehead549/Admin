import { useEffect, useState } from 'react';
import { collection, query, getDocs, updateDoc, doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore'; // Added setDoc and arrayUnion
import { auth, db } from '../Config/Config';

const Deposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState({}); // Track which deposits are in edit mode

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const depositsCollection = collection(db, 'deposits');
                const q = query(depositsCollection); // Fetch all deposits
                const querySnapshot = await getDocs(q);
                
                const depositsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    firstName: doc.data().firstName || '',
                    lastName: doc.data().lastName || '',
                    status: doc.data().status || 'pending',
                    amount: doc.data().amount || 0, // Fetch amount
                    uid: doc.data().uid || 0, // Fetch Uid
                    TotalAmount: doc.data().TotalAmount || 0 // Fetch TotalAmount
                }));

                setDeposits(depositsData);
            } catch (error) {
                console.error("Error fetching deposits: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeposits();
    }, []);

    const handleEditClick = (id) => {
        setEditMode(prev => ({ ...prev, [id]: true })); // Enable edit mode for the specific deposit
    };

    const handleStatusChange = (id, newStatus) => {
        setDeposits(prevDeposits => 
            prevDeposits.map(deposit => 
                deposit.id === id ? { ...deposit, status: newStatus } : deposit
            )
        );
    };

    const handleSubmit = async (id) => {
        try {
            const depositRef = doc(db, 'deposits', id);
            const depositDoc = await getDoc(depositRef);

            if (depositDoc.exists()) {
                const { TotalAmount, amount, uid} = depositDoc.data(); // Get current TotalAmount, amount, and uid
                const selectedStatus = deposits.find(deposit => deposit.id === id).status;

                if (selectedStatus === 'approved') {
                    const newTotalAmount = Number(TotalAmount) + Number(amount); // Sum the values as numbers

                    // Step 1: Create/Update the TransHistory document with the UID
                    const transHistoryRef = doc(db, 'TransHistory', uid);
                    await setDoc(transHistoryRef, {
                        depositTrans: arrayUnion({
                            date: new Date().toISOString(), // Add the current date
                            amount: Number(amount), // Log the current amount being added
            
                        })
                    }, { merge: true }); // Merge to avoid overwriting existing depositTrans

                    //  // Fetch the TransHistory document to get updated depositTrans
                    // const transHistoryDoc = await getDoc(transHistoryRef);
                    // if (transHistoryDoc.exists()) {
                    //     const transData = transHistoryDoc.data();
                    //     console.log("depositTrans: ", transData.depositTrans); // Log the depositTrans array
                    // }

                    // Step 2: Update the deposits document
                    await updateDoc(depositRef, { 
                        TotalAmount: newTotalAmount, // Update TotalAmount with the sum
                        amount: 0, // Set amount to 0 after adding to TransHistory
                        status: selectedStatus // Update status
                    });
                } else if (selectedStatus === 'declined' || selectedStatus === 'pending') {
                    // Do not update TotalAmount or amount
                    await updateDoc(depositRef, { status: selectedStatus }); // Just update status
                }

                setEditMode(prev => ({ ...prev, [id]: false })); // Disable edit mode after submission
            }
        } catch (error) {
            console.error("Error updating deposit: ", error);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Deposits</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">First Name</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Last Name</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Status</th>
                            <th className="py-3 px-4 border-b border-gray-300 text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposits.map(deposit => (
                            <tr key={deposit.id} className="hover:bg-gray-100 transition-colors duration-200">
                                <td className="py-3 px-4 border-b border-gray-300">{deposit.firstName}</td>
                                <td className="py-3 px-4 border-b border-gray-300">{deposit.lastName}</td>
                                <td className="py-3 px-4 border-b border-gray-300">
                                    {editMode[deposit.id] ? (
                                        <select 
                                            value={deposit.status} 
                                            onChange={(e) => handleStatusChange(deposit.id, e.target.value)}
                                            className="border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="approved">Approved</option>
                                            <option value="declined">Declined</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    ) : (
                                        <span className="font-medium text-gray-700">{deposit.status}</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-300">
                                    {editMode[deposit.id] ? (
                                        <button 
                                            onClick={() => handleSubmit(deposit.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                                        >
                                            Submit
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleEditClick(deposit.id)}
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

export default Deposits;
