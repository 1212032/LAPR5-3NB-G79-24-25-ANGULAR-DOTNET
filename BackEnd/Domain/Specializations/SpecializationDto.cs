namespace BackEnd.Domain.Specializations
{
    public class CreateSpecializationDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class SpecializationDto : CreateSpecializationDto
    {
        public int Id { get; set; }
    }
}