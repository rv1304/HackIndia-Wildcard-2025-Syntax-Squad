import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"admin" | "seller" | "buyer">("buyer");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, name);
    navigate("/");
  };

  const roleInfo = {
    admin: {
      title: 'Administrator',
      description: 'Manage approvals, oversee marketplace',
      color: 'bg-red-500',
      icon: '👑'
    },
    seller: {
      title: 'Seller',
      description: 'List products, manage inventory',
      color: 'bg-blue-500',
      icon: '🏪'
    },
    buyer: {
      title: 'Buyer',
      description: 'Browse marketplace, purchase NFTs',
      color: 'bg-green-500',
      icon: '🛒'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left side - Role selection */}
            <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
              <h1 className="text-4xl font-bold mb-6">Welcome to AuthX</h1>
              <p className="text-xl mb-8 text-indigo-100">
                Choose your role to access the marketplace
              </p>
              
              <div className="space-y-4">
                {Object.entries(roleInfo).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setRole(key as 'admin' | 'seller' | 'buyer')}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                      role === key 
                        ? 'bg-white bg-opacity-20 border-2 border-white' 
                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{info.title}</h3>
                        <p className="text-sm text-indigo-100">{info.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="md:w-1/2 p-8">
              <div className="max-w-sm mx-auto">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${roleInfo[role].color} text-white text-2xl mb-4`}>
                    {roleInfo[role].icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {roleInfo[role].title} Login
                  </h2>
                  <p className="text-gray-600">{roleInfo[role].description}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Wallet Address
                    </Label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600">
                      Connect your wallet to continue
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${roleInfo[role].color} hover:opacity-90`}
                  >
                    Enter as {roleInfo[role].title}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    By continuing, you agree to our terms of service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
