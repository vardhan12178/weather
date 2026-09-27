// Browsable city chips shown in the search dropdown when the input is empty.
// Suggestions while typing come from live geocoding (see SearchBox).
export const popularCitiesByRegion: Record<string, string[]> = {
  'North': [
    'Delhi', 'Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar',
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner',
    'Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Allahabad', 'Meerut',
    'Dehradun', 'Haridwar', 'Rishikesh', 'Shimla', 'Mussoorie',
    'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Mathura',
  ],
  'South': [
    'Bangalore', 'Chennai', 'Hyderabad', 'Kochi', 'Thiruvananthapuram',
    'Coimbatore', 'Madurai', 'Vijayawada', 'Visakhapatnam', 'Mangalore',
    'Mysore', 'Tiruchirappalli', 'Salem', 'Tirupati', 'Kozhikode',
    'Tirunelveli', 'Vellore', 'Guntur', 'Warangal', 'Nellore',
  ],
  'West': [
    'Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
    'Nashik', 'Nagpur', 'Aurangabad', 'Kolhapur', 'Solapur',
    'Thane', 'Navi Mumbai', 'Panaji', 'Vasco da Gama', 'Bhavnagar',
    'Jamnagar', 'Gandhinagar', 'Anand', 'Amravati',
  ],
  'East': [
    'Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati',
    'Siliguri', 'Cuttack', 'Jamshedpur', 'Dhanbad', 'Puri',
    'Imphal', 'Shillong', 'Agartala', 'Aizawl', 'Dibrugarh',
    'Brahmapur', 'Rourkela', 'Bokaro', 'Durgapur', 'Asansol',
  ],
  'Central': [
    'Bhopal', 'Indore', 'Raipur', 'Jabalpur', 'Gwalior',
    'Ujjain', 'Bilaspur', 'Sagar', 'Satna', 'Korba',
  ],
};

/** Quick picks on the error / welcome screen */
export const quickCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];
