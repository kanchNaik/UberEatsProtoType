import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for API calls
import { Form, Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';

// Profile Page Component
const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState({
    name: '',
    phone_number: '',
    date_of_birth: '',
    city: '',
    state: '',
    country: '',
    nickname: '',
    profile_image: null,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProfileData();
    fetchCountries();
  }, []);

  const fetchProfileData = () => {
    axios
      .get('http://localhost:8000/api/customers/me', {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        withCredentials: true,
      })
      .then((response) => {
        console.log('Profile data:', response.data);
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...response.data,
          profile_image: response.data.profile_image,
        }));
        if (response.data.country) fetchStates(response.data.country);
        if (response.data.state) fetchCities(response.data.country, response.data.state);
      })
      .catch((error) => console.error('Error fetching profile data:', error));
  };

  const fetchCountries = () => {
    axios
      .get('https://countriesnow.space/api/v0.1/countries')
      .then((response) => setCountries(response.data.data))
      .catch((error) => console.error('Error fetching countries:', error));
  };

  const fetchStates = (countryName) => {
    axios
      .post('https://countriesnow.space/api/v0.1/countries/states', { country: countryName })
      .then((response) => setStates(response.data.data.states))
      .catch((error) => console.error('Error fetching states:', error));
  };

  const fetchCities = (countryName, stateName) => {
    axios
      .post('https://countriesnow.space/api/v0.1/countries/state/cities', { country: countryName, state: stateName })
      .then((response) => setCities(response.data.data))
      .catch((error) => console.error('Error fetching cities:', error));
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setProfile((prevProfile) => ({
      ...prevProfile,
      country: countryName,
      state: '',
      city: '',
    }));
    if (countryName) fetchStates(countryName);
    else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    setProfile((prevProfile) => ({
      ...prevProfile,
      state: stateName,
      city: '',
    }));
    if (stateName && profile.country) fetchCities(profile.country, stateName);
    else setCities([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profile_image: imageUrl });
    }
  };

  const handleSave = () => {
    setEditMode(false);
    axios
      .put('http://localhost:8000/api/customers/me/', profile, {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        withCredentials: true,
      })
      .then((response) => setProfile(response.data))
      .catch((error) => console.error('Error saving profile data:', error));
  };

  const handlePencilClick = () => setImageModal(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfile((prevProfile) => ({ ...prevProfile, profile_image: imageUrl }));
    }
  };

  const handleImageUpload = () => {
    if (!imageFile) return;
  
    const formData = new FormData();
    formData.append('nickname', profile.nickname);
    formData.append('profile_image', imageFile);
  
    axios
      .put('http://localhost:8000/api/customers/profile-picture/', formData, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'), // Ensure the CSRF token is correctly fetched
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // This ensures the cookies are sent
      })
      .then((response) => {
        console.log('Image and nickname updated:', response.data);
        setProfile(response.data); // Update the profile state with the new data
        setImageModal(false); // Close the modal after success
      })
      .catch((error) => console.error('Error uploading image:', error));
  };
  

  return (
    <Container className="mt-5">
      <h2 className="text-center">Account Info</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <div className="text-center">
              <div className="position-relative d-inline-block">
                <img src={profile.profile_image || 'https://via.placeholder.com/150'} alt="Profile" className="rounded-circle" width="150" height="150" />
                <Button variant="light" className="p-1 shadow-sm" onClick={handlePencilClick}>
                  <i className="bi bi-pencil"></i>
                </Button>
              </div>
            </div>

            <Form className="mt-4">
              {/* Name and Phone Number */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={profile.name || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phone_number" value={profile.phone_number || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>

              {/* Email and DOB */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={profile.email || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" name="date_of_birth" value={profile.date_of_birth || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>

              {/* Location Fields */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Select name="country" value={profile.country || ''} onChange={handleCountryChange} disabled={!editMode}>
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country.country} value={country.country}>
                          {country.country}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formState">
                    <Form.Label>State</Form.Label>
                    <Form.Select name="state" value={profile.state || ''} onChange={handleStateChange} disabled={!editMode}>
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Nickname */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formNickname">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control type="text" name="nickname" value={profile.nickname || ''} onChange={handleInputChange} readOnly={!editMode} />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" onClick={() => setEditMode(!editMode)}>
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
              {editMode && (
                <Button variant="success" className="ms-2" onClick={handleSave}>
                  Save Changes
                </Button>
              )}
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Image Upload Modal */}
      <Modal show={imageModal} onHide={() => setImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile">
            <Form.Label>Select an image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setImageModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImageUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
