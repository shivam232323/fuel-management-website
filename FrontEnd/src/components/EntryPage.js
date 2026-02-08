import { useState } from 'react';
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { dispensingAPI } from '../api/axiosConfig';
import '../styles/Entry.css';

function EntryPage() {
  const [formData, setFormData] = useState({
    dispenserNo: '',
    quantity: '',
    vehicleNumber: '',
    paymentMode: 'Cash',
  });

  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispenserOptions = ['D-01', 'D-02', 'D-03', 'D-04'];
  const paymentModes = ['Cash', 'Credit Card', 'UPI'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Only JPG, PNG, and PDF are allowed.');
        return;
      }

      if (selectedFile.size > maxSize) {
        setError('File size exceeds 5 MB limit.');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (error) {
      setError(error);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('dispenserNo', formData.dispenserNo);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('vehicleNumber', formData.vehicleNumber);
      formDataToSend.append('paymentMode', formData.paymentMode);
      formDataToSend.append( 'paymentProof', file );
      
      dispensingAPI.createRecord(formDataToSend);

      setSuccess('Record created successfully!');
      setFormData({
        dispenserNo: '',
        quantity: '',
        vehicleNumber: '',
        paymentMode: 'Cash',
      });
      setFile(null);

      setTimeout(() => {
        navigate('/records', { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to create record. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="entry-container mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="entry-card">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Create Dispensing Record</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Dispenser No *</Form.Label>
                  <Form.Select
                    name="dispenserNo"
                    value={formData.dispenserNo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a dispenser</option>
                    {dispenserOptions.map((dispenser) => (
                      <option key={dispenser} value={dispenser}>
                        {dispenser}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Quantity Filled (Liters) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    step="0.1"
                    min="0"
                    placeholder="Enter quantity in liters"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="vehicleNumber"
                    placeholder="e.g., MH-02-AB-1234"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode *</Form.Label>
                  <Form.Select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    required
                  >
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Payment Proof (JPG, PNG, PDF) *</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                  />
                  {file && (
                    <small className="text-success">✓ {file.name}</small>
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating Record...' : 'Create Record'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EntryPage;
