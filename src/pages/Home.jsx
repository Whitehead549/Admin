import React, { useState, useEffect } from 'react';
import { db } from '../Config/Config'; // Adjust the import based on your Firebase setup
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';

const cryptoWallets = [
  'BITCOIN',
  'ETHEREUM',
  'USDT(TRC 20)',
  'USDT (ERC 20)',
  // Add more wallet types as needed
];

const Home = () => {
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const fetchWallets = async () => {
    try {
      const walletsCollection = collection(db, 'wallets');
      const querySnapshot = await getDocs(walletsCollection);
      
      if (querySnapshot.empty) {
        console.log("No wallets found.");
        setWalletData([]);
        return;
      }

      const wallets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWalletData(wallets);
    } catch (error) {
      console.error("Error fetching wallets: ", error);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        const walletRef = doc(db, 'wallets', currentId);
        await updateDoc(walletRef, {
          walletType: selectedWallet,
          walletAddress,
        });
      } else {
        await addDoc(collection(db, 'wallets'), {
          walletType: selectedWallet,
          walletAddress,
        });
      }

      setSelectedWallet('');
      setWalletAddress('');
      setEditMode(false);
      setCurrentId(null);
      fetchWallets(); // Refresh the wallet data
    } catch (error) {
      console.error("Error adding/updating wallet: ", error);
    }
  };

  const handleEdit = (wallet) => {
    setSelectedWallet(wallet.walletType);
    setWalletAddress(wallet.walletAddress);
    setEditMode(true);
    setCurrentId(wallet.id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crypto Wallet Management</h1>

      <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Crypto Wallet</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Crypto Wallet</label>
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>Select a wallet</option>
              {cryptoWallets.map(wallet => (
                <option key={wallet} value={wallet}>{wallet}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Wallet Address</label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {editMode ? 'Update Wallet' : 'Add Wallet'}
          </button>
        </form>

        <h3 className="mt-6 text-lg font-semibold">Wallets List</h3>
        <ul>
          {walletData.map(wallet => (
            <li key={wallet.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <strong>{wallet.walletType}</strong>: {wallet.walletAddress}
              </div>
              <button
                onClick={() => handleEdit(wallet)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;

