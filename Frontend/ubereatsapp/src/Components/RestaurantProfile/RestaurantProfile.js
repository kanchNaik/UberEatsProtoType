import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for API calls
import { Form, Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';

// Profile Page Component
const RestaurantProfile = ({ userId }) => {
   const [profile, setProfile] = useState({
    restaurant_name: '',
    phone_number: '',
    location: '',
    state: '',
    country: '',
    profile_image: null,
    username:'',
    description:'',
    timings:'',
    images:[]
  });

  const [editMode, setEditMode] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProfileData();
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
      })
      .catch((error) => console.error('Error fetching profile data:', error));
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
                <img src={profile.profile_image || 'https://via.placeholder.com/150'} alt="Profile" width="700" height="150" />
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
                    <Form.Label>Restaurant Name</Form.Label>
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
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" value={profile.location || ''} onChange={handleInputChange} readOnly={!editMode} />
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

export default RestaurantProfile;
