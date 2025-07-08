import Hospital from '../models/hospital.js';
import bcrypt from 'bcrypt';

export const insertSampleHospitals = async () => {
  try {
    // First, check if we already have hospitals
    const count = await Hospital.countDocuments();
    if (count > 0) {
      console.log('Sample data already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('Test@123', 10);
    
    const sampleHospitals = [
      {
        name: 'City Hospital',
        emailId: 'city.hospital@example.com',
        password: hashedPassword,
        phoneNumber: '9876543210',
        licenseNumber: 'LIC123456',
        state: 'Andhra Pradesh',
        city: 'Visakhapatnam',
        bloodInventory: {
          'A+': 10,
          'A-': 5,
          'B+': 15,
          'B-': 8,
          'AB+': 6,
          'AB-': 3,
          'O+': 20,
          'O-': 7
        }
      },
      {
        name: 'District Hospital',
        emailId: 'district.hospital@example.com',
        password: hashedPassword,
        phoneNumber: '9876543211',
        licenseNumber: 'LIC123457',
        state: 'Andhra Pradesh',
        city: 'Guntur',
        bloodInventory: {
          'A+': 8,
          'A-': 4,
          'B+': 12,
          'B-': 6,
          'AB+': 5,
          'AB-': 2,
          'O+': 15,
          'O-': 5
        }
      }
    ];

    await Hospital.insertMany(sampleHospitals);
    console.log('Sample hospitals inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};
