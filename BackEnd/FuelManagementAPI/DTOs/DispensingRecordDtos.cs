namespace FuelManagementAPI.DTOs
{
    public class CreateDispensingRecordRequest
    {
        public string DispenserNo { get; set; }
        public decimal Quantity { get; set; }
        public string VehicleNumber { get; set; }
        public string PaymentMode { get; set; }
    }

    public class DispensingRecordResponse
    {
        public int Id { get; set; }
        public string DispenserNo { get; set; }
        public decimal Quantity { get; set; }
        public string VehicleNumber { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentProofFilename { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class FilterRequest
    {
        public string DispenserNo { get; set; }
        public string PaymentMode { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
