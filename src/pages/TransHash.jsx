import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore'; // Removed setDoc and arrayUnion
import { db } from '../Config/Config';

const TransHash = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // State for the selected image

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
                    uid: doc.data().uid || '',
                    proofOfPayment: doc.data().proofOfPayment || '',
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

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center py-6">
            <div className="w-full max-w-5xl px-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Proof of Payment</h1>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Table for Medium and Large Screens */}
                    <table className="hidden md:table w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="py-4 px-6 text-sm font-medium text-gray-600">First Name</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-600">Last Name</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-600">UID</th>
                                <th className="py-4 px-6 text-sm font-medium text-gray-600">Proof Of Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deposits.map((deposit) => (
                                <tr key={deposit.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 text-sm text-gray-800">{deposit.firstName}</td>
                                    <td className="py-4 px-6 text-sm text-gray-800">{deposit.lastName}</td>
                                    <td className="py-4 px-6 text-sm text-gray-800">{deposit.uid}</td>
                                    <td className="py-4 px-6 text-sm text-gray-800">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => setSelectedImage(deposit.proofOfPayment)}
                                        >
                                            View proof
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Card View for Small Screens */}
                    <div className="md:hidden">
                        {deposits.map((deposit) => (
                            <div key={deposit.id} className="border-b last:border-none p-4">
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                    <strong>First Name:</strong> {deposit.firstName}
                                </p>
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                    <strong>Last Name:</strong> {deposit.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>UID:</strong> {deposit.uid}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => setSelectedImage(deposit.proofOfPayment)}
                                    >
                                        View proof
                                    </button>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for Image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedImage(null)} // Close modal on overlay click
                >
                    <div className="bg-white p-4 rounded-lg">
                        <img
                            src={selectedImage}
                            alt="Proof of Payment"
                            className="max-w-full max-h-screen rounded"
                        />
                        <button
                            className="mt-4 text-red-500 hover:underline"
                            onClick={() => setSelectedImage(null)} // Close button
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransHash;
