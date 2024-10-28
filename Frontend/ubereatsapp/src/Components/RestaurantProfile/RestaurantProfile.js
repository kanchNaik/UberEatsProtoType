import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card, Container, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';

const RestaurantProfile = ({ userId }) => {
  const [profile, setProfile] = useState({
    restaurant_name: '',
    phone_number: '',
    location: '',
    profile_image: null,
    username: '',
    description: '',
    timings: '',
    image: '',
    uberone: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    axios
      .get(`${BASE_API_URL}/api/restaurants/me`, {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        withCredentials: true,
      })
      .then((response) => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...response.data,
          profile_image: response.data.profile_image,
        }));
      })
      .catch((error) => {
        messageService.showMessage('error', 'Error fetching profile data');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setProfile({ ...profile, uberone: checked });
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
      .put(`${BASE_API_URL}/api/restaurants/me/`, profile, {
        headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data);
        messageService.showMessage('success', 'Your profile is saved successfully');
      })
      .catch(() => {
        messageService.showMessage('error', 'Error saving profile data');
      });
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
      .put(`${BASE_API_URL}/api/customers/profile-picture/`, formData, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data);
        setImageModal(false);
        messageService.showMessage('success', 'Successfully uploaded profile picture');
      })
      .catch(() => {
        messageService.showMessage('error', 'Error saving profile picture');
      });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Account Info</h2>
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={8}>
          <Card className="p-4">
            <div className="text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={profile.image || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="img-fluid mb-3"
                  style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                />
                <Button variant="light" className="p-1 shadow-sm position-absolute bottom-0 end-0" onClick={handlePencilClick}>
                  <i className="bi bi-pencil"></i>
                </Button>
              </div>
            </div>

            <Form className="mt-4">
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formName">
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="restaurant_name"
                      value={profile.restaurant_name || ''}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone_number"
                      value={profile.phone_number || ''}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email || ''}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={profile.location || ''}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={profile.description || ''}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="formUberOne">
                    <Form.Check
                      type="checkbox"
                      label="Uber One"
                      checked={profile.uberone}
                      onChange={editMode ? handleCheckboxChange : null}
                      disabled={!editMode}
                    />
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
