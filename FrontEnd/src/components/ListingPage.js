import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Card,
  Spinner,
} from 'react-bootstrap';
import { dispensingAPI } from '../api/axiosConfig';
import '../styles/Listing.css';

function ListingPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    dispenserNo: '',
    paymentMode: '',
    startDate: '',
    endDate: '',
  });

  const dispenserOptions = ['', 'D-01', 'D-02', 'D-03', 'D-04'];
  const paymentModes = ['', 'Cash', 'Credit Card', 'UPI'];

  useEffect(() => {
    // Fetch records whenever filters change after initial load
    fetchRecords();
  }, [filters]);

  const fetchRecords = async (filterData = null) => {
    setLoading(true);
    setError('');

    try {
      const filterPayload = filterData || {
        dispenserNo: filters.dispenserNo || 'ALL DISPENSERS',
        paymentMode: filters.paymentMode || 'ALL PAYMENT MODES',
        startDate: filters.startDate ? new Date(filters.startDate) : null,
        endDate: filters.endDate ? new Date(filters.endDate) : null,
      };

      const response = await dispensingAPI.getRecords(filterPayload);
      setRecords(response.data);
    } catch (err) {
      setError('Failed to fetch records. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilter = () => {
    fetchRecords();
  };

  const handleResetFilter = () => {
    setFilters({
      dispenserNo: '',
      paymentMode: '',
      startDate: '',
      endDate: '',
    });
    fetchRecords({
      dispenserNo: 'ALL DISPENSERS',
      paymentMode: 'ALL PAYMENT MODES',
      startDate: null,
      endDate: null,
    });
  };

  const handleDownload = async (filename) => {
    try {
      const response = await dispensingAPI.downloadFile(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
    } catch (err) {
      setError('Failed to download file.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container className="listing-container mt-5 mb-5">
      <Card className="filter-card mb-4">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">Filter Records</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Dispenser No</Form.Label>
                <Form.Select
                  name="dispenserNo"
                  value={filters.dispenserNo}
                  onChange={handleFilterChange}
                >
                  {dispenserOptions.map((dispenser) => (
                    <option key={dispenser} value={dispenser}>
                      {dispenser || 'All Dispensers'}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select
                  name="paymentMode"
                  value={filters.paymentMode}
                  onChange={handleFilterChange}
                >
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode || 'All Payment Modes'}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>

            <Col md={2} className="d-flex align-items-end gap-2">
              <Button
                variant="primary"
                onClick={handleApplyFilter}
                className="w-100"
              >
                Apply
              </Button>
              <Button
                variant="secondary"
                onClick={handleResetFilter}
                className="w-100"
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <Alert variant="info">No records found.</Alert>
      ) : (
        <Card className="records-card">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Dispensing Records ({records.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Dispenser No</th>
                    <th>Quantity (L)</th>
                    <th>Vehicle No</th>
                    <th>Payment Mode</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.dispenserNo}</td>
                      <td>{record.quantity.toFixed(2)}</td>
                      <td>{record.vehicleNumber}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {record.paymentMode}
                        </span>
                      </td>
                      <td>{formatDate(record.createdAt)}</td>
                      <td>
                        {record.paymentProofFilename && (
                          <Button
                            className='btn-primary'
                            variant="sm"
                            size="sm"
                            onClick={() =>
                              handleDownload(record.paymentProofFilename)
                            }
                          >
                            Download
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default ListingPage;
