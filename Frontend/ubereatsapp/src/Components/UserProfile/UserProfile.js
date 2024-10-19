import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Or use fetch
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';

// Profile Page Component
const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    city: '',
    state: '',
    country: '',
    nickname: '',
    profilePic: 'https://via.placeholder.com/150',
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Fetch initial profile data and countries when the component mounts
  useEffect(() => {
    fetchProfileData();
    fetchCountries();
  }, []);

  // Fetch user profile by ID
  const fetchProfileData = async () => {
    try {
      axios
      .get('http://127.0.0.1:8000/api/customers/me', {
        withCredentials: true, // Ensure cookies are sent
      })
    .then((response) => {
      console.log('Profile data:', response.data);
      // Handle the profile data (e.g., update the state)
      setProfile(response.data);
    })
    .catch((error) => {
      console.error('Error fetching profile data:', error);
      // Handle errors (e.g., show a notification)
    });
    
     
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      const response = await axios.get('/api/countries');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  // Fetch states based on selected country
  const fetchStates = async (country) => {
    try {
      const response = await axios.get(`/api/states?country=${country}`);
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  // Fetch cities based on selected state
  const fetchCities = async (state) => {
    try {
      const response = await axios.get(`/api/cities?state=${state}`);
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });

    if (name === 'country') fetchStates(value);
    if (name === 'state') fetchCities(value);
  };

  // Handle profile picture upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profilePic: imageUrl });
    }
  };

  // Save profile changes
  const handleSave = () => {
    setEditMode(false);
    console.log('Profile saved:', profile);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Account Info</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <div className="text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="rounded-circle"
                  width="150"
                  height="150"
                />
                <label htmlFor="upload-button" className="position-absolute bottom-0 end-0">
                  <Button variant="light" className="p-1 shadow-sm">
                    <i className="bi bi-pencil"></i>
                  </Button>
                </label>
                <input
                  type="file"
                  id="upload-button"
                  style={{ display: 'none' }}
                  onChange={handleProfilePicUpload}
                />
              </div>
            </div>

            <Form className="mt-4">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    {editMode ? (
                      <Form.Select
                        name="country"
                        value={profile.country}
                        onChange={handleInputChange}
                      >
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type="text"
                        value={profile.country}
                        readOnly
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formState">
                    <Form.Label>State</Form.Label>
                    {editMode ? (
                      <Form.Select
                        name="state"
                        value={profile.state}
                        onChange={handleInputChange}
                      >
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        type="text"
                        value={profile.state}
                        readOnly
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {editMode ? (
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
