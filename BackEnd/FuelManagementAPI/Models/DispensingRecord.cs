namespace FuelManagementAPI.Models
{
    public class DispensingRecord
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string DispenserNo { get; set; }
        public decimal Quantity { get; set; }
        public string VehicleNumber { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentProofFilename { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
