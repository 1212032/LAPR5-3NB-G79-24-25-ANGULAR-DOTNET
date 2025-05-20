using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace BackEnd.Domain.Shared
{
    [Table("SystemChangeLog")]
    public class SystemChangeLog : Entity <SystemChangeLogId> ,  IAggregateRoot
    {
        public string TableId { get; set; }   
        public string Table { get; set; }
        public string OldValues { get; set; }
        public string NewValues { get; set; }
        public DateTime ChangeDate { get; set; }
        public string ChangedBy { get; set; }
        public string LogType { get; set; }
    

        public SystemChangeLog(string tableId, string table, string oldValues, string newValues, string changedBy, string logType)
        {
            TableId = tableId;
            Table = table;
            OldValues = oldValues;
            NewValues = newValues;
            ChangeDate = DateTime.UtcNow;
            ChangedBy = changedBy;
            LogType = logType;
        }
    }
}
