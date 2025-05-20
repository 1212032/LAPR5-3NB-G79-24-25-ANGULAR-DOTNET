namespace BackEnd.Domain.OperationTypes
{
    public class OperationRequestDto : CreatingOperationRequestDto
    {
        public OperationRequestDto(int id, string status, string deadlineDate, string priority,
        int operationType, string patientMedicalRecordNumber) : base(deadlineDate, priority, operationType, patientMedicalRecordNumber)
        {
            this.Id = id;
            this.Status = status;
        }
        public int Id { get; set; }
        public string Status { get; set; }
    }

    public class CreatingOperationRequestDto
    {
        public CreatingOperationRequestDto(string deadlineDate, string priority, int operationType, string patientMedicalRecordNumber)
        {
            this.DeadlineDate = deadlineDate;
            this.Priority = priority;
            this.OperationType = operationType;
            this.PatientMedicalRecordNumber = patientMedicalRecordNumber;
        }
        public string DeadlineDate { get; set; }
        public string Priority { get; set; }
        public int OperationType { get; set; }
        public string PatientMedicalRecordNumber { get; set; }
    }
}
