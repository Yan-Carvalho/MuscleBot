import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Users, Dumbbell, LogOut, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Students from './Students';
import Workouts from './Workouts';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleWhatsapp = () => {
    setWhatsappConnected(!whatsappConnected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                {user?.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleWhatsapp}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm font-medium",
                  whatsappConnected
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                <Phone className="h-4 w-4 mr-2" />
                {whatsappConnected ? 'WhatsApp Connected' : 'Connect WhatsApp'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
          <nav className="mt-4">
            <div className="flex space-x-4">
              <NavLink
                to="students"
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    isActive
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-600 hover:bg-gray-100"
                  )
                }
              >
                <Users className="h-4 w-4 mr-2" />
                Students
              </NavLink>
              <NavLink
                to="workouts"
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    isActive
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-600 hover:bg-gray-100"
                  )
                }
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                Workouts
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="students" element={<Students />} />
          <Route path="workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}