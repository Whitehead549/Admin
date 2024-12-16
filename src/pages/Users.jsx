import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore'; // Removed setDoc and arrayUnion
import { db } from '../Config/Config';

const Users = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeposits = async () => {
            try {
                const depositsCollection = collection(db, 'users');
                const q = query(depositsCollection); // Fetch all deposits
                const querySnapshot = await getDocs(q);
                
                const depositsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    firstName: doc.data().firstName || '',
                    lastName: doc.data().lastName || '',
                    uid: doc.data().uid || '',
                    phoneNumber: doc.data().phoneNumber || '',
                    email: doc.data().email || '',
                    country: doc.data().country || ''
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
    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Users</h1>
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Table for Medium and Large Screens */}
      <table className="hidden md:table w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            <th className="py-4 px-6 text-sm font-medium text-gray-600">First Name</th>
            <th className="py-4 px-6 text-sm font-medium text-gray-600">Last Name</th>
            <th className="py-4 px-6 text-sm font-medium text-gray-600">UID</th>
            <th className="py-4 px-6 text-sm font-medium text-gray-600">Phone Number</th>
            <th className="py-4 px-6 text-sm font-medium text-gray-600">Email</th>
            <th className="py-4 px-6 text-sm font-medium text-gray-600">Country</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id} className="hover:bg-gray-50">
              <td className="py-4 px-6 text-sm text-gray-800">{deposit.firstName}</td>
              <td className="py-4 px-6 text-sm text-gray-800">{deposit.lastName}</td>
              <td className="py-4 px-6 text-sm text-gray-800">{deposit.uid}</td>
              <td className="py-4 px-6 text-sm text-gray-800">{deposit.phoneNumber}</td>
              <td className="py-4 px-6 text-sm text-gray-800">{deposit.email}</td>
              <td className="py-4 px-6 text-sm text-gray-800">{deposit.country}</td>
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
              <strong>Phone:</strong> {deposit.phoneNumber}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {deposit.email}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Country:</strong> {deposit.country}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

    );
};

export default Users;
