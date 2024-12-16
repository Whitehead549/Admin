import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaMoneyBillWave, FaChartLine, FaHandHoldingUsd, FaHistory, FaEnvelope, FaTimes} from 'react-icons/fa'; // Import icons

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:inset-auto md:w-64 w-64 transition-transform duration-200 ease-in-out bg-gray-800 text-white z-50`} // Add z-index to ensure it appears above other content
      style={{ zIndex: 50 }} // Add inline z-index for extra assurance
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-lg font-bold">Menu</span>
        <button 
          onClick={onClose} 
          className="text-white text-2xl md:hidden">
          &times;
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-8">
        <ul>
        <li>
            <Link to="/users" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaUser className="mr-3" /> {/* Icon */}
              Users
            </Link>
          </li>
          <li>
            <Link to="/Dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaHome className="mr-3" /> {/* Icon */}
              Admin
            </Link>
          </li>
          <li>
            <Link to="/deposits" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaUser className="mr-3" /> {/* Icon */}
              Deposits
            </Link>
          </li>
          <li>
            <Link to="/hash" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              < FaMoneyBillWave className="mr-3" /> {/* Icon */}
              TransHash
            </Link>
          </li>
          <li>
            <Link to="/timezone" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              <FaChartLine className="mr-3" /> {/* Icon */}
              Timezone
            </Link>
          </li>
          <li>
            <Link to="/withdraws" className="flex items-center px-4 py-2 hover:bg-gray-700 font-semibold text-lg py-3" onClick={onClose}>
              < FaMoneyBillWave className="mr-3" /> {/* Icon */}
              Withdraws
            </Link>
          </li>
         
          
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

