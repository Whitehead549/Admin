import { useEffect, useState } from 'react';
import { collection, query, getDocs, updateDoc, doc, arrayUnion, setDoc} from 'firebase/firestore';
import { auth, db } from '../Config/Config';

const Withdraw = () => {
    const [withdraws, setWithdraws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState({});

    useEffect(() => {
        const fetchWithdraws = async () => {
            try {
                const withdrawsCollection = collection(db, 'withdraws');
                const q = query(withdrawsCollection);
                const querySnapshot = await getDocs(q);
                
                const withdrawsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    firstName: doc.data().firstName || '',
                    lastName: doc.data().lastName || '',
                    status: doc.data().status || 'pending',
                    Totalwithdraw: doc.data().Totalwithdraw || 0, // Assuming this field exists
                    amountWithdraw: doc.data().amountWithdraw || 0, // Assuming this field exists
                    uid: doc.data().uid || 0, // Fetch Uid
                }));

                setWithdraws(withdrawsData);
            } catch (error) {
                console.error("Error fetching withdraws: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWithdraws();
    }, []);

    const handleEditClick = (id) => {
        setEditMode(prev => ({ ...prev, [id]: true }));
    };

    const handleStatusChange = (id, newStatus) => {
        setWithdraws(prevWithdraws => 
            prevWithdraws.map(withdraw => 
                withdraw.id === id ? { ...withdraw, status: newStatus } : withdraw
            )
        );
    };

    const handleSubmit = async (id) => {
        try {
            const withdrawToUpdate = withdraws.find(withdraw => withdraw.id === id);
            const { status, Totalwithdraw, amountWithdraw, uid} = withdrawToUpdate;

            // Check the selected status
            if (status === "approved") {
                // Calculate new Totalwithdraw
                const newTotalwithdraw = Number(Totalwithdraw) + Number(amountWithdraw);

                 // Step 1: Create/Update the TransHistory document with the UID
                 const transHistoryRef = doc(db, 'TransHistory', uid);
                 await setDoc(transHistoryRef, {
                     withdrawlTrans: arrayUnion({
                         date: new Date().toISOString(), // Add the current date
                         amount: Number(amountWithdraw), // Log the current amount being added
                     })
                 }, { merge: true }); // Merge to avoid overwriting existing transactions

                // Update Firestore
                const withdrawRef = doc(db, 'withdraws', id);
                await updateDoc(withdrawRef, {
                    Totalwithdraw: newTotalwithdraw,
                    amountWithdraw: 0, // Reset amountWithdraw to 0
                    status: status // Update status to approved
                });
            } else {
                // If status is pending or declined, just update the status
                const withdrawRef = doc(db, 'withdraws', id);
                await updateDoc(withdrawRef, {
                    status: status // Update status without changing Totalwithdraw
                });
            }

            // Disable edit mode after submission
            setEditMode(prev => ({ ...prev, [id]: false }));
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Withdraws</h1>
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
                        {withdraws.map(withdraw => (
                            <tr key={withdraw.id} className="hover:bg-gray-100 transition-colors duration-200">
                                <td className="py-3 px-4 border-b border-gray-300">{withdraw.firstName}</td>
                                <td className="py-3 px-4 border-b border-gray-300">{withdraw.lastName}</td>
                                <td className="py-3 px-4 border-b border-gray-300">
                                    {editMode[withdraw.id] ? (
                                        <select 
                                            value={withdraw.status} 
                                            onChange={(e) => handleStatusChange(withdraw.id, e.target.value)}
                                            className="border rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="approved">Approved</option>
                                            <option value="declined">Declined</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    ) : (
                                        <span className="font-medium text-gray-700">{withdraw.status}</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-300">
                                    {editMode[withdraw.id] ? (
                                        <button 
                                            onClick={() => handleSubmit(withdraw.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                                        >
                                            Submit
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleEditClick(withdraw.id)}
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

export default Withdraw;
