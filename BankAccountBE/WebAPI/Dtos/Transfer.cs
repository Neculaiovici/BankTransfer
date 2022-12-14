namespace WebAPI.Dtos

{
    public class Transfer
    {
        public string fromEmail { get; set; }
        public string toEmail { get; set; }
        public uint amount { get; set; }
    }
}