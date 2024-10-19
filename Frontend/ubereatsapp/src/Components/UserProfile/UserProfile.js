import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Container, Dropdown } from 'react-bootstrap';

// Dummy country list
const countries = ['United States', 'India', 'Canada', 'Australia', 'Germany', 'Japan'];

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'kanchan',
    phone: '+918805947163',
    email: 'kanchannaik55@gmail.com',
    dateOfBirth: '',
    city: '',
    country: 'India',
    nickname: '',
    profilePic: 'https://via.placeholder.com/150', // Placeholder image
  });

  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profilePic: imageUrl });
    }
  };

  const handleSave = () => {
    setEditMode(false);
    // Here you can also add logic to send updated data to backend
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
                  <Form.Group controlId="formCity">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formCountry">
                    <Form.Label>Country</Form.Label>
                    <Form.Select
                      name="country"
                      value={profile.country}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formNickname">
                    <Form.Label>Nickname</Form.Label>
                    <Form.Control
                      type="text"
                      name="nickname"
                      value={profile.nickname}
                      onChange={handleInputChange}
                      readOnly={!editMode}
                    />
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

export default ProfilePage;
