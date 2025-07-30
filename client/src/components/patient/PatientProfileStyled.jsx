import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUserEdit, FaIdCard, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTint } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BASE_URL from '../../apiConfig';
import { AnimatedBlobs, GlassCard, SectionTitle, Button, PageLayout } from './PatientComponents';

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    emergencyContact: '',
    medicalHistory: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/patient/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to load profile');
        }
        
        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load profile. Please try again.');
        setLoading(false);
        toast.error('Error loading profile');
        console.error(error);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/patient/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setIsEditing(false);
      setLoading(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
      toast.error('Error updating profile');
      console.error(error);
    }
  };

  return (
    <PageLayout onMouseMove={handleMouseMove}>
      <AnimatedBlobs mouse={mouse.current} />
      
      <SectionTitle subtitle="View and manage your personal information">
        Patient Profile
      </SectionTitle>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <GlassCard className="p-6 lg:col-span-1">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <FaIdCard className="text-blue-500" />
                  Personal Details
                </h2>
                
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    type="button"
                    className="text-sm px-4 py-1 flex items-center gap-1"
                  >
                    <FaUserEdit />
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {profile.fullName ? profile.fullName[0].toUpperCase() : 'P'}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      className="border-b-2 border-blue-300 bg-transparent text-center focus:outline-none focus:border-blue-500"
                      required
                    />
                  ) : (
                    profile.fullName
                  )}
                </h3>
                
                <div className="mt-1 text-gray-600 flex items-center gap-1">
                  <FaTint className="text-red-500" />
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      value={profile.bloodGroup}
                      onChange={handleChange}
                      className="border-b-2 border-blue-300 bg-transparent focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    `Blood Group: ${profile.bloodGroup || 'Not specified'}`
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={profile.age}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  ) : (
                    <div className="text-gray-800">{profile.age} years</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="text-gray-800">{profile.gender}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                  {isEditing ? (
                    <textarea
                      name="medicalHistory"
                      value={profile.medicalHistory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      rows="3"
                    ></textarea>
                  ) : (
                    <div className="text-gray-800">{profile.medicalHistory || 'None specified'}</div>
                  )}
                </div>
              </div>
            </GlassCard>
            
            {/* Contact Information */}
            <GlassCard className="p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2 mb-6">
                <FaPhone className="text-blue-500" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      <span className="text-gray-800">{profile.email}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-blue-500" />
                      <span className="text-gray-800">{profile.phone}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={profile.emergencyContact}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-blue-500" />
                      <span className="text-gray-800">{profile.emergencyContact}</span>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="text-gray-800">{profile.address}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  ) : (
                    <div className="text-gray-800">{profile.city}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  ) : (
                    <div className="text-gray-800">{profile.state}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="pincode"
                      value={profile.pincode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  ) : (
                    <div className="text-gray-800">{profile.pincode}</div>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end mt-8 space-x-4">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white text-blue-600 hover:bg-gray-100 border border-blue-200"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </form>
      )}
    </PageLayout>
  );
};

export default PatientProfile;
